const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')

function RegistrarAdmin(req, res) {
    var parametros = req.body;
    var modeloUsuario = new Usuario();

        if (parametros.nombre && parametros.apellido && parametros.password && parametros.email
            ) {
                modeloUsuario.nombre = parametros.nombre;
                modeloUsuario.apellido = parametros.apellido;
                modeloUsuario.email = parametros.email; 
                modeloUsuario.password = parametros.password;
                modeloUsuario.rol = 'ADMIN';

                bcrypt.hash(parametros.password, null, null, (err, passwordEncripatada) => {
                    modeloUsuario.password = passwordEncripatada;

                    modeloUsuario.save((err, usuarioGuardado) => {
                        if (err) return res.status(500)
                        .send({mensaje: 'Error en la peticion'})
                        if (!usuarioGuardado) return res.status(500)
                        .send({mensaje: 'Error al Registrar'});
    
                        return res.status(200).send({usuario: usuarioGuardado});
                    });
                })     
        }else {
            return res.status(500).send({mensaje:'Debe ingrear los parametros obligatorios'})
        }
}

function RegistrarEmpresa(req, res) {
            var parametros = req.body;
            var modeloUsuario = new Usuario();
            
            if( req.user.rol !== 'ADMIN') {
                return res.status(500).send({ mensaje: 'Permisos insuficientes' });
            }

                if (parametros.nombre && parametros.apellido && parametros.password && parametros.email
                    ) {
                        modeloUsuario.nombre = parametros.nombre;
                        modeloUsuario.apellido = parametros.apellido;
                        modeloUsuario.email = parametros.email; 
                        modeloUsuario.password = parametros.password;
                        modeloUsuario.rol = 'EMPRESA';
        
                        bcrypt.hash(parametros.password, null, null, (err, passwordEncripatada) => {
                            modeloUsuario.password = passwordEncripatada;
        
                            modeloUsuario.save((err, usuarioGuardado) => {
                                if (err) return res.status(500)
                                .send({mensaje: 'Error en la peticion'})
                                if (!usuarioGuardado) return res.status(500)
                                .send({mensaje: 'Error al Registrar'});
            
                                return res.status(200).send({usuario: usuarioGuardado});
                            });
                        })     
                }else {
                    return res.status(500).send({mensaje:'Debe ingrear los parametros obligatorios'})
                }
}
        
function Login(req, res) {
    var parametros = req.body;
    // BUSCAMOS EL CORREO
    Usuario.findOne({ email : parametros.email }, (err, usuarioEncontrado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (usuarioEncontrado){
            // COMPARAMOS CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword) => {//TRUE OR FALSE
                    if (verificacionPassword) {
                        return res.status(200)
                            .send({ token: jwt.crearToken(usuarioEncontrado) })
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'La contrasena no coincide.'})
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'El usuario, no se ha podido identificar'})
        }
    })
}

function EliminarUsuario(req, res) {
    var idProd = req.params.idProducto;
    if( req.user.rol !== 'Admin') {
        return res.status(500).send({ mensaje: "Permisos insuficientes" });
    }

    Usuario.findByIdAndDelete(req.params.idUsuario, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioEliminado) return res.status(500)
            .send({ mensaje: 'Error al eliminar el Usuario' })
        return res.status(200).send({ usuario: usuarioEliminado });
    })
}

function EliminarUsuario (req,res){
    var idUsuario = req.params.idUsuario;
    
    if( req.user.rol !== 'ADMIN') {
        return res.status(500)
        .send({ mensaje: 'Permisos insuficientes' });
    
}else{

    Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
    if(!usuarioEliminado) return res.status(500)
    .send({mensaje: 'Error al eliminar'});

    return res.status(200).send({ usuario: usuarioEliminado})

    })
}
}

function EditarUsuario(req,res){
    var parametros = req.body;
    var idUser = req.params.idUsuario;

    // BORRAR LA PROPIEDAD DE PASSWORD EN EL BODY
    delete parametros.password

    if( req.user.rol !== 'ADMIN') {
        return res.status(500).send({ mensaje: 'Permisos insuficientes' });
    }
    

    Usuario.findByIdAndUpdate(req.params.idUsuario , parametros, {new: true}, (err, usuarioEditado)=>{
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!usuarioEditado) return res.status(500).send({mensaje:'Error al editar el Usuario'});
        
        return res.status(200).send({usuario: usuarioEditado});
            
        
    })

}

function BusquedaNombreRegex(req, res) {
    var nomUser = req.params.nombreUsuario;

    Usuario.find({ nombre: { $regex: nomUser, $options: "i" } }, (err, usuariosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!usuariosEncontrados) return res.status(500)
            .send({ mensaje: 'Error al obtener los usuarios'})

        return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

function BusquedaNombreRegexBody(req, res) {
    var parametros = req.body;

    Usuario.find({ nombre: { $regex: parametros.nombre, $options: "i" } }, (err, usuariosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!usuariosEncontrados) return res.status(500)
            .send({ mensaje: 'Error al obtener los usuarios'})

        return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

function BusquedaNombreOApellido(req, res) {
    var parametros = req.body;

    Usuario.find({ $or: [
        { nombre: { $regex: parametros.nombre, $options: "i" } },
        { apellido: { $regex: parametros.apellido, $options: "i" } }
    ] }, (err, usuariosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!usuariosEncontrados) return res.status(500)
            .send({ mensaje: 'Error al obtener los usuarios'})

        return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

function BusquedaNombreYApellido(req, res) {
    var parametros = req.body;

    Usuario.find({ nombre: parametros.nombre, apellido: parametros.apellido }, 
        { nombre: 1 }, (err, usuariosEncontrados) => {
            if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
            if(!usuariosEncontrados) return res.status(500)
                .send({ mensaje: 'Error al obtener los usuarios'})

            return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

module.exports = {
    Login,
    RegistrarEmpresa,
    RegistrarAdmin,
    EliminarUsuario,
    EditarUsuario
    
    
}
