import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './SideBar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Fechar sidebar automaticamente no mobile quando redimensiona
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Gerenciar scroll quando sidebar está aberta no mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout">
      {/* Header */}
      <Header 
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="layout-body">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen || !isMobile}
          onClose={closeSidebar}
        />

        {/* Main Content */}
        <main className="layout-main">
          <div className="layout-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;