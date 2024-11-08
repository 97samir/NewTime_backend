const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // nombres: { type: String, required: true },
    // apellidos: { type: String, required: true },

    nombres: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Permite solo letras y espacios
                return /^[a-zA-ZÀ-ÿ\s]+$/.test(value);
            },
            message: 'El nombre solo debe contener letras y espacios.'
        }
    },
    apellidos: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Permite solo letras y espacios
                return /^[a-zA-ZÀ-ÿ\s]+$/.test(value);
            },
            message: 'El apellido solo debe contener letras y espacios.'
        }
    },

    // email: { type: String, required: true, unique: true },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(email) {
                // Expresión regular para permitir solo los dominios deseados
                return /^[a-zA-Z0-9._-]+@(gmail\.com|hotmail\.com)$/.test(email);
            },
            message: 'Solo se permiten emails de dominios específicos: @gmail.com, @hotmail.com, @tuempresa.com'
        }
    },

    password: { 
        type: String, 
        required: true,
        validate: {
            validator: function(value){
                return value.length >=6;
            },
            message: 'La contraseña debe contener al menos 6 carácteres. '
        }
    },
    // fechaNacimiento: { type: Date, required: true },

    fechaNacimiento: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                const minDate = new Date('1905-01-01'); // Fecha mínima permitida
                const today = new Date(); // Fecha actual
                // Asegura que la fecha de nacimiento esté entre 1905 y hoy
                return value >= minDate && value <= today;
            },
            message: 'La fecha de nacimiento no puede ser posterior a la fecha actual.'
        }
    },

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
