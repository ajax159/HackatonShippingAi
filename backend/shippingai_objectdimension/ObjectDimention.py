from gevent import monkey
monkey.patch_all()

from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import base64
import numpy as np
import cv2
from scipy.spatial import distance as dist

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent')

def tup(point):
    return (int(point[0]), int(point[1]))

def order_points(pts):
    rect = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]  # TL
    rect[2] = pts[np.argmax(s)]  # BR
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]  # TR
    rect[3] = pts[np.argmax(diff)]  # BL
    return rect

@socketio.on('camera_stream')
def handle_camera_stream(data):
    try:
        image_data = data.get('image_data', '')
        if ',' in image_data:

            image_bytes = base64.b64decode(image_data.split(',')[1])
            if not image_bytes:
                print("Error: La imagen está vacía después de la decodificación base64")
                return
            
            image_np = np.frombuffer(image_bytes, dtype=np.uint8)
            if image_np.size == 0:
                print("Error: El array numpy está vacío")
                return

            frame = cv2.imdecode(image_np, flags=cv2.IMREAD_COLOR)
            if frame is None:
                print("Error: cv2.imdecode devolvió None")
                return
            image_np = np.frombuffer(image_bytes, dtype=np.uint8)
            frame = cv2.imdecode(image_np, flags=cv2.IMREAD_COLOR)

            dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_5X5_50)
            parameters = cv2.aruco.DetectorParameters()
            res = cv2.aruco.detectMarkers(frame, dictionary, parameters=parameters)
            corners, _, _ = cv2.aruco.detectMarkers(frame, dictionary, parameters=parameters)

            if corners:
                int_corners = np.intp(corners)
                cv2.polylines(frame, int_corners, True, (0, 255, 0), 5)
                aruco_perimeter = cv2.arcLength(corners[0], True)
                pixel_cm_ratio = aruco_perimeter / 20

                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                blurred = cv2.GaussianBlur(gray, (5, 5), 0)
                edged = cv2.Canny(blurred, 50, 100)
                contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

                for cnt in contours:
                    rect = cv2.minAreaRect(cnt)
                    (cx, cy), (rw, rh), angle = rect
                    object_width = rw / pixel_cm_ratio
                    object_height = rh / pixel_cm_ratio

            if len(res[0]) > 0:
                hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
                h, s, v = cv2.split(hsv)
                mask = cv2.inRange(s, 30, 255)
                kernel = np.ones((5, 5), np.uint8)
                mask = cv2.dilate(mask, kernel, iterations=1)
                mask = cv2.erode(mask, kernel, iterations=1)
                contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
                contour = max(contours, key=cv2.contourArea)
                epsilon = 0.02 * cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, epsilon, True)

                if len(approx) == 6:
                    pts = approx.reshape(6, 2)
                    rect = order_points(pts[:4])
                    (tl, tr, br, bl) = rect
                    width = dist.euclidean(br, bl)
                    height = dist.euclidean(bl, tl)
                    length = dist.euclidean(tl, tr)
                    widthcm = (round(width) * 3) / 36
                    heightcm = (round(height) * 3) / 36
                    lengthcm = (round(length) * 3) / 37
                    socketio.emit('object_dimensions', {'width': widthcm, 'height': heightcm, 'length': lengthcm})

                    colors = [(0, 255, 0), (0, 255, 255), (255, 0, 255), (255, 255, 0)]
                    labels = ["TL", "TR", "BR", "BL"]
                    for i, point in enumerate(rect):
                        if i < 4:
                            cv2.circle(frame, tup(point), 5, colors[i], -1)
                            cv2.putText(frame, labels[i], tup(point), cv2.FONT_HERSHEY_SIMPLEX, 0.5, colors[i], 2)

                    if len(rect) == 4:
                        cv2.line(frame, tup(tl), tup(tr), (0, 255, 0), 2)
                        cv2.line(frame, tup(tr), tup(br), (0, 255, 0), 2)
                        cv2.line(frame, tup(br), tup(bl), (0, 255, 0), 2)
                        cv2.line(frame, tup(bl), tup(tl), (0, 255, 0), 2)

            _, buffer = cv2.imencode('.jpg', frame)
            frame_encoded = base64.b64encode(buffer).decode('utf-8')
            socketio.emit('frame', {'image': frame_encoded})
        else:
            print("Formato de image_data incorrecto.")
    except Exception as e:
        print(f"Error procesando la imagen: {e}")

@socketio.on('start_camera')
def start_camera(data):
    pass  # La lógica de inicio de la cámara ya está manejada por `camera_stream`

@socketio.on('stop_camera')
def stop_camera():
    pass  # La lógica de detención de la cámara ya está manejada por `camera_stream`

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
