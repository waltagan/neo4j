import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Render main app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize stagewise toolbar in development mode only
if (import.meta.env.DEV) {
  import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
    const stagewiseConfig = {
      plugins: []
    };

    // Create separate root for stagewise toolbar
    const toolbarContainer = document.createElement('div');
    toolbarContainer.id = 'stagewise-toolbar';
    document.body.appendChild(toolbarContainer);

    createRoot(toolbarContainer).render(
      <StagewiseToolbar config={stagewiseConfig} />
    );
  }).catch(() => {
    // Silently fail if stagewise is not available
  });
}
