import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiMap, 
  FiUser, 
  FiSearch,
  FiTrendingUp,
  FiBookmark,
  FiUsers,
  FiSettings,
  FiPlus
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';
import { formatNumber } from '../utils/helpers';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Função para verificar se o link está ativo
  const isActiveLink = (path) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Menu principal
  const mainMenuItems = [
    {
      path: ROUTES.HOME,
      icon: FiHome,
      label: 'Feed',
      description: 'Suas últimas atualizações'
    },
    {
      path: ROUTES.ITINERARIES,
      icon: FiMap,
      label: 'Roteiros',
      description: 'Descubra novos destinos'
    },
    {
      path: ROUTES.SEARCH,
      icon: FiSearch,
      label: 'Explorar',
      description: 'Buscar conteúdo'
    },
    {
      path: '/trending',
      icon: FiTrendingUp,
      label: 'Em Alta',
      description: 'Conteúdo popular'
    }
  ];

  // Menu secundário
  const secondaryMenuItems = [
    {
      path: ROUTES.PROFILE,
      icon: FiUser,
      label: 'Meu Perfil',
      description: 'Suas informações'
    },
    {
      path: '/saved',
      icon: FiBookmark,
      label: 'Salvos',
      description: 'Conteúdo salvo'
    },
    {
      path: '/connections',
      icon: FiUsers,
      label: 'Conexões',
      description: 'Seus seguidores'
    }
  ];

  const handleLinkClick = () => {
    // Fechar sidebar no mobile ao clicar em um link
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          {/* User Profile Summary */}
          <div className="sidebar-profile">
            <Link 
              to={ROUTES.PROFILE} 
              className="sidebar-profile-link"
              onClick={handleLinkClick}
            >
              {user?.profile_picture ? (
                <img 
                  src={user.profile_picture} 
                  alt={user.first_name}
                  className="sidebar-profile-avatar"
                />
              ) : (
                <div className="sidebar-profile-avatar sidebar-profile-avatar-fallback">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </div>
              )}
              <div className="sidebar-profile-info">
                <span className="sidebar-profile-name">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="sidebar-profile-username">
                  @{user?.username}
                </span>
              </div>
            </Link>

            {/* Stats */}
            <div className="sidebar-profile-stats">
              <div className="sidebar-stat">
                <span className="sidebar-stat-number">
                  {formatNumber(user?.itineraries_count || 0)}
                </span>
                <span className="sidebar-stat-label">Roteiros</span>
              </div>
              <div className="sidebar-stat">
                <span className="sidebar-stat-number">
                  {formatNumber(user?.followers_count || 0)}
                </span>
                <span className="sidebar-stat-label">Seguidores</span>
              </div>
              <div className="sidebar-stat">
                <span className="sidebar-stat-number">
                  {formatNumber(user?.following_count || 0)}
                </span>
                <span className="sidebar-stat-label">Seguindo</span>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <Link 
            to={ROUTES.CREATE_ITINERARY}
            className="sidebar-create-btn"
            onClick={handleLinkClick}
          >
            <FiPlus />
            <span>Criar Roteiro</span>
          </Link>

          {/* Main Navigation */}
          <nav className="sidebar-nav">
            <div className="sidebar-nav-section">
              <ul className="sidebar-nav-list">
                {mainMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveLink(item.path);
                  
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        <Icon className="sidebar-nav-icon" />
                        <div className="sidebar-nav-content">
                          <span className="sidebar-nav-label">{item.label}</span>
                          <span className="sidebar-nav-description">{item.description}</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Divider */}
            <div className="sidebar-divider"></div>

            {/* Secondary Navigation */}
            <div className="sidebar-nav-section">
              <ul className="sidebar-nav-list">
                {secondaryMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveLink(item.path);
                  
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        <Icon className="sidebar-nav-icon" />
                        <div className="sidebar-nav-content">
                          <span className="sidebar-nav-label">{item.label}</span>
                          <span className="sidebar-nav-description">{item.description}</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Divider */}
            <div className="sidebar-divider"></div>

            {/* Settings */}
            <div className="sidebar-nav-section">
              <ul className="sidebar-nav-list">
                <li>
                  <Link
                    to={ROUTES.SETTINGS}
                    className={`sidebar-nav-link ${isActiveLink(ROUTES.SETTINGS) ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <FiSettings className="sidebar-nav-icon" />
                    <div className="sidebar-nav-content">
                      <span className="sidebar-nav-label">Configurações</span>
                      <span className="sidebar-nav-description">Preferências</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Footer */}
          <div className="sidebar-footer">
            <p className="sidebar-footer-text">
              © 2024 guIA. Todos os direitos reservados.
            </p>
            <p className="sidebar-footer-version">
              v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;