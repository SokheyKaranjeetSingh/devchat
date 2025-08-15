import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Remove search bar from all pages
  const showSearch = false;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="main-layout">
        <TopBar 
          onToggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          showSearch={showSearch}
        />
        <main className="main-content">
          {children}
        </main>
      </div>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
    </div>
  );
};

export default Layout;
