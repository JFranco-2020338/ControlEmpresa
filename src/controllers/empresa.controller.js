const Empresas = require('../models/empresa.model');
const Empleados = require('../models/empleado.model');

function agregarEmpleados(req, res) {
    const parametros = req.body;
    const modeloEmpleados = new Empleados();

    if(parametros.nombre && parametros.apellido && parametros.edad && parametros.trabajo){

        modeloEmpleados.nombre = parametros.nombre;
        modeloEmpleados.apellido = parametros.apellido;
        modeloEmpleados.edad = parametros.edad;
        modeloEmpleados.trabajo = parametros.trabajo;

        modeloEmpleados.save((err, empleadoGuardado) => {
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!empleadoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el preoveedor'});

            return res.status(200).send({ empleado: empleadoGuardado})
        })

    } else {
        return res.status(404).send({ mensaje: 'Debe enviar los parametros Obligatorios'});
    }


}
function AgregarEmpresas (req, res) {
    var parametros = req.body;
    var modeloEmpresas = new Empresas();
    
    if( req.user.rol !== 'Admin') {
        return res.status(500).send({ mensaje: 'Permisos insuficientes' });
    }

    if( parametros.nombre && parametros.direccion ){
        modeloEmpresas.nombre = parametros.nombre;
        modeloEmpresas.direccion = parametros.direccion;   

        modeloEmpresas.save((err, empresaGuardado)=>{

            return res.send({ empresa: empresaGuardado});
        });
    } else {
        return res.send({ mensaje: "Debe enviar los parametros obligatorios."})
    }


}

function EditarEmpresas(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var parametros = req.body;

    if( req.user.rol !== 'Admin') {
        return res.status(500).send({ mensaje: 'Permisos insuficientes' });
    }

    Empresas.findByIdAndUpdate(idEmpresa, parametros, { new : true } ,(err, empresaEditada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!empresaEditada) return res.status(404)
            .send({ mensaje: 'Error al Editar la Empresa' });

        return res.status(200).send({ empresa: empresaEditada});
    })
}

function EliminarEmpresas(req, res) {
    var idEmpresa = req.params.idEmpresa;

    Empresas.findByIdAndDelete(idEmpresa, (err,  empresaEliminada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!empresaEliminada) return res.status(404)
            .send({ mensaje: 'Error al Editar la Empresa' });

        return res.status(200).send({ empresa: empresaEliminada});
    })
}

function buscarEmpresaXEmpleados(req, res) {
    var idEmpledo = req.params.idEmpleado;

    Empresas.find({ empleados : { $elemMatch: { _id: idEmpledo,  } } }, (err, empresasEncontradas)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!empresasEncontradas) return res.status(500).send({ mensaje: 'Error al obtener los empleados por empresas'});

        return res.status(200).send({ productos: productosEncontrados })
    })
    
}

function agregarEmpleadoEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idEmpleado = req.params.idEmpleado;

    Empresas.findByIdAndUpdate(idEmpresa, { $push: { empleados : { idEmpleado: idEmple } } }, {new : true}, 
        (err, empleadoAgregado) => {
            if(err) return res.status(500)
            .send({ mensaje: 'Error en  la peticion'});
            if(!empleadoAgregado) return res
            .status(500).send({ mensaje: 'Error al agregar el empleado'});

            return res.status(200).send({ product: proveedorAgregado });
        })
}

module.exports = {

    AgregarEmpresas,
    EditarEmpresas,
    EliminarEmpresas,
    agregarEmpleados,
    agregarEmpleadoEmpresa,
    buscarEmpresaXEmpleados

}