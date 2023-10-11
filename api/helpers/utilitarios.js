function verificarCampoVazio(req, ...campos){
  let mensagem ;
  for( let campo of campos){
   if(!req[campo]){
    return mensagem = `Campo ${campo} não preenchido`;
   }
  }
}

export default verificarCampoVazio