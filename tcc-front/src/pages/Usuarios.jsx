import { useState, useEffect } from 'react';
import api from '../services/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');

  // Estados do Modal
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novoNivel, setNovoNivel] = useState('user');

  //Se a API mandar direto a lista, ele usa. Se mandar a caixa, ele abre a caixa e pega a lista!
  const carregarUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const resposta = await api.get('/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const listaDeUsuarios = Array.isArray(resposta.data) ? resposta.data : resposta.data.usuarios;
      setUsuarios(listaDeUsuarios || []);
      
    } catch (erro) {
      console.error("Erro ao buscar usuários:", erro);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

    const usuariosFiltrados = (Array.isArray(usuarios) ? usuarios : []).filter((user) =>
    user.user_nome && user.user_nome.toLowerCase().includes(busca.toLowerCase())
  );

  // MÁGICA 1: Salvar (Criar ou Editar)
  const handleSalvarUsuario = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const dadosUsuario = {
        user_nome: novoNome,
        user_nivel_acesso: novoNivel,
        user_ativo: 1
      };
      
      if (novaSenha !== '') {
        dadosUsuario.user_senha = novaSenha;
      }

      if (usuarioEditando) {
        await api.put(`/usuarios/${usuarioEditando}`, dadosUsuario, { headers: { Authorization: `Bearer ${token}` } });
        alert('Usuário atualizado com sucesso!');
      } else {
        await api.post('/usuarios', dadosUsuario, { headers: { Authorization: `Bearer ${token}` } });
        alert('Usuário criado com sucesso!');
      }

      carregarUsuarios(); // Atualiza a tabela sem F5!
      fecharModal();
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      alert(erro.response?.data?.erro || "Erro ao salvar usuário.");
    }
  };

  // MÁGICA 2: Excluir (Desativar)
  const handleExcluirUsuario = async (id, nome) => {
    const confirmacao = window.confirm(`⚠️ Tem certeza que deseja desativar o usuário ${nome}?`);
    if (confirmacao) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/usuarios/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        carregarUsuarios(); // Atualiza a tabela sem F5!
      } catch (erro) {
        console.error("Erro ao excluir:", erro);
        alert("Erro ao excluir usuário.");
      }
    }
  };

  // Funções de controle do Modal
  const abrirModalNovo = () => {
    setUsuarioEditando(null);
    setNovoNome('');
    setNovaSenha('');
    setNovoNivel('user');
    setIsModalAberto(true);
  };

  const abrirModalEdicao = (user) => {
    setUsuarioEditando(user.user_id);
    setNovoNome(user.user_nome);
    setNovaSenha(''); // Sempre em branco por segurança
    setNovoNivel(user.user_nivel_acesso);
    setIsModalAberto(true);
  };

  const fecharModal = () => {
    setIsModalAberto(false);
  };

  return (
    <div>
      <h1>👥 Gestão de Usuários</h1>
      <hr />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
        <input 
          type="text" placeholder="Buscar usuário por nome..." value={busca} onChange={(e) => setBusca(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={abrirModalNovo} style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Novo Usuário
        </button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Nome</th>
            <th style={{ padding: '12px' }}>Nível</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.length > 0 ? (
            usuariosFiltrados.map((user) => (
              <tr key={user.user_id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{user.user_id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.user_nome}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ backgroundColor: user.user_nivel_acesso === 'admin' ? '#8e44ad' : '#7f8c8d', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {user.user_nivel_acesso.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button onClick={() => abrirModalEdicao(user)} style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }} title="Editar">✏️</button>
                  <button onClick={() => handleExcluirUsuario(user.user_id, user.user_nome)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Desativar">🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Nenhum usuário encontrado.</td></tr>
          )}
        </tbody>
      </table>

      {isModalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
            <h2>{usuarioEditando ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h2>
            <hr style={{ marginBottom: '20px' }} />
            <form onSubmit={handleSalvarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label>Nome do Usuário:
                <input type="text" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </label>
              <label>{usuarioEditando ? 'Nova Senha (opcional):' : 'Senha Padrão:'}
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required={!usuarioEditando} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </label>
              <label>Nível de Acesso:
                <select value={novoNivel} onChange={(e) => setNovoNivel(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="user">Usuário Comum (user)</option>
                  <option value="admin">Administrador (admin)</option>
                </select>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={fecharModal} style={{ padding: '10px 15px', border: 'none', backgroundColor: '#95a5a6', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '10px 15px', border: 'none', backgroundColor: '#3498db', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;