import express from 'express'
const app = express();
import mongoose from 'mongoose';
import CONFIG from './src/config/server.config.js';
import routerUser from './src/routes/user/user.router.js'
import routerProduct from './src/routes/product/product.router.js'
import routerCart from './src/routes/cart/cart.router.js'
import session from 'express-session';
import {Server as HttpServer} from 'http'

const httpServer = new HttpServer(app)

import bodyParser from'body-parser';
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/e-commerce',
 {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useCreateIndex: true,
})
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((error) => {
    console.log('Error de conexión:', error);
  });

app.use(express.json());
app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false, // Evitar que se cree una sesión vacía automáticamente
  cookie: {
    maxAge: 60 * 60 * 1000, //  (1 hora)
    httpOnly: true, // Impedir el acceso a las cookies desde JavaScript
  },
}));

app.use('/api', routerUser);
app.use('/api', routerProduct);
app.use('/api', routerCart)



const server = httpServer.listen(CONFIG.PORT, CONFIG.HOST, () => {
  console.log(`Server is up and running on port => ${CONFIG.PORT}`)
})

server.on('error', (error) => {
  console.log('There was an unexpected error in the server')
  console.log(error)
})


