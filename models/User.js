const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    genero: { type: String, required: true },
}, { timestamps: true });

// Encriptar la contraseña antes de guardar el usuario
UserSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', UserSchema); //por defecto Users
//const User = mongoose.model('User', UserSchema,'mi_coleccion'); para crear la coleccion
module.exports = User;
