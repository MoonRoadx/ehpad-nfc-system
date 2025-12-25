const { pool } = require('./db');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Table des utilisateurs
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'staff', 'nurse')),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Table des résidents
    await client.query(`
      CREATE TABLE IF NOT EXISTS residents (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        room_number VARCHAR(20),
        emergency_contact VARCHAR(100),
        emergency_phone VARCHAR(20),
        allergies TEXT,
        blood_type VARCHAR(5),
        photo_url VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Table des badges NFC
    await client.query(`
      CREATE TABLE IF NOT EXISTS nfc_badges (
        id SERIAL PRIMARY KEY,
        resident_id INTEGER REFERENCES residents(id) ON DELETE CASCADE,
        badge_uid VARCHAR(50) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        assigned_by INTEGER REFERENCES users(id),
        last_scanned TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Table des dossiers médicaux
    await client.query(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id SERIAL PRIMARY KEY,
        resident_id INTEGER REFERENCES residents(id) ON DELETE CASCADE,
        medication VARCHAR(200) NOT NULL,
        dosage VARCHAR(100),
        frequency VARCHAR(100),
        prescribed_by VARCHAR(100),
        notes TEXT,
        added_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Table de l'historique des scans
    await client.query(`
      CREATE TABLE IF NOT EXISTS scans_history (
        id SERIAL PRIMARY KEY,
        resident_id INTEGER REFERENCES residents(id) ON DELETE CASCADE,
        badge_uid VARCHAR(50) NOT NULL,
        scanned_by INTEGER REFERENCES users(id),
        scan_location VARCHAR(100),
        scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Table des alertes
    await client.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        resident_id INTEGER REFERENCES residents(id) ON DELETE CASCADE,
        alert_type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        is_resolved BOOLEAN DEFAULT false,
        resolved_by INTEGER REFERENCES users(id),
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Index pour améliorer les performances
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_residents_active ON residents(is_active);
      CREATE INDEX IF NOT EXISTS idx_nfc_badges_uid ON nfc_badges(badge_uid);
      CREATE INDEX IF NOT EXISTS idx_nfc_badges_resident ON nfc_badges(resident_id);
      CREATE INDEX IF NOT EXISTS idx_scans_resident ON scans_history(resident_id);
      CREATE INDEX IF NOT EXISTS idx_scans_date ON scans_history(scanned_at);
      CREATE INDEX IF NOT EXISTS idx_medical_resident ON medical_records(resident_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_resident ON alerts(resident_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(is_resolved);
    `);
    
    await client.query('COMMIT');
    console.log('✅ Migration réussie : toutes les tables ont été créées');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

createTables();
