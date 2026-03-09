function Dashboard() {
  const nome = localStorage.getItem('usuarioNome');

  return (
    <div>
      <h1>Painel Principal</h1>
      <p>Bem-vindo ao controle de estoque da GranPlus, <strong>{nome}</strong>!</p>
      {/* Removemos o botão Sair daqui, ele agora mora só na Sidebar! */}
    </div>
  );
}

export default Dashboard;