import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '0 2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🏥</span>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>EHPAD NFC</h1>
          </div>
          
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/dashboard" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: isActive('/dashboard') ? 'rgba(255,255,255,0.2)' : 'transparent',
              transition: 'all 0.2s',
              fontWeight: '500'
            }}>
              📊 Dashboard
            </Link>
            <Link to="/residents" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: isActive('/residents') ? 'rgba(255,255,255,0.2)' : 'transparent',
              transition: 'all 0.2s',
              fontWeight: '500'
            }}>
              👥 Résidents
            </Link>
            <Link to="/scanner" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: isActive('/scanner') ? 'rgba(255,255,255,0.2)' : 'transparent',
              transition: 'all 0.2s',
              fontWeight: '500'
            }}>
              📱 Scanner NFC
            </Link>
            
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: '30px', margin: '0 0.5rem' }} />
            
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              👤 {user?.firstName || 'Utilisateur'} {user?.lastName || ''}
            </span>
            <button onClick={handleLogout} style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
              🚪 Déconnexion
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: '#1e293b',
        color: 'white',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        <p style={{ margin: 0 }}>
          © 2024 EHPAD NFC System - Système de gestion des résidents
        </p>
      </footer>
    </div>
  );
}

export default Layout;
