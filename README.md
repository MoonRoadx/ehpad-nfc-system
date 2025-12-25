[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://postgresql.org)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org)
[![GitHub release](https://img.shields.io/github/v/release/MoonRoadx/ehpad-nfc-system?color=blue)](https://github.com/MoonRoadx/ehpad-nfc-system/releases)
[![Stars](https://img.shields.io/github/stars/MoonRoadx/ehpad-nfc-system?style=social)](https://github.com/MoonRoadx/ehpad-nfc-system/stargazers)

# Système NFC pour EHPAD

## 📋 Description

Application web complète de gestion NFC pour les établissements d'hébergement pour personnes âgées dépendantes (EHPAD). Ce système permet de suivre et gérer les informations des résidents via des badges NFC.

## ✨ Fonctionnalités

- **Gestion des résidents** : Ajout, modification et consultation des profils
- **Lecture NFC** : Identification rapide via badge NFC
- **Suivi médical** : Enregistrement des médicaments, allergies et antécédents
- **Traçabilité** : Historique des interactions et scans
- **Alertes** : Notifications pour événements importants
- **Rapports** : Génération de statistiques et rapports

## 🏗️ Architecture
```
ehpad-nfc-system/
├── backend/          # API Node.js/Express
├── frontend/         # Interface web React
├── database/         # Scripts et schémas de base de données
└── docs/            # Documentation
```

## 🚀 Installation

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- Lecteur NFC compatible (ex: ACR122U)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm run migrate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📖 Documentation

- [Guide d'installation complet](docs/INSTALLATION.md)
- [Documentation API](docs/API.md)
- [Guide de contribution](CONTRIBUTING.md)

## 🔒 Sécurité

- Authentification JWT
- Chiffrement des données sensibles
- Accès basé sur les rôles (RBAC)
- Logs d'audit complets
- Conformité RGPD

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez consulter [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 Licence

MIT License - voir [LICENSE](LICENSE)

## 👥 Support

Pour toute question, ouvrez une [issue](../../issues)

---

**Développé avec ❤️ pour améliorer la prise en charge en EHPAD**
