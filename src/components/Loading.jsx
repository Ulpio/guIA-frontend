import React from 'react';

// Componente de loading simples (spinner)
export const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'loading-spinner-sm',
    md: 'loading-spinner-md',
    lg: 'loading-spinner-lg',
    xl: 'loading-spinner-xl',
  };

  const colorClasses = {
    primary: 'loading-spinner-primary',
    secondary: 'loading-spinner-secondary',
    white: 'loading-spinner-white',
  };

  return (
    <div 
      className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}
      role="status"
      aria-label="Carregando"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

// Componente de loading com overlay
export const LoadingOverlay = ({ message = 'Carregando...' }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-overlay-content">
        <LoadingSpinner size="lg" color="white" />
        <p className="loading-overlay-message">{message}</p>
      </div>
    </div>
  );
};

// Componente de loading para páginas
export const PageLoading = ({ message = 'Carregando...' }) => {
  return (
    <div className="page-loading">
      <div className="page-loading-content">
        <LoadingSpinner size="xl" />
        <h3 className="page-loading-title">guIA</h3>
        <p className="page-loading-message">{message}</p>
      </div>
    </div>
  );
};

// Componente de loading para botões
export const ButtonLoading = ({ size = 'sm' }) => {
  return <LoadingSpinner size={size} color="white" />;
};

// Componente de loading para cards/conteúdo
export const ContentLoading = ({ lines = 3, showAvatar = false }) => {
  return (
    <div className="content-loading">
      {showAvatar && (
        <div className="content-loading-avatar"></div>
      )}
      <div className="content-loading-text">
        {Array.from({ length: lines }, (_, index) => (
          <div 
            key={index} 
            className={`content-loading-line ${index === lines - 1 ? 'content-loading-line-short' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Componente de skeleton para listas
export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-header">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text">
          <div className="skeleton-line skeleton-line-name"></div>
          <div className="skeleton-line skeleton-line-subtitle"></div>
        </div>
      </div>
      <div className="skeleton-card-content">
        <div className="skeleton-line skeleton-line-full"></div>
        <div className="skeleton-line skeleton-line-full"></div>
        <div className="skeleton-line skeleton-line-half"></div>
      </div>
    </div>
  );
};

// Componente de loading para grid de cards
export const GridLoading = ({ count = 6, cardType = 'post' }) => {
  return (
    <div className={`grid-loading ${cardType === 'itinerary' ? 'grid-loading-itinerary' : 'grid-loading-post'}`}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

// HOC para mostrar loading enquanto carrega dados
export const withLoading = (WrappedComponent) => {
  return ({ isLoading, loadingComponent: LoadingComponent = PageLoading, ...props }) => {
    if (isLoading) {
      return <LoadingComponent />;
    }
    
    return <WrappedComponent {...props} />;
  };
};

export default LoadingSpinner;