import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // Importando a página de Login (tela de entrada do sistema)
import Dashboard from './pages/Dashboard'; // Importando a página de Dashboard
import Layout from './components/Layout'; //Layout é o "esqueleto" da nossa aplicação, ele tem a Sidebar e o Outlet para injetar as páginas
import Produtos from './pages/Produtos'; // Importando a página de Produtos


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota PÚBLICA (Tela limpa, sem menu lateral) */}
        <Route path="/" element={<Login />} />

        {/* Rotas PROTEGIDAS (Tudo que estiver aqui dentro vai ter o menu lateral) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} /> // Rota para a página de Dashboard
          <Route path="/produtos" element={<Produtos />} /> // Rota para a página de Produtos
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;