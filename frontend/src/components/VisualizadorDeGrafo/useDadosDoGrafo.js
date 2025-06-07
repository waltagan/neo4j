import { useEffect, useState, useRef } from "react";
import Graph from "graphology";
import { buscarDadosDaRede } from "../../services/cliente_api";

/**
 * Hook customizado para buscar e gerenciar os dados do grafo da rede.
 *
 * Este hook encapsula a lógica de:
 * 1. Chamar a API para obter os nós e arestas.
 * 2. Instanciar um objeto Graph (graphology).
 * 3. Popular o grafo com os dados recebidos.
 * 4. Aplicar cores baseadas nas propriedades dos nós.
 * 5. Retornar a instância do grafo para ser usada por componentes React.
 *
 * @returns {Graph | null} A instância do grafo de graphology, ou nulo se ainda estiver carregando.
 */
export function useDadosDoGrafo() {
  const [grafo, setGrafo] = useState(null);
  const [erro, setErro] = useState(null);
  const carregamentoEmAndamento = useRef(false);

  /**
   * Determina a cor do nó baseada nas suas propriedades e label.
   * @param {Object} no - O objeto do nó com suas propriedades
   * @returns {string} A cor em formato hexadecimal
   */
  function determinarCorDoNo(no) {
    const temInstagram = no.properties && no.properties.instagram && 
                        no.properties.instagram !== null && 
                        no.properties.instagram !== "Não encontrado";
    
    // 1) nós com stakeholder=true -> Tons de Vermelho
    if (no.properties && no.properties.stakeholder === true) {
      return temInstagram ? '#DC2626' : '#EF4444'; // Vermelho mais escuro se tem Instagram
    }
    
    // 2) Nós que são empresas -> Tons de Azul
    if (no.label === 'Empresa') {
      return temInstagram ? '#1D4ED8' : '#3B82F6'; // Azul mais escuro se tem Instagram
    }
    
    // 3) Nós que são pessoas -> Tons de Verde
    if (no.label === 'Pessoa') {
      return temInstagram ? '#059669' : '#10B981'; // Verde mais escuro se tem Instagram
    }
    
    // 4) Nós que são advogados -> Tons de Laranja
    if (no.label === 'Advogado') {
      return temInstagram ? '#EA580C' : '#F97316'; // Laranja mais escuro se tem Instagram
    }
    
    // Cor padrão para casos não previstos
    return temInstagram ? '#6B7280' : '#9CA3AF'; // Cinza mais escuro se tem Instagram
  }

  /**
   * Determina o tamanho do nó baseado nas suas propriedades
   * @param {Object} no - O objeto do nó com suas propriedades
   * @param {number} tamanhoBase - Tamanho base dos nós
   * @returns {number} O tamanho do nó
   */
  function determinarTamanhoDoNo(no, tamanhoBase) {
    // Stakeholders são 50% maiores
    if (no.properties && no.properties.stakeholder === true) {
      return tamanhoBase * 1.5;
    }
    return tamanhoBase;
  }

  /**
   * Determina se o nó deve ter contorno preto (tem Instagram)
   * @param {Object} no - O objeto do nó com suas propriedades
   * @returns {boolean} Se deve ter contorno preto
   */
  function deveTemContornoPreto(no) {
    return no.properties && no.properties.instagram && 
           no.properties.instagram !== null && 
           no.properties.instagram !== "Não encontrado";
  }

  useEffect(() => {
    async function carregarDados() {
      // Previne múltiplas execuções simultâneas
      if (carregamentoEmAndamento.current) {
        console.log("Carregamento já em andamento, ignorando nova tentativa");
        return;
      }
      
      carregamentoEmAndamento.current = true;
      
      try {
        console.log("🚀 Iniciando carregamento dos dados da rede...");
        const dadosDaRede = await buscarDadosDaRede();
        const novoGrafo = new Graph({ multi: true });

        console.log(`📊 Dados recebidos: ${dadosDaRede.nodes.length} nós e ${dadosDaRede.edges.length} arestas`);

        // Adiciona os nós ao grafo com cores baseadas nas propriedades
        dadosDaRede.nodes.forEach((no) => {
          const cor = determinarCorDoNo(no);
          const tamanho = determinarTamanhoDoNo(no, 15); // Usar tamanho base de 15
          const temContorno = deveTemContornoPreto(no);
          
          novoGrafo.addNode(no.id, { 
            ...no,
            color: cor,
            size: tamanho,
            hasInstagram: temContorno
          });
        });

        // Adiciona as arestas ao grafo
        let arestasAdicionadas = 0;
        dadosDaRede.edges.forEach((aresta, index) => {
          // Usar addEdgeWithKey com a ID da aresta garante que múltiplas
          // arestas entre os mesmos nós sejam permitidas, desde que tenham IDs diferentes.
          
          // Debug: verificar estrutura das primeiras arestas
          if (index < 3) {
            console.log(`🔗 Aresta ${index}:`, aresta);
          }
          
          // Verificar se os nós source e target existem
          if (!novoGrafo.hasNode(aresta.source)) {
            console.warn(`⚠️ Nó de origem ${aresta.source} não encontrado para aresta ${aresta.id}`);
            return;
          }
          
          if (!novoGrafo.hasNode(aresta.target)) {
            console.warn(`⚠️ Nó de destino ${aresta.target} não encontrado para aresta ${aresta.id}`);
            return;
          }
          
          try {
            novoGrafo.addEdgeWithKey(aresta.id, aresta.source, aresta.target, { 
              ...aresta,
              size: 1,
              color: "#CCCCCC"
            });
            arestasAdicionadas++;
          } catch (e) {
            // Ignora o erro se a aresta já existir (pode acontecer em alguns casos de borda com a consulta)
            if (!/already exists/.test(e.message)) {
              console.error("❌ Erro ao adicionar aresta:", e, aresta);
              throw e;
            } else {
              console.warn(`⚠️ Aresta duplicada ignorada: ${aresta.id}`);
            }
          }
        });

        console.log(`✅ Grafo criado com ${novoGrafo.order} nós e ${novoGrafo.size} arestas (${arestasAdicionadas} adicionadas)`);
        console.log("🎨 Cores aplicadas baseadas nas propriedades dos nós.");

        setGrafo(novoGrafo);
      } catch (error) {
        console.error("❌ Erro ao carregar e processar os dados do grafo:", error);
        setErro(error);
        setGrafo(null); // Em caso de erro, garante que o grafo seja nulo
      } finally {
        carregamentoEmAndamento.current = false;
      }
    }

    // Só carrega se ainda não temos um grafo
    if (!grafo) {
      carregarDados();
    }
  }, []); // Array vazio para executar apenas uma vez

  return { grafo, erro };
}
