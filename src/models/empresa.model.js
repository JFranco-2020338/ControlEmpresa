const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpresaSchema = Schema({
    nombre: String,
    direccion: String,
    empleados:[{
    idEmpleado: {type: Schema.Types.ObjectId, ref: 'Empleados'}}]
});

module.exports = mongoose.model('Empresas', EmpresaSchema);