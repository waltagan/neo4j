import React from "react";
import Grafo from "./Grafo.jsx";

const VisualizadorDeGrafo = ({ onNodeClick, settings, noSelecionado, onMetricsUpdate }) => {
    return (
        <div style={{ height: "100%", width: "100%", minHeight: "500px", position: 'relative' }}>
            <Grafo 
                onNodeClick={onNodeClick} 
                settings={settings} 
                noSelecionado={noSelecionado}
                onMetricsUpdate={onMetricsUpdate}
            />
        </div>
    );
};

export default VisualizadorDeGrafo;
