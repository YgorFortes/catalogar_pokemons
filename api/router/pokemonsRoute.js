import {Router}  from 'express';
const router = Router();
import PokemonController from '../controller/PokemonsController.js';
import verificaToken from '../middlewares/verificaToken.js';

router
.get('/pokemons', verificaToken, PokemonController.listarPokemons)
.get('/pokemons/:id',verificaToken, PokemonController.listarPokemonPorId )
.post('/pokemons',verificaToken, PokemonController.registrarPokemon)
.put('/pokemons/:id',verificaToken, PokemonController.atualizaApelido)
.delete('/pokemons/:id',verificaToken, PokemonController.excluirPokemon)

export default router;
