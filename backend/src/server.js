require('dotenv').config();
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

// Route spéciale pour créer les tables (à utiliser une seule fois)
app.get('/api/setup-database', async (req, res) => {
  try {
    const { exec } = require('child_process');
    exec('npm run migrate', (error, stdout, stderr) => {
      if (error) {
        logger.error('Erreur migration:', error);
        return res.status(500).json({ 
          success: false, 
          error: error.message,
          stderr: stderr 
        });
      }
      logger.info('Migration réussie');
      res.json({ 
        success: true, 
        message: 'Tables créées avec succès', 
        output: stdout 
      });
    });
  } catch (error) {
    logger.error('Erreur setup-database:', error);
    res.status(500).json({ success: false, error: error.message });
  }
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
