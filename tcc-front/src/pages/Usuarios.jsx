import { useState, useEffect } from 'react';
import api from '../services/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');

  // NOVIDADE 1: Os estados para controlar a janelinha e os dados do formulário
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novoNivel, setNovoNivel] = useState('user'); // Padrão é 'user'
  const [usuarioEditando, setUsuarioEditando] = useState(null); // null = Criando. Se tiver ID = Editando.

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const token = localStorage.getItem('token');
        
        // 1. Mudamos a rota para o inglês (igual eles fizeram no Estoque e Produtos)
        const resposta = await api.get('/usuarios', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 2. Colocamos o nosso espião para ver o formato que a API mandou
        console.log("O que a API mandou pro Usuarios:", resposta.data);

        // 3. A VACINA BLINDADA: Tenta ler a lista direta ou procura dentro da caixa
        const listaDeUsuarios = Array.isArray(resposta.data) 
          ? resposta.data 
          : (resposta.data.usuarios || resposta.data.users || resposta.data.data || []);
        
        setUsuarios(listaDeUsuarios);

      } catch (erro) {
        console.error("Erro ao buscar usuários:", erro);
        setUsuarios([]); // Proteção extra: se a API der erro, a lista fica vazia e a tela NÃO quebra!
      }
    }
    buscarUsuarios(); 
  }, []);

  const usuariosFiltrados = usuarios.filter((user) =>
    user.user_nome.toLowerCase().includes(busca.toLowerCase())
  );

// NOVIDADE: A função agora é inteligente. Sabe quando Criar e quando Editar!
  const handleSalvarUsuario = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const dadosUsuario = {
        user_nome: novoNome,
        user_nivel_acesso: novoNivel,
        user_ativo: 1
      };
      
      // Só manda a senha se o usuário digitou uma nova
      if (novaSenha !== '') {
        dadosUsuario.user_senha = novaSenha;
      }

      if (usuarioEditando) {
        // MODO EDIÇÃO (PUT)
        await api.put(`/usuarios/${usuarioEditando}`, dadosUsuario, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Usuário atualizado com sucesso!');
      } else {
        // MODO CRIAÇÃO (POST)
        await api.post('/usuarios', dadosUsuario, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Usuário criado com sucesso!');
      }

      // Atualiza a tabela
      const resposta = await api.get('/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // VACINA BLINDADA: Tenta ler direto, se não conseguir, procura nas caixas prováveis
      const listaDeUsuarios = Array.isArray(resposta.data) 
        ? resposta.data 
        : (resposta.data.usuarios || resposta.data.users || resposta.data.data || []);
      
      // Salva a lista correta no estado
      setUsuarios(listaDeUsuarios);

      // Limpa os campos e fecha
      setUsuarioEditando(null);
      setNovoNome('');
      setNovaSenha('');
      setNovoNivel('user');
      setIsModalAberto(false);

    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      alert("Erro ao salvar usuário. Olhe o Console.");
    }
  };

  // NOVIDADE: Função para preencher a janelinha quando clica em Editar
  const abrirModalEdicao = (user) => {
    setUsuarioEditando(user.user_id); // Avisa que estamos editando!
    setNovoNome(user.user_nome);
    setNovaSenha(''); // Deixa a senha em branco por segurança
    setNovoNivel(user.user_nivel_acesso);
    setIsModalAberto(true);
  };

  // NOVIDADE: Função para limpar a lousa e preparar para criar um usuário zerado
  const abrirModalCriacao = () => {
    setUsuarioEditando(null); // Avisa pro sistema: "Não tem ID, então é criação!"
    setNovoNome('');          // Limpa o nome
    setNovaSenha('');         // Limpa a senha
    setNovoNivel('user');     // Volta o nível pro padrão
    setIsModalAberto(true);   // Finalmente, abre a janela!
  };

  // A função que desativa o usuário (na verdade, ela só muda o campo user_ativo para 0, ou seja, inativo, sem excluir de verdade do banco)
  const handleExcluirUsuario = async (id, nome) => {
    // A caixinha de confirmação nativa do navegador
    const confirmacao = window.confirm(`⚠️ Tem certeza que deseja desativar o usuário ${nome}?`);
    
    if (confirmacao) {
      try {
        const token = localStorage.getItem('token');
        
        // Bate na rota DELETE /usuarios/:id da sua API
        await api.delete(`/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('Usuário desativado com sucesso!');
        
        alert('Usuário desativado com sucesso!');
        
        // 1. Busca a lista atualizada do banco
        const resposta = await api.get('/usuarios', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 2. A MESMA VACINA: Garante que pegamos a lista, não a caixa!
        const listaAtualizada = Array.isArray(resposta.data) 
          ? resposta.data 
          : (resposta.data.usuarios || resposta.data.users || resposta.data.data || []);
        
        // 3. Agora sim, o React entende a lista e atualiza a tela na hora
        setUsuarios(listaAtualizada);

      } catch (erro) {
        console.error("Erro ao excluir usuário:", erro);
        alert("Erro ao excluir usuário. Verifique o Console (F12).");
      }
    }
  };

  return (
    <div>
      <h1>👥 Gestão de Usuários</h1>
      <hr />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="Buscar usuário por nome..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        {/* NOVIDADE 3: O botão agora muda o estado para TRUE, abrindo a janela */}
        <button 
          onClick={() => abrirModalCriacao()}
          style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Novo Usuário
        </button>
      </div>
      
      {/* --- AQUI FICA A TABELA (igualzinha a antes) --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Nome</th>
            <th style={{ padding: '12px' }}>Nível de Acesso</th>
            <th style={{ padding: '12px' }}>Status</th>
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
                  <span style={{ 
                    backgroundColor: user.user_nivel_acesso === 'admin' ? '#8e44ad' : '#7f8c8d', 
                    color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' 
                  }}>
                    {user.user_nivel_acesso.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{user.user_ativo === 1 ? '🟢 Ativo' : '🔴 Inativo'}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button onClick={() => abrirModalEdicao(user)} style={{ backgroundColor: '#34495e', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }} title="Resetar Senha">🔑</button>
                  <button onClick={() => abrirModalEdicao(user)} style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }} title="Editar">✏️</button>
                 <button 
                    onClick={() => handleExcluirUsuario(user.user_id, user.user_nome)}
                     style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} 
                    title="Desativar/Excluir">
                    🗑️
                 </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Nenhum usuário encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* NOVIDADE 4: A MÁGICA DO MODAL */}
      {/* Se isModalAberto for TRUE, ele desenha essa "capa" preta transparente e a janelinha branca por cima */}
      {isModalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {/* A janelinha branca */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
            <h2>{usuarioEditando ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h2>
            <hr style={{ marginBottom: '20px' }} />
            
            <form onSubmit={handleSalvarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <label>
                Nome do Usuário:
                <input type="text" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </label>

              <label>
                Senha Padrão:
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </label>

              <label>
                Nível de Acesso:
                <select value={novoNivel} onChange={(e) => setNovoNivel(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="user">Usuário Comum (user)</option>
                  <option value="admin">Administrador (admin)</option>
                </select>
              </label>

              {/* Botões do Modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setIsModalAberto(false)} style={{ padding: '10px 15px', border: 'none', backgroundColor: '#95a5a6', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '10px 15px', border: 'none', backgroundColor: '#3498db', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Usuário</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;