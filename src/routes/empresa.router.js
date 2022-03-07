const express = require('express');
const controladorEmpresas = require('../controllers/empresa.controller');
const md_authentication = require('../middlewares/autenticacion');

const api = express.Router();
api.put('/editarEmpresa/:idEmpresa',  md_authentication.Auth, controladorEmpresas.EditarEmpresas);
api.post('/agregarEmpresas',  md_authentication.Auth, controladorEmpresas.AgregarEmpresas);

module.exports = api;