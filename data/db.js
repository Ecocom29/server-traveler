import mongoose, { mongo } from 'mongoose';
import bCrypt from 'bcrypt';
mongoose.Promise = global.Promise;

//Definicion de Usuario
const usuarioSchema = new mongoose.Schema({
    nombres: String,
    apellidos: String,
    correoElectronico: String,
    contrasenia: String,
    genero: String,  
    pais: String,
    imagenPerfil: String,
    tipoUsuario: String,
    estado:  String,  
    fechaAlta: Date,
    esActivo: Number
});

usuarioSchema.pre('save', function(next){
    if(!this.isModified('contrasenia')){
        return next(err);
    }

    bCrypt.genSalt(10, (err, salt)=>{
        if(err) return next(err);

        bCrypt.hash(this.contrasenia, salt, (err, hash)=>{
            this.contrasenia = hash;

            next();
        });
    });
});


const Usuarios = mongoose.model('usuarios', usuarioSchema);

const lugaresSchema = mongoose.Schema({
    nombre:String,
    recomendaciones: String,
    descripcion: String,
    horaInicio: String,
    horaFin: String,
    ubicacion: String,
    imagenPortada: String,
    imagenes: Array,
    categoria:   String,
    usuario:   String,
    fechaAlta: Date,
    esActivo: Number
});

const Lugares = mongoose.model('lugares', lugaresSchema);

const categoriasSchema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    fechaAlta: Date,
    esActivo: Number
});

const Categorias = mongoose.model('categorias', categoriasSchema);

const paisSchema = mongoose.Schema({
    nombre:String,
    descripcion: String,
    fechaAlta: Date,
    esActivo: Number
});

const Pais = mongoose.model('pais', paisSchema);

const estadoSchema = mongoose.Schema({
    nombre:String,
    descripcion: String,
    fechaAlta: Date,
    esActivo: Number
});

const Estado = mongoose.model('estado', estadoSchema);

const municipioSchema = mongoose.Schema({
    nombre:String,
    descripcion: String,
    fechaAlta: Date,
    esActivo: Number
});

const Municipio = mongoose.model('municipio', municipioSchema);

export { Usuarios, Lugares, Categorias, Pais, Estado, Municipio };