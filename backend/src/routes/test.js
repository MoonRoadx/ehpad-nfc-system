const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as time, version() as version');
    res.json({ 
      success: true, 
      connected: true,
      data: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      connected: false,
      error: error.message,
      code: error.code
    });
  }
});

module.exports = router;
