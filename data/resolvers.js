import mongoose from 'mongoose';
import bCrypt from 'bcrypt';
import { Usuarios, Lugares, Categorias, Pais, Estado, Municipio } from './db';

//Generar token
import dotEnv from 'dotenv';
dotEnv.config({ path: 'variables.env' });
import jwt from 'jsonwebtoken';

//Genera y firma un token
const generarToken = (usuarioLogin, secreto, expiresIn) => {

    const { correoElectronico } = usuarioLogin;

    return jwt.sign({ correoElectronico }, secreto, { expiresIn });
}

export const resolvers = {
    Query: {
        ObtenerUsuario: async (root, { }, ctx) => {
            if (!ctx.usuarioActual) {
                return null;
            }

            const usuarioCorreo = ctx.usuarioActual.correoElectronico;
            const usuario = await Usuarios.findOne({ correoElectronico: correo });

            return usuario;
        },
        ObtenerDatosUsuario: (root, { }, ctx) => {
            const usuarios = Usuarios.find();

            return usuarios;
        },
        ObtenerLugares: async (root, { }, ctx) => {

            const lugares = await Lugares.find();          
            
            return lugares;
        },
        ObtenerPaises: async (root, { }, ctx) => {
            const paises = await Pais.find();

            return paises;
        },
        ObtenerEstados: async (root, { }, ctx) => {
            const estado = await Estado.find();

            return estado;
        },
        ObtenerMunicipios: async (root, { }, ctx) => {
            const municipio = await Municipio.find();

            return municipio;
        }
    },
    Mutation: {
        CrearUsuario: async (root, { correoElectronico, contrasenia }, ctx) => {

           
            console.log(correoElectronico);
            console.log(contrasenia);

            /*  if (correoElectronico === undefined && contrasenia === undefined) {
                 throw new Error('Los datos son vacios, favor de verificar.');
             } */

            //Revisar si existe una empresa con el nombre asignado
            const existeUsuario = await Usuarios.findOne({ correoElectronico });

            //Validando existencia del correo
            if (existeUsuario) {
                throw new Error('Existe un usuario con el mismo correo electronico, favor de verificar.');
            }

            try {
                const nuevoUsuario = await new Usuarios({
                    nombres: '',
                    apellidos: '',
                    correoElectronico,
                    contrasenia,
                    genero: '',
                    pais: '',
                    imagenPerfil: '',
                    tipoUsuario: '',
                    fechaAlta: new Date(),
                    esActivo: 1
                }).save();

                console.log(nuevoUsuario)

                return "Registrado correctamente, ahora puedes iniciar sesión.";

            } catch (error) {
                console.log(error);
            }
        },
        AutenticarUsuario: async (root, { correoElectronico, contrasenia }, ctx) => {
            console.log('CONTEXT' , ctx);
            //verificar si el exite          
            const existeUsuario = await Usuarios.findOne({ correoElectronico });

            //Validando existencia del correo
            if (!existeUsuario) {
                throw new Error('No existe la cuenta, favor de verificar.');
            }

            //Verificar si la contrasenia es correcta
            const contraseniaCorrecta = await bCrypt.compare(contrasenia, existeUsuario.contrasenia);

            //Validando la contrasenia correcta
            if (!contraseniaCorrecta) {
                throw new Error('Contrasenia incorrecta, intente de nuevo.');
            }
            console.log(process.env.SECRETO)

            return { token: generarToken(existeUsuario, process.env.SECRETO, '2hr') }
        },
        CrearLugar: async (root, { input }, ) => {
            console.log(input);
            const { nombre } = input;
            const obtenerLugar = await Lugares.findOne({ nombre });
 
            if (obtenerLugar) {
                throw new Error(`El lugar que intenta registrar, ya existe.`);
            }

            try {
                const creaLugar = new Lugares({
                    nombre: input.nombre,
                    recomendaciones: input.recomendaciones,
                    descripcion: input.descripcion,
                    horaInicio: input.horaInicio,
                    horaFin: input.horaFin,
                    ubicacion: input.ubicacion,
                    imagenPortada: input.imagenPortada,
                    imagenes: input.imagenes,
                    categoria: input.categoria,
                    usuario: input.usuario,
                    fechaAlta: new Date(),
                    esActivo: 1
                });

                //MongoDB crea el ID y se lo asigna al objeto
                creaLugar.id = creaLugar._id;

                return new Promise((resolve, object) => {
                    creaLugar.save((error) => {
                        if (error)
                            rejects(error)
                        else
                            resolve(creaLugar)
                    })
                });
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}