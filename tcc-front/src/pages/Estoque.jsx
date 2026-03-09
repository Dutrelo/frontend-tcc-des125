import { useState, useEffect } from 'react';
import api from '../services/api';

function Estoque() {
  const [estoque, setEstoque] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function buscarEstoque() {
      try {
        const token = localStorage.getItem('token');
        // Batendo na rota de estoque que tem no arquivo server.js da API
        const resposta = await api.get('/estoque', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEstoque(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar estoque:", erro);
      }
    }
    buscarEstoque();
  }, []);

  // Filtro duplo: pesquisa tanto pelo nome do produto quanto pelo local de estoque.
  const estoqueFiltrado = estoque.filter((item) => {
    // Como ainda não sabemos os nomes exatos que a API vai devolver, 
    // usamos o fallback (|| '') para não quebrar a tela se vier vazio.
    const nomeProduto = item.pdt_nome || item.produto || ''; // O nome do produto pode vir como 'pdt_nome' ou 'produto', dependendo de como a API retornar, então tentamos ambos e se não tiver nenhum, usamos string vazia para evitar erros.
    const nomeLocal = item.loc_nome || item.localizacao || ''; // O nome do local pode vir como 'loc_nome' ou 'localizacao', dependendo de como a API retornar, então tentamos ambos e se não tiver nenhum, usamos string vazia para evitar erros.
    
    return nomeProduto.toLowerCase().includes(busca.toLowerCase()) || // O filtro vai retornar true se o nome do produto OU o nome do local incluir a busca do usuário, ignorando maiúsculas/minúsculas
           nomeLocal.toLowerCase().includes(busca.toLowerCase()); // O filtro vai retornar true se o nome do produto OU o nome do local incluir a busca do usuário, ignorando maiúsculas/minúsculas
  });

  return (
    <div>
      <h1>📊 Controle de Estoque</h1>
      <hr />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="Buscar por produto ou local..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)} // Atualiza o estado da busca toda vez que o usuário digitar algo na barra de busca
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <button style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Nova Movimentação      {/*O botão de Nova Movimentação que abrirá uma janelinha (Modal) para registrar entradas e saídas de estoque*/}
        </button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Produto</th>
            <th style={{ padding: '12px' }}>Localização</th>
            <th style={{ padding: '12px' }}>Quantidade Disponível</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {estoqueFiltrado.length > 0 ? (
            estoqueFiltrado.map((item, index) => (
              // Usamos index como key provisória caso não tenha um id único no retorno
              <tr key={item.lcl_id || index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{item.pdt_nome || item.produto || 'Nome não encontrado'}</td>
                <td style={{ padding: '12px' }}>{item.loc_nome || item.localizacao || 'Local não encontrado'}</td>
                
                {/* Destaque para a quantidade para ficar fácil de ler */}
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#27ae60' }}>
                  {item.lcl_prod_estoque || item.quantidade || 0}
                </td>
                
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Ajustar Estoque">
                    ✏️ Ajustar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>
                Nenhum item de estoque encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Estoque;