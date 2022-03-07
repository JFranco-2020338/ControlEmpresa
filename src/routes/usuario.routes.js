const express = require('express');
const controladorUsuario = require('../controllers/usuario.controller');
const md_authentication = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/registrarAdmin', controladorUsuario.RegistrarAdmin);
api.post('/registrarEmpresa', md_authentication.Auth, controladorUsuario.RegistrarEmpresa);
api.put('/editarUsuario/:idUsuario', md_authentication.Auth, controladorUsuario.EditarUsuario);
api.delete('/eliminarUsuario/:idUsuario', md_authentication.Auth, controladorUsuario.EliminarUsuario);
api.post('/login', controladorUsuario.Login);


module.exports = api;