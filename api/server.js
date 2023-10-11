import  express from 'express';
import  routes from './router/index.js';

import 'dotenv/config';


const app = express();
const port = process.env.PORT || 3000;

routes(app);



app.listen(port, ()=> console.log(`Servidor funcionando em: http://localhost:${port}/teste`));

