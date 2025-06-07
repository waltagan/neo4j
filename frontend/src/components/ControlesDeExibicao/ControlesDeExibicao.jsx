import React from 'react';
import './ControlesDeExibicao.css';

const ControlesDeExibicao = ({ settings, onSettingsChange, onSaveDefault }) => {
  const handleSettingChange = (setting, value) => {
    onSettingsChange({
      ...settings,
      [setting]: value,
    });
  };

  return (
    <div className="controles-exibicao">
      <h3>Ajustes da Simulação</h3>
      <div className="config-section">
        <label>
          <span>Repulsão (Charge)</span>
          <input type="range" min="-500" max="0" step="1" value={settings.charge} onChange={(e) => handleSettingChange('charge', +e.target.value)} />
          <span>{settings.charge.toFixed(2)}</span>
        </label>
        <label>
          <span>Alcance Repulsão (Max)</span>
          <input type="range" min="0" max="1000" step="10" value={settings.chargeMaxDistance} onChange={(e) => handleSettingChange('chargeMaxDistance', +e.target.value)} />
          <span>{settings.chargeMaxDistance}</span>
        </label>
        <label>
          <span>Força Link</span>
          <input type="range" min="0" max="2" step="0.01" value={settings.linkStrength} onChange={(e) => handleSettingChange('linkStrength', +e.target.value)} />
          <span>{settings.linkStrength.toFixed(2)}</span>
        </label>
        <label>
          <span>Distância Link</span>
          <input type="range" min="1" max="200" step="1" value={settings.linkDistance} onChange={(e) => handleSettingChange('linkDistance', +e.target.value)} />
          <span>{settings.linkDistance}</span>
        </label>
        <label>
          <span>Força Central</span>
          <input type="range" min="0" max="1" step="0.01" value={settings.centerStrength} onChange={(e) => handleSettingChange('centerStrength', +e.target.value)} />
          <span>{settings.centerStrength.toFixed(2)}</span>
        </label>
        <label>
          <span>Raio Colisão</span>
          <input type="range" min="0" max="100" step="1" value={settings.collisionRadius} onChange={(e) => handleSettingChange('collisionRadius', +e.target.value)} />
          <span>{settings.collisionRadius}</span>
        </label>
        <label>
          <span>Decaimento Alpha</span>
          <input type="range" min="0" max="0.1" step="0.0001" value={settings.alphaDecay} onChange={(e) => handleSettingChange('alphaDecay', +e.target.value)} />
          <span>{settings.alphaDecay.toFixed(4)}</span>
        </label>
        <label>
          <span>Decaimento Velocidade</span>
          <input type="range" min="0" max="1" step="0.01" value={settings.velocityDecay} onChange={(e) => handleSettingChange('velocityDecay', +e.target.value)} />
          <span>{settings.velocityDecay.toFixed(2)}</span>
        </label>
      </div>

      <h3>Características Visuais</h3>
      <div className="config-section">
        <h4>Nós</h4>
        <label>
          <span>Tamanho do Nó</span>
          <input type="range" min="1" max="50" step="1" value={settings.defaultNodeSize} onChange={(e) => handleSettingChange('defaultNodeSize', +e.target.value)} />
          <span>{settings.defaultNodeSize}</span>
        </label>
      </div>

      <div className="config-section">
        <h4>Arestas</h4>
        <label>
          <span>Tamanho da Aresta</span>
          <input type="range" min="0.1" max="10" step="0.1" value={settings.defaultEdgeSize} onChange={(e) => handleSettingChange('defaultEdgeSize', +e.target.value)} />
           <span>{settings.defaultEdgeSize.toFixed(1)}</span>
        </label>
      </div>

      <button className="save-button" onClick={onSaveDefault}>
        Salvar como Padrão
      </button>
    </div>
  );
};

export default ControlesDeExibicao; 