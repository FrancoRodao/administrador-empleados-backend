if(process.env.NODE_ENV === 'development'){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const puerto = process.env.PUERTO;
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

//MIDDLEWARES
app.use(helmet())
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:4200': process.env.ORIGIN_CORS,
  credentials: true
}))
require("./database");

//ROUTES
app.use(cookieParser())
app.use("/uploads/images", express.static(path.resolve('uploads/images')))
app.use("/api", require('./rutas/employees.routes'))
app.use("/api", require('./rutas/authentication.routes'))
app.use("/api", require('./rutas/imagesEmployee.routes'))
//NO SE PUEDE UTILIZAR HAY QUE REGISTRARSE EN GOOGLE PARA CONSEGUIR UNA "LICENCIA"
//app.use("/api", require('./rutas/sendemail.routes'))


app.listen(puerto || 3000, () => {
  try {
    console.log("Servidor conectado en el puerto", puerto);
  } catch (err) {
    console.log("Ocurrio un error inesperado al conectar el servidor", err);
  }
});




