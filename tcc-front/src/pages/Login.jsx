import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; //Axios que criamos/usamos para "falar" com a API

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate(); //redicionar para o dashboard após o login

  // Coloquei o async porque conversar com a API demora alguns milissegundos
  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    try {
      // Mandando um POST para a rota de login da nossa API, com nome de usuario e senha
      const resposta = await api.post('/usuarios/login', {
  user_nome: usuario,
  user_senha: senha
});

    // Salva o token e o nome do usuário no navegador
      localStorage.setItem('token', resposta.data.token);
      localStorage.setItem('usuarioNome', resposta.data.usuario.user_nome);

      alert("Bem-vindo, " + resposta.data.usuario.user_nome);
      
      // Mandamos o usuário para a tela principal do sistema (Dashboard)
      navigate('/dashboard'); 

    } catch (erro) {
      console.error("Deu erro ao logar:", erro);
      alert("Usuário ou senha inválidos!");
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