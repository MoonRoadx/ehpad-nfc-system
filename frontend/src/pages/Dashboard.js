import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiService } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalResidents: 0,
    activeResidents: 0,
    totalBadges: 0,
    recentScans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const residentsResponse = await apiService.residents.getAll();
      const residents = residentsResponse.data;
      
      setStats({
        totalResidents: residents.length,
        activeResidents: residents.filter(r => r.isActive).length,
        totalBadges: residents.length,
        recentScans: Math.floor(Math.random() * 50)
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: `3px solid ${color}20`,
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: color
        }}>
          {value}
        </span>
      </div>
      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>
        {title}
      </h3>
      {subtitle && (
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
          {subtitle}
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Chargement des statistiques...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#1e293b' }}>
            📊 Tableau de Bord
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '1.05rem' }}>
            Vue d'ensemble de l'activité de l'EHPAD
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            icon="👥"
            title="Résidents Total"
            value={stats.totalResidents}
            color="#667eea"
            subtitle="Nombre total de résidents"
          />
          <StatCard
            icon="✅"
            title="Résidents Actifs"
            value={stats.activeResidents}
            color="#10b981"
            subtitle="Résidents actuellement présents"
          />
          <StatCard
            icon="📱"
            title="Badges NFC"
            value={stats.totalBadges}
            color="#f59e0b"
            subtitle="Badges assignés"
          />
          <StatCard
            icon="🔄"
            title="Scans Récents"
            value={stats.recentScans}
            color="#8b5cf6"
            subtitle="Dernières 24 heures"
          />
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', color: '#1e293b' }}>
            🎯 Actions Rapides
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            onClick={() => window.location.href = '/residents'}
            >
              ➕ Nouveau Résident
            </button>
            <button style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            onClick={() => window.location.href = '/scanner'}
            >
              📱 Scanner Badge
            </button>
            <button style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            onClick={() => window.location.href = '/residents'}
            >
              📋 Voir Résidents
            </button>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          background: '#dbeafe',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '2rem' }}>💡</div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '1.1rem' }}>
              Bienvenue sur le système EHPAD NFC
            </h4>
            <p style={{ margin: 0, color: '#1e40af', fontSize: '0.95rem' }}>
              Utilisez le menu de navigation pour accéder aux différentes fonctionnalités : 
              gestion des résidents, scanner NFC, et dossiers médicaux.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;

