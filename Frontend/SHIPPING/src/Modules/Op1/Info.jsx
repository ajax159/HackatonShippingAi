import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Box, Button, Card, CardContent, CardMedia, Grid, Skeleton, Typography, List, ListItem, ListItemText, OutlinedInput } from '@mui/material';
import useStore from '../../Hooks/useStore';
import { Steps } from 'intro.js-react';
import caja from '../../assets/CAJA1.jpg';

let socket;


// eslint-disable-next-line react/prop-types
const Info = ({ Introsteps }) => {
  // eslint-disable-next-line no-unused-vars
  const { weight, width, height, length, setLength, setWidth, setHeight, setWeight, setSize } = useStore();
  const [introEnabled, setIntroEnabled] = useState(true);
  const [image, setImage] = useState(caja);
  const isCameraRunning = useRef(false);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const websocket = import.meta.env.VITE_REACT_APP_WEBSOCKET;
  const api = import.meta.env.VITE_REACT_APP_AZUREVISION_API;

  const onExit = () => {
    setIntroEnabled(true);
  };

  const startCamera = () => {
    if (!isCameraRunning.current) {
      socket = io(websocket, {
        mode: 'no-cors',
        transports: ['websocket'],
      });

      socket.on('frame', (data) => {
        setImage(`data:image/jpeg;base64,${data.image}`);
        setLoading(false);
      });

      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        isCameraRunning.current = true;
        setLoading(true);
        captureFrames();
      }).catch((error) => {
        console.error('Error accessing camera:', error);
      });
    }
  };

  const stopCamera = () => {
    if (isCameraRunning.current) {
      clearInterval(isCameraRunning.current);
      isCameraRunning.current = false;
    }
  };

  const captureFrames = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    const captureFrame = () => {
      if (!isCameraRunning.current) return;
  
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
  
      if (imageData) {
        console.log('Captured frame:', imageData.slice(0, 100)); // Mostrar los primeros 100 caracteres
        socket.emit('camera_stream', { image_data: imageData });
      } else {
        console.error('Error capturing frame.');
      }
    };
  
    // Capturar y enviar un frame cada segundo
    const intervalId = setInterval(() => {
      captureFrame();
    }, 1000);
  
    // Almacenar el ID del intervalo para poder limpiarlo más tarde
    isCameraRunning.current = intervalId;
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopCamera();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopCamera();
    };
  }, []);

  const setDimensiones = () => {
    if (socket) {
      socket.on('object_dimensions', (data) => {
        setWidth(Math.floor(data.width));
        setHeight(Math.floor(data.height));
        setLength(Math.floor(data.length));
      });
    }
    postImage();
  };

  const postImage = async () => {
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(api, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSize(data.tagname);
      console.log(data.tagname);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <React.Fragment>
      <Steps
        enabled={introEnabled}
        steps={Introsteps}
        initialStep={0}
        onExit={onExit}
      />
      <Grid container spacing={3} direction="column">
        <Grid item xs={12}>
          <Card style={{ backgroundColor: 'rgb(9, 14, 16)' }} id='step-1'>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button id='step-2' variant="contained" color="primary" onClick={startCamera} sx={{ marginBottom: 1 }}>
                  Start
                </Button>
                <Button id='step-3' variant="contained" color="secondary" onClick={stopCamera} sx={{ marginBottom: 1 }}>
                  Stop
                </Button>
              </Box>
              {loading ? (
                <Skeleton variant="rounded" width="400px" height='250px' animation="wave" sx={{marginBottom: 1}} />
              ) : (
                <CardMedia
                  id='step-py'
                  component="img"
                  image={image}
                  alt="Camera Feed"
                  sx={{ width: '400px', height: '250px', marginBottom: 1, borderRadius: '10px'}}
                />
              )}
              <Box sx={{ display: 'flex',justifyContent: 'center' }}>
                <Button
                id='step-4'
                variant="outlined"
                color="primary"
                onClick={setDimensiones}>
                  Calculate Dimensions
                
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Box id='step-5' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box>
              <Typography variant="h4">
                Package Details
              </Typography>
            </Box>
            <List disablePadding sx={{ width: '100%' }}>
              <ListItem key='Length (cm)' sx={{ py: 1, px: 0 }}>
                <ListItemText
                  sx={{ mr: 2 }}
                  primary='Length (cm)'
                />
                <Typography variant="body1" fontWeight="medium">
                  {length}
                </Typography>
              </ListItem>
            </List>
            <List disablePadding sx={{ width: '100%' }}>
              <ListItem key='Width (cm)' sx={{ py: 1, px: 0 }}>
                <ListItemText
                  sx={{ mr: 2 }}
                  primary='Width (cm)'
                />
                <Typography variant="body1" fontWeight="medium">
                  {width}
                </Typography>
              </ListItem>
            </List>
            <List disablePadding sx={{ width: '100%' }}>
              <ListItem key='Height (cm)' sx={{ py: 1, px: 0 }}>
                <ListItemText
                  sx={{ mr: 2 }}
                  primary='Height (cm)'
                />
                <Typography variant="body1" fontWeight="medium">
                  {height}
                </Typography>
              </ListItem>
            </List>
            <List disablePadding sx={{ width: '100%' }}>
              <ListItem key='Weight (kg)' sx={{ py: 1, px: 0 }}>
                <ListItemText
                  sx={{ mr: 2 }}
                  primary='Weight (kg)'
                />
                <OutlinedInput
                  sx={{ width: '70px', height: '30px'}}
                  id="step-6"
                  required
                  onChange={(event) => {
                    setWeight(event.target.value);
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </Grid>
      </Grid>
      <video ref={videoRef} style={{ display: 'none' }}></video>
    </React.Fragment>
  );
};

export default Info;
