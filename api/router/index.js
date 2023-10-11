import express from 'express';
import usuarios from './usuariosRoute.js';
import pokemons from './pokemonsRoute.js';
export default  app => {
  app.get('/', (req, res)=> {
    res.status(200).send({mensagem: 'Servidor funcionando'});
  })

  app.use(
    express.json(),
    usuarios,
    pokemons
  )
} 