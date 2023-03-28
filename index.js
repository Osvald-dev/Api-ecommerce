import express from 'express'
const app = express();
import mongoose from 'mongoose';
import routerUser from './src/routes/user/user.router.js'
import routerProduct from './src/routes/product/product.router.js'
import routerCart from './src/routes/cart/cart.router.js'
// Conecta con la base de datos MongoDB local
mongoose.connect('mongodb://localhost:27017/nombre-de-tu-base-de-datos', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((error) => {
    console.log('Error de conexión:', error);
  });

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Usa las rutas definidas en routes.js
app.use('/api', routerUser);
app.use('/api', routerProduct);
app.use('/api', routerCart)

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
//En este ejemplo, estamos importando las rutas definidas en routes.js y utilizando el método app.use('/ruta', nombre_de_la_ruta) para agregarlas a nuestra aplicación. En este caso, las rutas estarán disponibles en localhost:3000/api/ruta.





