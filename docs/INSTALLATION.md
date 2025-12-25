# Guide d'Installation Détaillé

## Prérequis

### Logiciels requis

- **Node.js** 18.x ou supérieur
- **PostgreSQL** 14.x ou supérieur
- **npm** ou **yarn**
- **Git**
- **Lecteur NFC** (recommandé : ACR122U)

### Connaissances recommandées

- Bases de Node.js et Express
- Bases de React
- Concepts SQL
- Fonctionnement des badges NFC

## Installation pas à pas

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-username/ehpad-nfc-system.git
cd ehpad-nfc-system
```

### 2. Configuration de la base de données

#### Installer PostgreSQL

**Ubuntu/Debian :**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS :**
```bash
brew install postgresql
brew services start postgresql
```

**Windows :**
Téléchargez l'installateur depuis [postgresql.org](https://www.postgresql.org/download/)

#### Créer la base de données

```bash
sudo -u postgres psql
```

Dans le shell PostgreSQL :
```sql
CREATE DATABASE ehpad_nfc;
CREATE USER ehpad_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE ehpad_nfc TO ehpad_user;
\q
```

### 3. Configuration du Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` :
```bash
cp .env.example .env
```

Éditer `.env` avec vos valeurs :
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://ehpad_user:votre_mot_de_passe_securise@localhost:5432/ehpad_nfc
JWT_SECRET=$(openssl rand -base64 32)
LOG_LEVEL=info
```

### 4. Exécuter les migrations

```bash
npm run migrate
```

Vous devriez voir :
```
✅ Migration réussie : toutes les tables ont été créées
```

### 5. (Optionnel) Peupler avec des données de test

```bash
npm run seed
```

### 6. Démarrer le serveur backend

```bash
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:3000`

### 7. Configuration du Frontend

Dans un nouveau terminal :

```bash
cd frontend
npm install
```

Créer le fichier `.env` :
```env
REACT_APP_API_URL=http://localhost:3000/api
```

### 8. Démarrer le frontend

```bash
npm start
```

L'application s'ouvrira automatiquement sur `http://localhost:3001`

## Configuration du lecteur NFC

### Installation des drivers (Windows)

1. Téléchargez les drivers ACR122U depuis le site officiel
2. Installez les drivers
3. Connectez le lecteur USB
4. Vérifiez dans le Gestionnaire de périphériques

### Installation des drivers (Linux)

```bash
sudo apt-get install pcscd pcsc-tools
sudo systemctl start pcscd
sudo systemctl enable pcscd
```

Vérifier le lecteur :
```bash
pcsc_scan
```

### Installation des drivers (macOS)

Les drivers sont généralement inclus. Vérifier avec :
```bash
system_profiler SPUSBDataType
```

## Vérification de l'installation

### Backend

```bash
curl http://localhost:3000/health
```

Réponse attendue :
```json
{"status":"ok","timestamp":"2024-..."}
```

### Frontend

Ouvrez `http://localhost:3001` dans votre navigateur

### Base de données

```bash
psql -U ehpad_user -d ehpad_nfc -c "\dt"
```

Vous devriez voir la liste des tables.

## Compte par défaut

Si vous avez exécuté le seed, utilisez :
- **Username:** admin
- **Password:** admin123

**⚠️ Changez ce mot de passe immédiatement en production !**

## Problèmes courants

### Port déjà utilisé

Si le port 3000 est déjà utilisé :
```bash
lsof -ti:3000 | xargs kill -9
```

### Erreur de connexion à PostgreSQL

Vérifiez que PostgreSQL est démarré :
```bash
sudo systemctl status postgresql
```

### Lecteur NFC non détecté

Vérifiez les permissions USB (Linux) :
```bash
sudo usermod -a -G plugdev $USER
```

## Prochaines étapes

1. Créez un compte utilisateur
2. Ajoutez des résidents
3. Associez des badges NFC
4. Testez le scan

## Support

Pour toute aide, consultez :
- [Documentation complète](/docs)
- [Issues GitHub](https://github.com/votre-username/ehpad-nfc-system/issues)
- Email : support@ehpad-nfc.fr
