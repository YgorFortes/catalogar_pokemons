import  jwt from 'jsonwebtoken';
import 'dotenv/config';
function verificaToken(req, res, next){
  const tokenHeader = req.headers['authorization'];
  const token = tokenHeader && tokenHeader.split(' ')[1];

  if(!token){
    return res.status(401).send({mensagem: 'Token não existe'});
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (erro) {
    return res.status(400).send({mensagem: 'Token inválido'});
  }
}
export default verificaToken;