const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    const { nombres, apellidos, email, password, fechaNacimiento, genero } = req.body;
    try {
        const userExistente = await User.findOne({ email });
        if (userExistente) {
            return res.status(400).json({ success: false, error: 'El correo ya está registrado' });
        }
        const nuevoUsuario = new User({ nombres, apellidos, email, password, fechaNacimiento, genero });
        await nuevoUsuario.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error registrando usuario: ', error);
        res.status(500).json({ success: false, error: 'Error al registrar usuario' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ success: false, error: 'Correo o contraseña incorrectos' });
        }
        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(400).json({ success: false, error: 'Correo o contraseña incorrectos' });
        }
        
        // Crear un token JWT con el ID del usuario
        const token = jwt.sign({ id: usuario._id }, 'token', { expiresIn: '1h' });
        //const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error durante el login: ', error);
        res.status(500).json({ success: false, error: 'Error al iniciar sesión' });
    }
});

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
    // Obtener el token del encabezado Authorization (formato: "Bearer[0] <token>[1]")
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'token', (err, decoded) => {
        if (err) return res.sendStatus(403);
        // Guardar los datos decodificados del token en req.user
        req.user = decoded;
        next(); // Continuar con la siguiente función
    });
};

router.get('/perfil', authenticateToken, async (req, res) => {
    try {
    const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
