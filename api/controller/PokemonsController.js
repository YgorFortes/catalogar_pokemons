import  db from '../database/db.js'
import  bcrypt from  'bcrypt'
import  jwt from 'jsonwebtoken';
import pokedex  from 'pokedex-promise-v2';
import 'dotenv/config';
import verificarCampoVazio from '../helpers/utilitarios.js';

class PokemonController{
  static async listarPokemons(req, res){
    try {
      
      //Buscando todos os pokemons 
      const pokemons = await db('pokemons').select([
        'pokemons.id',
        'usuarios.nome as usuario',
        'pokemons.nome',
        'habilidades',
        'imagem',
        'apelido'
      ]).distinct('pokemons.id')
      .innerJoin('usuarios', 'usuarios.id' ,'=', 'pokemons.usuario_id');
   
      //Transfomando as habilidades dos pokemons em array
      transformarHabilidadesEmArray(pokemons);
   
      return res.status(200).send(pokemons);
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async listarPokemonPorId(req, res){
    const {id} = req.params;
    try {
      //Verificando se foi digitado um número em params;
      if(isNaN(id)){
        return res.status(400).send({mensagem: 'Formato de id inválido. Digite um número'})
      }

      //Verificando a busca pelo pokemon
      const pokemon = await db('pokemons').where('id', id);
      if(pokemon <1){
        return res.status(404).send({mensagem: 'Pokemon não encontrado!'});
      }

      //Transformando habilidades do pokemon em array
      transformarHabilidadesEmArray(pokemon);

      return res.status(200).send(pokemon);
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async registrarPokemon(req, res){
    const {nome, apelido } = req.body;
  
    try {

      //Decodificando  o token e buscando a id de usuario
      const secret = process.env.SECRET;
      const token = req.get('Authorization').split(' ')[1];

      //Encontrando id de usuario
      const usuarioId = jwt.verify(token, secret).id;


      //Verificando campos preenchidos
      const erroCampos = verificarCampoVazio(req.body, 'nome','apelido');
      if(erroCampos){
        return res.status(400).send({mensagem: erroCampos})
      }

      //Encontrando a imagem do pokemon 
      const imagem = await encontrandoUrlImgemPokemon(nome);

      //Encontrando as habilidades 
      const habilidades = await encontradoHabilidadesDoPokemon(nome);  

      //Verificando se existe o pokemon
      if(!imagem || !habilidades){
        return res.status(404).send({mensagem: 'Pokemon não encontrado na pokedex. Digite um pokemon existente!'})
      }

      //Cadastrando pokemon
      const [id] = await db('pokemons').insert({usuario_id: usuarioId, nome, habilidades, imagem, apelido });

      //Encontrando pokemon cadastrado
      const [pokemon] = await db('pokemons').where('id', id);

      return res.status(201).send(pokemon);

    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async atualizaApelido(req, res){
    const {apelido} = req.body;
    const {id} = req.params;
    try {
      const erroCampos = verificarCampoVazio(req.body, 'apelido');
      if(erroCampos){
        return res.status(400).send({mensagem: erroCampos});
      }

      //Verificando se foi digitado um número em params;
      if(isNaN(id)){
        return res.status(400).send({mensagem: 'Formato de id inválido. Digite um número'})
      }

      //Verificando a busca pelo pokemon
      const pokemon = await db('pokemons').where('id', id);
      if(pokemon <1){
        return res.status(404).send({mensagem: 'Pokemon não encontrado!'});
      }

      //Dando update no apelido do pokemon
      const resultado = await db('pokemons').update({apelido}).where('id', id);
      if(!resultado){
        return res.status(409).send({mensagem: 'Erro ao atualizar pokemon'});
      }


      return res.status(200).send({mensagem: 'Apelido de pokemon atualizado com sucesso!'});
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async excluirPokemon(req, res){
    const {id} = req.params;

    try {
      //Verificando se foi digitado um número em params;
      if(isNaN(id)){
        return res.status(400).send({mensagem: 'Formato de id inválido. Digite um número'})
      }

      //Verificando a busca pelo pokemon
      const pokemon = await db('pokemons').where('id', id);
      if(pokemon <1){
        return res.status(404).send({mensagem: 'Pokemon não encontrado!'});
      }

      const resultado = await db('pokemons').delete().where({id});
      if(!resultado){
        return res.status(409).send({mensagem: 'Erro ao excluir pokemon'});
      }
      
      return res.status(200).send({mensagem: 'Pokemon excluido com sucesso!'});
    } catch (erro) {
      console.log(erro);
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

}


//Transforma habilidades em um array
function  transformarHabilidadesEmArray(pokemons){
  pokemons.map((pokemon)=> {
    const habilidade = pokemon.habilidades.split(',');
    pokemon.habilidades = habilidade
  })
}

async function encontrandoUrlImgemPokemon(nome){
  const pokemons = new pokedex();
  try {
    //Encontrando pokemon
    const pokemon = await pokemons.getPokemonFormByName(nome.trim().toLowerCase());

    //Encontrando a imagem do pokemon e retornando
    const imagemUrl = pokemon.sprites.front_default;
    return imagemUrl
  } catch (erro) {
    console.log(erro);
  } 
}

async function encontradoHabilidadesDoPokemon(nome){
  const pokemons = new pokedex();
  const  nomeHabilidades = [];
  try {
    //Encontando o pokemon
    const pokemon = await pokemons.getPokemonFormByName(nome.trim().toLowerCase());

  //Encontrando especificações do pokemon pela url
    const pokemonUrl =  pokemon.pokemon.url;
    const especificacoesPokemon = await pokemons.getResource(pokemonUrl);


    //Resgatando somente os nomes das habilidades do pokemon
    const habilidades = await especificacoesPokemon.abilities
    habilidades.map((habilidade)=> nomeHabilidades.push(habilidade.ability.name))
    const habilidadesEmString = nomeHabilidades.toString();

    return habilidadesEmString;
  } catch (erro) {
    console.log(erro);
  } 
}

export default PokemonController;