const express = require("express");
const app = express();
const path = require('path');

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, X-Auth-Token, Origin, Authorization');
    next();
});
//testtest
const { predicX } = require('./src/app/prediction');
//const company = require("./test"); 
var fn = '';
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'src/images')
    },
    filename: (req, file , cb) => {
        //console.log(file)
        fn = Date.now() + path.extname(file.originalname);
        cb(null, fn)
    }
})

const upload = multer({storage: storage})



app.set('port', process.env.PORT || 5000)
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/upload", (req, res) => {
    res.render("upload");
});

app.post("/upload", upload.single('image') ,  (req, res) => {

    var valor;
    predicX(fn).then((v) => {
        valor = JSON.stringify(v);
        res.json(v);
    });
});

app.listen(app.get('port'));
console.log(app.get('port')+" is the port");
