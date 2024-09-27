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
    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ success: false, error: 'Correo o contraseña incorrectos' });
        }
        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(400).json({ success: false, error: 'Correo o contraseña incorrectos' });
        }
        const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error durante el login: ', error);
        res.status(500).json({ success: false, error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
