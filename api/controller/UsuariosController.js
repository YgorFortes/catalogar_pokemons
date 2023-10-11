import db from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import verificarCampoVazio from '../helpers/utilitarios.js';

class UsuariosController{

  static async criarUsuario(req, res){
    const {nome, email, senha} = req.body;
    try {

      //Validando campos preenchidos
      const erroCampos = verificarCampoVazio(req.body, 'nome', 'email', 'senha');
      if(erroCampos){
        return res.status(400).send({mensagem: erroCampos});
      }

      //verificando se email é unico
      const [usuario] = await db('usuarios').where('email', email);
      if(usuario){
        return res.status(409).send({mensagem: 'Email já cadastrado'});
      }
     
      //Criando um salt e um hash de senha
      const salt = bcrypt.genSaltSync(12);
      const senhaHash = await bcrypt.hash(senha, salt);
      
      //Criando usuario
      const [id] = await db('usuarios').insert({nome: nome, email: email, senha: senhaHash});
   
      //Procurando novo usuário 
      const [novoUsuario] = await db('usuarios').where('id', id); 

      return res.status(201).send(novoUsuario);

    } catch (erro) {
      console.log(erro)
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }

  static async login(req,res){
    const {email, senha} = req.body;
    try {

      //Validando campos preenchidos
      const erroCampos = verificarCampoVazio(req.body, 'email', 'senha');
      if(erroCampos){
        return res.status(400).send({mensagem: erroCampos});
      }

      //Encontrando / verificando usuario pelo email
      const [usuario] = await db('usuarios').where('email', email);
      if(!usuario){
        return res.status(409).send({mensagem: 'Usuário não encontrado'});
      }

      //Verificando a senha digita com a senha do banco
      const veirifcaSenha = await bcrypt.compare(senha, usuario.senha);
      if(!veirifcaSenha){
        return res.status(401).send({mensagem: 'Senha incorreta'});
      }

      const secret = process.env.SECRET
      const token = jwt.sign({
        id: usuario.id,
      }, secret);

      return res.status(200).send({mensagem: 'Usuário logado', token});
    } catch (erro) {
      console.log(erro)
      return res.status(500).send({mensagem: 'Servidor com problemas. Tente novamente mais tarde!'});
    }
  }
}



/* async function  veirificandoEmailUnico(email){
  const usuarios = await db('usuarios');
 usuarios.forEach((usuario)=> {
  console.log(usuario.email)
 })
} */
export default UsuariosController;