import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiBell, 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiPlus,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ROUTES } from '../utils/constants';
import { getInitials, generateColorFromString } from '../utils/helpers';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fechar menu de perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função de logout
  const handleLogout = async () => {
    try {
      await logout();
      success('Logout realizado com sucesso!');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função de busca
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  // Atalho de teclado para busca
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K para focar na busca
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        {/* Mobile Menu Toggle */}
        <button 
          className="header-mobile-toggle"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isSidebarOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Logo */}
        <Link to={ROUTES.HOME} className="header-logo">
          <span className="header-logo-text">guIA</span>
        </Link>

        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <div className={`header-search-container ${isSearchFocused ? 'focused' : ''}`}>
            <FiSearch className="header-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar usuários, posts, roteiros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="header-search-input"
            />
            <kbd className="header-search-shortcut">⌘K</kbd>
          </div>
        </form>

        {/* Actions */}
        <div className="header-actions">
          {/* Create Button */}
          <Link 
            to={ROUTES.CREATE_ITINERARY} 
            className="header-action-btn header-create-btn"
            title="Criar roteiro"
          >
            <FiPlus />
            <span className="header-action-text">Criar</span>
          </Link>

          {/* Notifications */}
          <button 
            className="header-action-btn header-notification-btn"
            title="Notificações"
          >
            <FiBell />
            <span className="header-notification-badge">3</span>
          </button>

          {/* Profile Menu */}
          <div className="header-profile" ref={profileMenuRef}>
            <button
              className="header-profile-btn"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
            >
              {user?.profile_picture ? (
                <img 
                  src={user.profile_picture} 
                  alt={user.first_name}
                  className="header-profile-avatar"
                />
              ) : (
                <div 
                  className="header-profile-avatar header-profile-avatar-fallback"
                  style={{ backgroundColor: generateColorFromString(user?.username || '') }}
                >
                  {getInitials(`${user?.first_name} ${user?.last_name}`)}
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="header-profile-menu">
                <div className="header-profile-menu-header">
                  <div className="header-profile-menu-info">
                    <span className="header-profile-menu-name">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <span className="header-profile-menu-username">
                      @{user?.username}
                    </span>
                  </div>
                </div>

                <div className="header-profile-menu-divider"></div>

                <nav className="header-profile-menu-nav">
                  <Link 
                    to={ROUTES.PROFILE} 
                    className="header-profile-menu-item"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <FiUser />
                    <span>Meu Perfil</span>
                  </Link>

                  <Link 
                    to={ROUTES.SETTINGS} 
                    className="header-profile-menu-item"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <FiSettings />
                    <span>Configurações</span>
                  </Link>

                  <div className="header-profile-menu-divider"></div>

                  <button
                    className="header-profile-menu-item header-profile-menu-logout"
                    onClick={handleLogout}
                  >
                    <FiLogOut />
                    <span>Sair</span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;