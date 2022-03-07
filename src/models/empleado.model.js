const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpleadoSchema = Schema({
    nombre: String,
    apellido: String,
    trabajo: String,
    edad: String,

});

module.exports = mongoose.model('Empleados', EmpleadoSchema);