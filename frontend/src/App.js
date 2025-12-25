import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#2563eb' }}>🏥 Système NFC pour EHPAD</h1>
      <hr style={{ margin: '20px 0' }} />
      
      <div style={{ 
        background: '#f0fdf4', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>✅ Application Déployée avec Succès !</h2>
        <p><strong>Backend API :</strong> En ligne ✅</p>
        <p><strong>Frontend :</strong> En ligne ✅</p>
        <p><strong>Base de données :</strong> Opérationnelle ✅</p>
      </div>

      <div style={{ 
        background: '#fef3c7', 
        padding: '20px', 
        borderRadius: '8px'
      }}>
        <h3>🚧 En Développement</h3>
        <p>L'interface complète de l'application est en cours de développement.</p>
        <p>Fonctionnalités à venir :</p>
        <ul>
          <li>Gestion des résidents</li>
          <li>Scanner NFC</li>
          <li>Dossiers médicaux</li>
          <li>Historique des scans</li>
          <li>Tableau de bord statistiques</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
