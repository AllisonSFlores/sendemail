var express = require('express');
var app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const transporter = require('./config/transporterconfig');
const multer = require('multer');
//config
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});
//multer
const storage = multer.diskStorage({
    destination: './documents',
    filename: function(req, file, cb) {
        cb(null, 'ListaEstudiantes.' + file.mimetype.split('/')[1])
    }
})
const upload = multer({ storage: storage });
app.post('/', upload.single('file'), (req, res) => {});

function createHtml(correo, pass) {
    var texto = "<html><body><div><img src=" + "\"https://drive.google.com/uc?export=view&id=1Ab0xeq9NwHg78vk735gNMVtN1QEBrAtA\"" + "<p></p>" +
        ">" + "Bienvenido Tu correo es: " + correo + "<p></p>" + "Tu contrasena es: " + pass + "</div>";
    fs.writeFile('./documents/usuario.html', texto, error => {
        if (error)
            console.log(error);
        else
            console.log('El archivo fue creado');
    });
}

app.post("/sendUser", [
    (req, res) => {
        createHtml(req.body.email, req.body.pass);
        var mailOptions = {
            from: "Teachable <teachableap@gmail.com>",
            to: req.body.email,
            subject: "Nuevo usuario",
            text: "Grcias por registrarse",
            attachments: [{
                path: './documents/usuario.html'
            }]
        }
        transporter.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                res.status(500).jsonp(error.message);

            } else {
                console.log("Email enviado")
                res.status(200).jsonp(req.body);
            }
        })
    }
]);



//ruta
app.post("/send", [
    (req, res) => {

        var mailOptions = {
            from: "Teachable <teachableap@gmail.com>",
            to: req.body.email,
            subject: "Lista techableWeb",
            text: "Lista de estudiantes del curso solicitado",
            attachments: [{
                path: './documents/ListaEstudiantes.pdf'
            }]
        }
        transporter.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                res.status(500).jsonp(error.message);

            } else {
                console.log("Email enviado")
                res.status(200).jsonp(req.body);
            }
        })
    }
]);


app.listen(3000, () => console.log("SERVIDOR EN PUERTO 3000"))