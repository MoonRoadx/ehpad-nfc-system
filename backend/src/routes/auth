const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database/db');
const logger = require('../utils/logger');

// Validation pour l'inscription
const validateRegister = [
  body('username').trim().isLength({ min: 3 }).withMessage('Nom d\'utilisateur requis (min 3 caractères)'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe requis (min 6 caractères)'),
  body('role').isIn(['admin', 'staff', 'nurse']).withMessage('Rôle invalide')
];

// POST - Inscription
router.post('/register', validateRegister, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { username, email, password, role, firstName, lastName } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existing = await db.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nom d\'utilisateur ou email déjà utilisé' 
      });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const result = await db.query(`
      INSERT INTO users (username, email, password_hash, role, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, role, first_name, last_name, created_at
    `, [username, email, hashedPassword, role, firstName, lastName]);
    
    logger.info(`Nouvel utilisateur créé: ${username}`);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    logger.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nom d\'utilisateur et mot de passe requis' 
      });
    }
    
    // Récupérer l'utilisateur
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1 AND is_active = true',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Identifiants invalides' 
      });
    }
    
    const user = result.rows[0];
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Identifiants invalides' 
      });
    }
    
    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    // Mettre à jour la dernière connexion
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );
    
    logger.info(`Connexion réussie: ${username}`);
    
    res.json({ 
      success: true, 
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name
        }
      }
    });
  } catch (error) {
    logger.error('Erreur lors de la connexion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
