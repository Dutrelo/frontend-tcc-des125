import { useState, useEffect } from 'react';
import api from '../services/api';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState(''); 

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const token = localStorage.getItem('token'); // Pegamos o token do localStorage para autenticar a requisição
        const resposta = await api.get('/produtos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProdutos(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar produtos:", erro);
      }
    }
    buscarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.pdt_nome.toLowerCase().includes(busca.toLowerCase()) // Filtra os produtos pelo nome, ignorando maiúsculas/minúsculas
  );

  return (
    <div>
      <h1>📦 Gestão de Produtos</h1>
      <hr />

      {/* Usamos 'display: flex' e 'justifyContent: space-between' para jogar a barra de busca para a esquerda e o botão para a direita */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="Buscar produto por nome..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        {/* O botão de Novo Produto que abrirá uma janelinha (Modal) */}
        <button style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Novo Produto
        </button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>  
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Código</th>
            <th style={{ padding: '12px' }}>Nome do Produto</th>
            <th style={{ padding: '12px' }}>Estoque Mínimo</th>
            <th style={{ padding: '12px' }}>Status</th>
            
            {/* A nova coluna no cabeçalho para as Ações como Editar e Excluir */}
            <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.length > 0 ? (                                         // Se houver produtos após a filtragem, renderizamos eles na tabela
            produtosFiltrados.map((produto) => (                                    // Renderizamos cada produto em uma linha da tabela
              <tr key={produto.pdt_id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{produto.pdt_codigo}</td>
                <td style={{ padding: '12px' }}>{produto.pdt_nome}</td>
                <td style={{ padding: '12px' }}>{produto.pdt_estoque_minimo}</td>
                <td style={{ padding: '12px' }}>
                  {produto.pdt_ativo === 1 ? '🟢 Ativo' : '🔴 Inativo'}
                </td>
                
                {/* Os botões de Editar e Excluir renderizados para cada linha */}
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }} title="Editar">
                    ✏️
                  </button>
                  <button style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Excluir">
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr> {/*Colspan é para a mensagem de "Nenhum produto encontrado" ocupar as 5 colunas da tabela, centralizada*/}
              <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}> // Se não houver produtos após a filtragem, mostramos uma mensagem amigável para o usuário
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Produtos;