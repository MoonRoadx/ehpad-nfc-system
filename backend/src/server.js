require('dotenv').config();
// Auto-migration au démarrage
const { pool } = require('./database/db');
const fs = require('fs');
const path = require('path');

// Fonction pour exécuter la migration
async function runMigrations() {
  console.log('🔄 Vérification de la base de données...');
  try {
    const client = await pool.connect();
    
    // Vérifier si les tables existent
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    
    if (result.rows.length === 0) {
      console.log('📊 Création des tables...');
      // Exécuter le script de migration
      const { exec } = require('child_process');
      exec('npm run migrate', (error, stdout, stderr) => {
        if (error) {
          console.error('Erreur migration:', error);
          return;
        }
        console.log('✅ Tables créées avec succès');
      });
    } else {
      console.log('✅ Tables déjà présentes');
    }
    
    client.release();
  } catch (error) {
    console.error('⚠️ Erreur lors de la vérification:', error);
  }
}

// Exécuter les migrations au démarrage
runMigrations();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');

const residentsRoutes = require('./routes/residents');
const nfcRoutes = require('./routes/nfc');
const authRoutes = require('./routes/auth');
const medicalRoutes = require('./routes/medical');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/residents', residentsRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/medical', medicalRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erreur serveur interne',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
  console.log(`🚀 API EHPAD NFC disponible sur http://localhost:${PORT}`);
});

module.exports = app;
