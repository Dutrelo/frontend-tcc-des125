import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const nome = localStorage.getItem('usuarioNome');

  const handleLogout = () => {
    localStorage.clear(); // Limpa o token e o nome
    navigate('/');        // Manda de volta para a tela de login
  };

  return (
    <div>
      <h1>Painel de Controle - GranPlus</h1>
      <p>Olá, <strong>{nome}</strong>! Você está logado no sistema.</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
export default Dashboard;