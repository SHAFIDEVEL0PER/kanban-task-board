import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon">📋</div>
          <span>KanbanFlow</span>
        </Link>
        
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Все доски
          </Link>
        </nav>
        
        <div className="header-actions">
          <div className="user-avatar">
            <span>👤</span>
          </div>
        </div>
      </div>
    </header>
  );
};