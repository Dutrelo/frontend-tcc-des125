import { useState } from 'react';
import api from '../services/api'; //importando o axios que criamos para "falar" com a API

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  // coloquei o 'async' porque conversar com a API demora alguns milissegundos
  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    try {
      // mandando um POST para a rota de login da nossa API, com nome de usuario e senha
      const resposta = await api.post('/usuarios/login', {
  user_nome: usuario,
  user_senha: senha
});

      console.log("SUCESSO! A API devolveu:", resposta.data);
      alert("Login efetuado com sucesso!");
      
      // aqui que irá salvar o Token JWT e redirecionar para o Dashboard

    } catch (erro) {
      console.error("Deu erro ao logar:", erro);
      alert("Erro ao fazer login. Verifique seu usuário e senha ou se a API está rodando.");
    }
  };

  return (
    <div>
      <h1>Login - GranPlus Almoxarifado</h1>
      
      <form onSubmit={handleLogin}>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Usuário: </label>
          <input 
            type="text" 
            placeholder="Digite seu nome de usuário"
            value={usuario} 
            onChange={(e) => setUsuario(e.target.value)} 
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Senha: </label>
          <input 
            type="password" 
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button type="submit">Entrar no Sistema</button>
        
      </form>
    </div>
  );
}

export default Login;