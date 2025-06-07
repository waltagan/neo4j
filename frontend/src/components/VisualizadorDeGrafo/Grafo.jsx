import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useDadosDoGrafo } from "./useDadosDoGrafo";

const Grafo = ({ onNodeClick, settings, noSelecionado, onMetricsUpdate }) => {
    const { grafo, erro } = useDadosDoGrafo();
    const fgRef = useRef();
    const [comunidadeFiltrada, setComunidadeFiltrada] = useState(null);
    const [legendaVisivel, setLegendaVisivel] = useState(true);

    // Função para encontrar a comunidade de um nó (nós conectados direta ou indiretamente)
    const encontrarComunidade = useCallback((grafo, nodeId) => {
        if (!grafo || !grafo.hasNode(nodeId)) return null;
        
        const visitados = new Set();
        const fila = [nodeId];
        const comunidade = new Set();
        
        while (fila.length > 0) {
            const noAtual = fila.shift();
            if (visitados.has(noAtual)) continue;
            
            visitados.add(noAtual);
            comunidade.add(noAtual);
            
            // Adiciona vizinhos (tanto direcionais quanto não direcionais)
            try {
                grafo.forEachNeighbor(noAtual, (vizinho) => {
                    if (!visitados.has(vizinho)) {
                        fila.push(vizinho);
                    }
                });
            } catch (e) {
                // Em caso de erro, continua sem parar o processo
            }
        }
        
        return comunidade;
    }, []);

    // Efeito para filtrar comunidade quando um nó é selecionado
    useEffect(() => {
        if (!grafo || !noSelecionado) {
            setComunidadeFiltrada(null);
            return;
        }
        
        const comunidade = encontrarComunidade(grafo, noSelecionado.id);
        setComunidadeFiltrada(comunidade);
    }, [grafo, noSelecionado, encontrarComunidade]);

    // Converte o grafo do graphology para o formato esperado pelo react-force-graph
    const data = useMemo(() => {
        if (!grafo) {
            return { nodes: [], links: [] };
        }

        let nodes = grafo.nodes().map(node => ({
            id: node,
            ...grafo.getNodeAttributes(node)
        }));

        let links = grafo.edges().map(edge => {
            const source = grafo.source(edge);
            const target = grafo.target(edge);
            return {
                source,
                target,
                ...grafo.getEdgeAttributes(edge)
            };
        });

        // Se há uma comunidade filtrada, mostra apenas os nós da comunidade
        if (comunidadeFiltrada && comunidadeFiltrada.size > 0) {
            nodes = nodes.filter(node => comunidadeFiltrada.has(node.id));
            links = links.filter(link => 
                comunidadeFiltrada.has(link.source) && comunidadeFiltrada.has(link.target)
            );
        }

        return { nodes, links };
    }, [grafo, comunidadeFiltrada]);

    // Atualiza as métricas quando os dados mudam
    useEffect(() => {
        // Evita atualizações desnecessárias
        const nodesCount = data.nodes.length;
        const linksCount = data.links.length;
        const communitiesCount = comunidadeFiltrada ? 1 : grafo?.communities?.length || 0;

        // Só atualiza se houver mudanças reais
        if (onMetricsUpdate) {
            onMetricsUpdate({
                nodes: nodesCount,
                links: linksCount,
                communities: communitiesCount
            });
        }
    }, [data.nodes.length, data.links.length, comunidadeFiltrada, grafo?.communities?.length, onMetricsUpdate]);

    // Função para obter o texto do tooltip baseado no tipo de nó
    const obterTextoTooltip = useCallback((node) => {
        const properties = node.properties || {};
        const label = node.label;

        // Para Pessoa ou Advogado, mostra firstname + lastname
        if (label === 'Pessoa' || label === 'Advogado') {
            const nome = `${properties.firstname || ''} ${properties.lastname || ''}`.trim();
            return nome || `${label} sem nome`;
        }

        // Para Empresa, prioriza nome_fantasia, senão razao_social
        if (label === 'Empresa') {
            return properties.nome_fantasia || properties.razao_social || 'Empresa sem nome';
        }

        // Fallback para outros tipos
        return `${label}: ${node.id}`;
    }, []);

    // Manipulador de clique no nó
    const handleNodeClick = useCallback((node) => {
        if (onNodeClick) {
            onNodeClick(node);
        }
    }, [onNodeClick]);
    
    // Manipulador para o desenho do objeto do nó (círculo)
    const handleNodeCanvasObject = useCallback((node, ctx, globalScale) => {
        const nodeSize = node.size || settings.defaultNodeSize;
        const radius = nodeSize / globalScale;
        
        // Desenha o círculo do nó
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color || 'rgba(31, 119, 180, 0.8)';
        ctx.fill();
        
        // Adiciona contorno preto se tem Instagram
        if (node.hasInstagram) {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2 / globalScale;
            ctx.stroke();
        }
    }, [settings]);

    // Componente de Legenda
    const Legenda = () => (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 10,
        }}>
            <button 
                onClick={() => setLegendaVisivel(!legendaVisivel)}
                style={{
                    alignSelf: 'flex-end',
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    padding: 0
                }}
                title={legendaVisivel ? "Ocultar legenda" : "Mostrar legenda"}
            >
                {legendaVisivel ? "×" : "?"}
            </button>
            
            {legendaVisivel && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    minWidth: '200px'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
                        Legenda
                    </div>
                    
                    {/* Tipos de Nós */}
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontWeight: '600', marginBottom: '6px' }}>Tipos:</div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ width: '12px', height: '12px', background: '#EF4444', borderRadius: '50%', marginRight: '8px' }}></div>
                            <span>Stakeholder</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ width: '12px', height: '12px', background: '#3B82F6', borderRadius: '50%', marginRight: '8px' }}></div>
                            <span>Empresa</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%', marginRight: '8px' }}></div>
                            <span>Pessoa</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ width: '12px', height: '12px', background: '#F97316', borderRadius: '50%', marginRight: '8px' }}></div>
                            <span>Advogado</span>
                        </div>
                    </div>
                    
                    {/* Instagram */}
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontWeight: '600', marginBottom: '6px' }}>Instagram:</div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ width: '12px', height: '12px', background: '#DC2626', border: '2px solid #000000', borderRadius: '50%', marginRight: '8px' }}></div>
                            <span>Com Instagram</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ width: '12px', height: '12px', background: '#EF4444', borderRadius: '50%', marginRight: '8px' }}></div>
                            <span>Sem Instagram</span>
                        </div>
                    </div>

                    {/* Tamanhos */}
                    <div>
                        <div style={{ fontWeight: '600', marginBottom: '6px' }}>Tamanho:</div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ width: '18px', height: '18px', background: '#EF4444', borderRadius: '50%', marginRight: '8px' }}></div>
                            <span>Stakeholder (50% maior)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '12px', height: '12px', background: '#3B82F6', borderRadius: '50%', marginRight: '8px' }}></div>
                            <span>Tamanho normal</span>
                        </div>
                    </div>
                    
                    {comunidadeFiltrada && (
                        <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#F0F9FF', borderRadius: '6px' }}>
                            <div style={{ fontWeight: '600', color: '#1E40AF' }}>
                                Mostrando comunidade: {comunidadeFiltrada.size} nós
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    useEffect(() => {
        const fg = fgRef.current;
        if (!fg) return;

        // Atualiza as forças da simulação de forma segura
        const chargeForce = fg.d3Force('charge');
        if (chargeForce) chargeForce.strength(settings.charge);

        const linkForce = fg.d3Force('link');
        if (linkForce) {
            linkForce
                .strength(settings.linkStrength)
                .distance(settings.linkDistance);
        }

        const centerForce = fg.d3Force('center');
        if (centerForce) centerForce.strength(settings.centerStrength);

        const collideForce = fg.d3Force('collide');
        if (collideForce) collideForce.radius(settings.collisionRadius);

        // Reaquece a simulação para aplicar as mudanças de força
        fg.d3ReheatSimulation();

    }, [settings]);

    // Efeito para redimensionar o gráfico quando a janela for redimensionada
    useEffect(() => {
        const handleResize = () => {
            if (fgRef.current) {
                fgRef.current.width(window.innerWidth);
                fgRef.current.height(window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (erro) return <div>Erro ao carregar os dados: {erro.message}</div>;
    if (!grafo) return <div>Carregando rede...</div>;

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <ForceGraph2D
                ref={fgRef}
                graphData={data}
                // Propriedades de renderização
                width={window.innerWidth}
                height={window.innerHeight}
                nodeCanvasObject={handleNodeCanvasObject}
                nodePointerAreaPaint={(node, color, ctx) => {
                    const nodeSize = node.size || settings.defaultNodeSize;
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, nodeSize / 2, 0, 2 * Math.PI, false);
                    ctx.fill();
                }}
                linkColor={() => "rgba(0,0,0,0.2)"}
                linkWidth={1}
                // Interação
                onNodeClick={handleNodeClick}
                nodeLabel={obterTextoTooltip}
                // Propriedades da simulação de força
                forceEngine="d3"
                d3Force_charge_strength={settings.charge}
                d3Force_link_strength={settings.linkStrength}
                d3Force_link_distance={settings.linkDistance}
                d3Force_center_strength={settings.centerStrength}
                d3Force_collide_radius={settings.collisionRadius}
            />
            <Legenda />
        </div>
    );
};

export default Grafo; 