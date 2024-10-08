require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB Atlas
//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conexión exitosa a MongoDB Atlas"))
    .catch((error) => console.error("Error conectando a MongoDB Atlas: ", error));

//autoriza al navegador para que pueda enviar solicitud, transferencia de datos
// app.use(cors({
//     origin: 'https://newtimee.vercel.app', // Cambia a la URL de tu frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));


// Rutas
app.use('/auth', authRoutes);

// Servir archivos estáticos (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
