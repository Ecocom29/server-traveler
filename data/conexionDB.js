import mongoose, { mongo } from 'mongoose';

const conectarDB = async ()=>{

    try{
        mongoose.Promise = global.Promise;
        await mongoose.connect(process.env.DB_MONGO, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Conectado a la base de datos [db-traveler]')
    }
    catch(error){
        console.log('Hubo un error al conectarsea la base de datos');
        console.log(error);
        process.exit(1);
    }
}

export default conectarDB;