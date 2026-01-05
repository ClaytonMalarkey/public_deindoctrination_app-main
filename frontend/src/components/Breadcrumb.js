import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/dashboard':
        return [
          { label: '🏠 Dashboard', path: '/dashboard', active: true }
        ];
      case '/leaderboard':
        return [
          { label: '🏠 Dashboard', path: '/dashboard', active: false },
          { label: '🏆 Leaderboard', path: '/leaderboard', active: true }
        ];
      default:
        return [
          { label: '🏠 Dashboard', path: '/dashboard', active: false }
        ];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '10px 0',
      fontSize: '14px',
      color: '#666'
    }}>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <span style={{ margin: '0 8px', color: '#ccc' }}>
              →
            </span>
          )}
          {crumb.active ? (
            <span style={{ 
              color: '#2d5016', 
              fontWeight: 'bold' 
            }}>
              {crumb.label}
            </span>
          ) : (
            <Link 
              to={crumb.path}
              style={{
                color: '#666',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#4a7c59'}
              onMouseLeave={(e) => e.target.style.color = '#666'}
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;