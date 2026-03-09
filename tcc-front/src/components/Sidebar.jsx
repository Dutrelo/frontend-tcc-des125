import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const nome = localStorage.getItem('usuarioNome');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2>GranPlus</h2>
      <p>Olá, {nome}</p>
      <hr />
      <nav>
        <Link to="/dashboard" className="nav-link">🏠 Painel Principal</Link>
        <Link to="/produtos" className="nav-link">📦 Produtos</Link>
        <Link to="/estoque" className="nav-link">📊 Estoque</Link>
        <Link to="/usuarios" className="nav-link">👥 Usuários</Link>
      </nav>
      <button onClick={handleLogout} className="btn-sair">
        Sair do Sistema
      </button>
    </div>
  );
}

export default Sidebar;