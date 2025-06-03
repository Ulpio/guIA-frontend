import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Log de informações da aplicação em desenvolvimento
if (import.meta.env.DEV) {
  console.log('🚀 guIA Frontend iniciando...');
  console.log('📝 Modo:', import.meta.env.MODE);
  console.log('🔗 API Base URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('📱 Versão:', import.meta.env.VITE_APP_VERSION);
}

// Configurar error boundary global
window.addEventListener('error', (event) => {
  console.error('❌ Erro global capturado:', event.error);
  
  // Em produção, você pode enviar erros para um serviço de monitoramento
  if (import.meta.env.PROD) {
    // Exemplo: Sentry.captureException(event.error);
  }
});

// Configurar promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rejeitada:', event.reason);
  
  // Prevenir que o erro apareça no console do browser
  event.preventDefault();
  
  // Em produção, você pode enviar erros para um serviço de monitoramento
  if (import.meta.env.PROD) {
    // Exemplo: Sentry.captureException(event.reason);
  }
});

// Renderizar aplicação
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)