import Menssage from '../models/message.js';
import mongoose from 'mongoose';


// const messageSchema = new mongoose.Schema({
//     content: String,
//     user: String,
//     timestamp: { type: Date, default: Date.now }
//   });
  
//   const Menssage = mongoose.model('Message', messageSchema);

const ioConnection = (io) => {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado');
        socket.on('chat message', (message) => {
            const msg = new Menssage({
              content: message,
              user: message.user, // Aquí debes obtener el nombre del usuario que envió el mensaje
            });
          
            msg.save((err) => {
              if (err) {
                console.error('Error al guardar el mensaje', err);
              } else {
                console.log('Mensaje guardado en la base de datos');
              }
            });
          
            io.emit('chat message', message);
          });
        socket.on('disconnect', () => {
          console.log('Un usuario se ha desconectado');
        });
      });

 }

 export default ioConnection;



