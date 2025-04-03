import mongoose from 'mongoose' 

mongoose.connection.on('error', err => {
    console.log('Error de conexión', err)
  })
  export default function connectMongoose() {
    return mongoose.connect(process.env.MONGO_URI)
    .then(mongoose => mongoose.connection)
  }