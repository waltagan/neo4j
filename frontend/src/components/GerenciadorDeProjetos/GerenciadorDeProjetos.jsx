import React, { useState } from 'react';
import './GerenciadorDeProjetos.css';

const GerenciadorDeProjetos = () => {
  const [projetos, setProjetos] = useState([
    { id: 1, nome: 'Projeto A' },
    { id: 2, nome: 'Projeto B' }
  ]);
  const [novoProjeto, setNovoProjeto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!novoProjeto.trim()) return;
    
    setProjetos([...projetos, {
      id: Date.now(),
      nome: novoProjeto
    }]);
    setNovoProjeto('');
  };

  const handleDelete = (id) => {
    setProjetos(projetos.filter(p => p.id !== id));
  };

  return (
    <div className="gerenciador-projetos">
      <header className="projetos-header">
        <h1>Gerenciador de Projetos</h1>
      </header>

      <form className="projeto-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={novoProjeto}
          onChange={(e) => setNovoProjeto(e.target.value)}
          placeholder="Nome do projeto"
          className="projeto-input"
        />
        <button type="submit" className="add-projeto-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar Projeto
        </button>
      </form>

      <div className="table-container">
        <table className="projetos-table">
          <thead>
            <tr>
              <th>Nome do Projeto</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {projetos.map(projeto => (
              <tr key={projeto.id}>
                <td>{projeto.nome}</td>
                <td>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(projeto.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GerenciadorDeProjetos; 