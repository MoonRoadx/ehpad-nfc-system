import React, { useState } from 'react';
import Layout from '../components/Layout';
import { apiService } from '../services/api';

function NFCScanner() {
  const [badgeUid, setBadgeUid] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!badgeUid.trim()) return;

    setScanning(true);
    setError('');
    setResult(null);

    try {
      const response = await apiService.nfc.scan(badgeUid);
      setResult(response.data);
      setBadgeUid('');
    } catch (err) {
      setError(err.response?.data?.error || 'Badge non trouvé ou erreur lors du scan');
    } finally {
      setScanning(false);
    }
  };

  const simulateScan = () => {
    const randomUid = 'NFC' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setBadgeUid(randomUid);
  };

  return (
    <Layout>
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#1e293b' }}>
            📱 Scanner de Badge NFC
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '1.05rem' }}>
            Scannez un badge NFC pour identifier un résident
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              animation: scanning ? 'pulse 1.5s ease-in-out infinite' : 'none'
            }}>
              📱
            </div>

            <h3 style={{ textAlign: 'center', margin: '0 0 1.5rem 0', color: '#1e293b' }}>
              Scanner un Badge
            </h3>

            <form onSubmit={handleScan}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500' }}>
                  UID du Badge NFC
                </label>
                <input
                  type="text"
                  value={badgeUid}
                  onChange={(e) => setBadgeUid(e.target.value)}
                  placeholder="Ex: NFC123ABC456"
                  disabled={scanning}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={scanning || !badgeUid.trim()}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: scanning ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: scanning || !badgeUid.trim() ? 'not-allowed' : 'pointer',
                  marginBottom: '0.75rem',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => !scanning && badgeUid.trim() && (e.target.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {scanning ? '⏳ Scan en cours...' : '🔍 Scanner le badge'}
              </button>

              <button
                type="button"
                onClick={simulateScan}
                disabled={scanning}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: scanning ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => !scanning && (e.target.style.background = '#e2e8f0')}
                onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
              >
                🎲 Générer un UID de test
              </button>
            </form>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>
              📋 Résultat du Scan
            </h3>

            {!result && !error && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                <p style={{ margin: 0, fontSize: '1.05rem' }}>
                  En attente d'un scan...
                </p>
              </div>
            )}

            {error && (
              <div style={{
                background: '#fee2e2',
                border: '2px solid #fca5a5',
                borderRadius: '8px',
                padding: '1.5rem',
                color: '#dc2626'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
                <p style={{ margin: 0, fontWeight: '600', marginBottom: '0.5rem' }}>
                  Erreur de scan
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  {error}
                </p>
              </div>
            )}

            {result && result.resident && (
              <div style={{
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                border: '2px solid #10b981',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>✅</div>
                <h4 style={{ margin: '0 0 1rem 0', color: '#065f46', fontSize: '1.3rem', textAlign: 'center' }}>
                  Résident identifié
                </h4>
                <div style={{ background: 'white', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Nom :</span>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b', fontWeight: '600', fontSize: '1.1rem' }}>
                      {result.resident.firstName} {result.resident.lastName}
                    </p>
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Chambre :</span>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b', fontWeight: '600' }}>
                      {result.resident.roomNumber || 'Non assignée'}
                    </p>
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Date de naissance :</span>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b', fontWeight: '600' }}>
                      {new Date(result.resident.dateOfBirth).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {result.resident.emergencyContactName && (
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Contact d'urgence :</span>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b', fontWeight: '600' }}>
                        {result.resident.emergencyContactName}
                      </p>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '6px', fontSize: '0.9rem', color: '#92400e' }}>
                  ℹ️ Scan enregistré le {new Date().toLocaleString('fr-FR')}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          background: '#dbeafe',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            💡 Comment utiliser le scanner
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1e40af', fontSize: '0.95rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Approchez le badge NFC du lecteur ou saisissez manuellement l'UID
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Cliquez sur "Générer un UID de test" pour tester sans lecteur physique
            </li>
            <li>
              Les informations du résident s'afficheront instantanément après le scan
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </Layout>
  );
}

export default NFCScanner;
