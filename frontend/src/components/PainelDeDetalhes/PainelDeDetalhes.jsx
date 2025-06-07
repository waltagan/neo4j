import React, { useState } from 'react';
import "./PainelDeDetalhes.css";

const PainelDeDetalhes = ({ noSelecionado, onClose, isExpanded = false }) => {
  if (!noSelecionado) {
    return null;
  }

  const formatarPropriedade = (chave, valor) => {
    // Mapeamento de chaves para nomes mais amigáveis
    const mapeamentoNomes = {
      'firstname': 'Nome',
      'lastname': 'Sobrenome',
      'cpf': 'CPF',
      'razao_social': 'Razão Social',
      'nome_fantasia': 'Nome Fantasia',
      'cnpj': 'CNPJ',
      'oab': 'OAB',
      'data_nascimento': 'Data de Nascimento',
      'data_fundacao': 'Data de Fundação',
      'idade': 'Idade',
      'sexo': 'Sexo',
      'renda_estimada': 'Renda Estimada',
      'signo': 'Signo',
      'nome_mae': 'Nome da Mãe',
      'pep': 'Pessoa Politicamente Exposta',
      'obito': 'Óbito',
      'em_prospecao': 'Em Prospecção',
      'stakeholder': 'Stakeholder',
      'associado': 'Associado',
      'community': 'Comunidade',
      'instagram': 'Instagram',
      'linkedin': 'LinkedIn',
      'situacao_cadastral': 'Situação Cadastral',
      'porte_id': 'Porte',
      'segmento_id': 'Segmento',
      'tipo_empresa': 'Tipo de Empresa',
      'natureza_juridica_descricao': 'Natureza Jurídica',
      'faixa_faturamento': 'Faixa de Faturamento',
      'faixa_funcionarios': 'Faixa de Funcionários',
      'quantidade_funcionarios': 'Quantidade de Funcionários',
      'matriz': 'É Matriz',
      'ramo': 'Ramo',
      'ultima_atualizacao_pj': 'Última Atualização PJ'
    };

    const nomeAmigavel = mapeamentoNomes[chave] || chave;

    // Formatação especial para Instagram
    if (chave === 'instagram' && valor && valor !== 'None' && valor !== 'Não encontrado' && valor.trim() !== '') {
      const username = valor.trim();
      const instagramUrl = `https://instagram.com/${username}`;
      return (
        <div className="propriedade-item-custom">
          <span>{nomeAmigavel}: </span>
          <a 
            href={instagramUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="instagram-link"
          >
            @{username}
          </a>
        </div>
      );
    }

    // Formatação de valores específicos
    if (chave === 'renda_estimada' && typeof valor === 'number') {
      return `${nomeAmigavel}: R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    if (chave === 'pep' || chave === 'obito' || chave === 'em_prospecao' || chave === 'stakeholder' || chave === 'associado' || chave === 'matriz') {
      return `${nomeAmigavel}: ${valor ? 'Sim' : 'Não'}`;
    }

    if ((chave === 'data_nascimento' || chave === 'data_fundacao' || chave === 'ultima_atualizacao_pj') && valor) {
      // Tenta formatação de data mais amigável
      const data = new Date(valor);
      if (!isNaN(data.getTime())) {
        return `${nomeAmigavel}: ${data.toLocaleDateString('pt-BR')}`;
      }
      return `${nomeAmigavel}: ${valor}`;
    }

    if (chave === 'cpf' && valor) {
      // Formatar CPF
      const cpfFormatado = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      return `${nomeAmigavel}: ${cpfFormatado}`;
    }

    if (chave === 'cnpj' && valor) {
      // Formatar CNPJ
      const cnpjFormatado = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      return `${nomeAmigavel}: ${cnpjFormatado}`;
    }

    return `${nomeAmigavel}: ${String(valor)}`;
  };

  const obterNomeCompleto = () => {
    const properties = noSelecionado.properties || {};
    const label = noSelecionado.label;

    if (label === 'Pessoa' || label === 'Advogado') {
      return `${properties.firstname || ''} ${properties.lastname || ''}`.trim();
    }

    if (label === 'Empresa') {
      return properties.nome_fantasia || properties.razao_social || 'Empresa sem nome';
    }

    return 'Nó sem identificação';
  };

  const obterPropriedadesRelevantes = () => {
    const properties = noSelecionado.properties || {};
    
    // Categorias de propriedades
    const categoriasInfo = {
      contato: ['instagram', 'linkedin'],
      identificacao: ['cpf', 'cnpj', 'oab', 'razao_social', 'nome_fantasia'],
      empresa: ['tipo_empresa', 'situacao_cadastral', 'porte_id', 'segmento_id', 'natureza_juridica_descricao'],
      financeiro: ['renda_estimada', 'faixa_faturamento', 'faixa_funcionarios', 'quantidade_funcionarios'],
      pessoal: ['data_nascimento', 'data_fundacao', 'idade', 'sexo', 'signo', 'nome_mae'],
      status: ['pep', 'obito', 'em_prospecao', 'stakeholder', 'associado', 'matriz', 'community']
    };

    // Organiza propriedades por categoria
    const propriedadesPorCategoria = {};
    Object.entries(properties).forEach(([chave, valor]) => {
      if (valor === null || valor === undefined || valor === '' || ['firstname', 'lastname'].includes(chave)) return;

      // Encontra a categoria da propriedade
      const categoria = Object.entries(categoriasInfo).find(([_, props]) => props.includes(chave))?.[0] || 'outros';
      
      if (!propriedadesPorCategoria[categoria]) {
        propriedadesPorCategoria[categoria] = [];
      }
      propriedadesPorCategoria[categoria].push([chave, valor]);
    });

    // Ordem das categorias
    const ordemCategorias = ['contato', 'identificacao', 'empresa', 'financeiro', 'pessoal', 'status', 'outros'];
    
    // Retorna array ordenado por categoria
    return ordemCategorias.reduce((acc, categoria) => {
      if (propriedadesPorCategoria[categoria]?.length) {
        acc.push({ categoria, propriedades: propriedadesPorCategoria[categoria] });
      }
      return acc;
    }, []);
  };

  const getTipoIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'empresa':
        return (
          <svg className="tipo-no-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M3 7v14M21 7v14M3 7l9-4 9 4M12 7v14M7 14h.01M7 17h.01M17 14h.01M17 17h.01"/>
          </svg>
        );
      case 'advogado':
        return (
          <svg className="tipo-no-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
            <path d="M12 11v4M9 15h6"/>
          </svg>
        );
      case 'pessoa':
        return (
          <svg className="tipo-no-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        );
      default:
        return (
          <svg className="tipo-no-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v.01"/>
            <path d="M12 8v5"/>
          </svg>
        );
    }
  };

  const getCategoriaIcon = (categoria) => {
    switch (categoria) {
      case 'contato':
        return <svg className="categoria-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>;
      case 'identificacao':
        return <svg className="categoria-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>;
      case 'empresa':
        return <svg className="categoria-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 7v14M21 7v14M3 7l9-4 9 4M12 7v14M7 14h.01M7 17h.01M17 14h.01M17 17h.01"/></svg>;
      case 'financeiro':
        return <svg className="categoria-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
      case 'pessoal':
        return <svg className="categoria-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>;
      case 'status':
        return <svg className="categoria-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
      default:
        return <svg className="categoria-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v.01M12 8v5"/></svg>;
    }
  };

  const getPropriedadeIcon = (chave) => {
    switch (chave) {
      case 'instagram':
        return <svg className="propriedade-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
      case 'linkedin':
        return <svg className="propriedade-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
      case 'cnpj':
      case 'cpf':
        return <svg className="propriedade-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h10"/></svg>;
      default:
        return <svg className="propriedade-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M3 12h.01M21 12h.01"/></svg>;
    }
  };

  if (!isExpanded) {
    return (
      <div className="painel-detalhes">
        <p>Clique em um nó para ver os detalhes.</p>
      </div>
    );
  }

  return (
    <div className={`painel-detalhes ${isExpanded ? 'expandido' : ''}`}>
      <div className="painel-header">
        <div className="painel-header-content">
          <h2>{obterNomeCompleto()}</h2>
          <div className="tipo-no-badge">
            {getTipoIcon(noSelecionado?.label)}
            {noSelecionado?.label}
          </div>
        </div>
        <div className="painel-header-actions">
          {noSelecionado?.properties?.instagram && (
            <>
              {noSelecionado?.properties?.stakeholder ? (
                <>
                  <button 
                    className="instagram-search-btn" 
                    title="Buscar instagram individual"
                    onClick={() => window.open(`https://www.instagram.com/${noSelecionado.properties.instagram}`, '_blank')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </button>
                  <button 
                    className="instagram-search-btn" 
                    title="Buscar instagram por stakeholder"
                    onClick={() => {
                      const stakeholders = grafo?.nodes()
                        .map(id => grafo?.getNodeAttributes(id))
                        .filter(node => node?.properties?.stakeholder && node?.properties?.instagram);
                      
                      if (stakeholders.length > 0) {
                        window.open(`https://www.instagram.com/${stakeholders[0].properties.instagram}`, '_blank');
                      }
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </button>
                  <button 
                    className="instagram-search-btn" 
                    title="Buscar instagram dos relacionados"
                    onClick={() => {
                      const relacionados = grafo?.neighbors(noSelecionado.id) || [];
                      const instagramsRelacionados = relacionados
                        .map(id => grafo?.getNodeAttributes(id))
                        .filter(node => node?.properties?.instagram)
                        .map(node => node.properties.instagram);
                      
                      if (instagramsRelacionados.length > 0) {
                        window.open(`https://www.instagram.com/${instagramsRelacionados[0]}`, '_blank');
                      }
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>
                    </svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </button>
                </>
              ) : (
                <button 
                  className="instagram-search-btn" 
                  title="Buscar instagram individual"
                  onClick={() => window.open(`https://www.instagram.com/${noSelecionado.properties.instagram}`, '_blank')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </button>
              )}
            </>
          )}
          <button className="fechar-btn" onClick={onClose}>×</button>
        </div>
      </div>
      
      <div className="propriedades-container">
        {obterPropriedadesRelevantes().map(({ categoria, propriedades }, catIndex) => (
          <div key={`cat-${catIndex}`} className="categoria-grupo">
            <div className="categoria-titulo">
              {getCategoriaIcon(categoria)}
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </div>
            <div className="categoria-conteudo">
              {propriedades.map(([chave, valor], propIndex) => (
                <div key={`${chave}-${propIndex}`} className="propriedade-item">
                  {getPropriedadeIcon(chave)}
                  {formatarPropriedade(chave, valor)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {noSelecionado.properties?.stakeholder && (
        <div className="stakeholder-badge">
          ⭐ Stakeholder
        </div>
      )}
    </div>
  );
};

export default PainelDeDetalhes;
