import {Router}  from 'express';
const router = Router();
import  UsuariosController from '../controller/UsuariosController.js'


router
.post('/usuarios/login', UsuariosController.login)
.post('/usuarios', UsuariosController.criarUsuario)

export default router;