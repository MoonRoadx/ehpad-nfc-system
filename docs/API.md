[API.md](https://github.com/user-attachments/files/24336986/API.md)
# Documentation API

## URL de base
```
http://localhost:3000/api
```

## Authentification

Toutes les routes (sauf `/auth/login` et `/auth/register`) nécessitent un token JWT dans le header :
```
Authorization: Bearer <token>
```

---

## Authentification

### POST /auth/register
Créer un nouveau compte utilisateur

**Corps de la requête :**
```json
{
  "username": "jdupont",
  "email": "j.dupont@ehpad.fr",
  "password": "motdepasse123",
  "role": "staff",
  "firstName": "Jean",
  "lastName": "Dupont"
}
```

**Réponse (201) :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "jdupont",
    "email": "j.dupont@ehpad.fr",
    "role": "staff",
    "first_name": "Jean",
    "last_name": "Dupont"
  }
}
```

### POST /auth/login
Se connecter

**Corps de la requête :**
```json
{
  "username": "jdupont",
  "password": "motdepasse123"
}
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "jdupont",
      "email": "j.dupont@ehpad.fr",
      "role": "staff"
    }
  }
}
```

---

## Résidents

### GET /residents
Liste tous les résidents

**Réponse (200) :**
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "id": 1,
      "first_name": "Marie",
      "last_name": "Martin",
      "date_of_birth": "1945-03-15",
      "room_number": "101",
      "badge_uid": "04A3B2C1",
      "badge_active": true
    }
  ]
}
```

### GET /residents/:id
Détails d'un résident

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "first_name": "Marie",
    "last_name": "Martin",
    "date_of_birth": "1945-03-15",
    "room_number": "101",
    "emergency_contact": "Pierre Martin",
    "emergency_phone": "0612345678",
    "allergies": "Pénicilline",
    "blood_type": "A+",
    "badge_uid": "04A3B2C1",
    "medications": [
      {
        "id": 1,
        "medication": "Paracétamol",
        "dosage": "1g",
        "frequency": "3x par jour"
      }
    ]
  }
}
```

### POST /residents
Créer un nouveau résident

**Corps de la requête :**
```json
{
  "firstName": "Marie",
  "lastName": "Martin",
  "dateOfBirth": "1945-03-15",
  "roomNumber": "101",
  "emergencyContact": "Pierre Martin",
  "emergencyPhone": "0612345678",
  "allergies": "Pénicilline",
  "bloodType": "A+"
}
```

### PUT /residents/:id
Mettre à jour un résident

**Corps de la requête :** Mêmes champs que POST

### DELETE /residents/:id
Désactiver un résident (soft delete)

**Réponse (200) :**
```json
{
  "success": true,
  "message": "Résident désactivé"
}
```

---

## NFC

### POST /nfc/scan
Scanner un badge NFC

**Corps de la requête :**
```json
{
  "badgeUid": "04A3B2C1",
  "location": "Chambre 101"
}
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "resident": {
      "id": 1,
      "firstName": "Marie",
      "lastName": "Martin",
      "roomNumber": "101",
      "allergies": "Pénicilline",
      "emergencyContact": "Pierre Martin",
      "emergencyPhone": "0612345678"
    }
  }
}
```

### POST /nfc/assign
Associer un badge à un résident

**Corps de la requête :**
```json
{
  "residentId": 1,
  "badgeUid": "04A3B2C1"
}
```

**Réponse (201) :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "resident_id": 1,
    "badge_uid": "04A3B2C1",
    "is_active": true
  }
}
```

### GET /nfc/history
Historique des scans

**Paramètres de requête :**
- `residentId` (optionnel) : Filtrer par résident
- `limit` : Nombre de résultats (défaut: 50)
- `offset` : Décalage pour la pagination

**Réponse (200) :**
```json
{
  "success": true,
  "count": 125,
  "data": [
    {
      "id": 1,
      "resident_id": 1,
      "first_name": "Marie",
      "last_name": "Martin",
      "badge_uid": "04A3B2C1",
      "scan_location": "Chambre 101",
      "scanned_by_username": "jdupont",
      "scanned_at": "2024-12-25T14:30:00Z"
    }
  ]
}
```

### POST /nfc/reader/start
Démarrer l'écoute du lecteur NFC

### POST /nfc/reader/stop
Arrêter l'écoute du lecteur NFC

---

## Dossiers médicaux

### GET /medical/resident/:residentId
Dossier médical d'un résident

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "medication": "Paracétamol",
      "dosage": "1g",
      "frequency": "3x par jour",
      "prescribed_by": "Dr. Durand",
      "notes": "À prendre avec de l'eau",
      "created_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

### POST /medical/medication
Ajouter un médicament

**Corps de la requête :**
```json
{
  "residentId": 1,
  "medication": "Paracétamol",
  "dosage": "1g",
  "frequency": "3x par jour",
  "prescribedBy": "Dr. Durand",
  "notes": "À prendre avec de l'eau"
}
```

### PUT /medical/medication/:id
Mettre à jour un médicament

### DELETE /medical/medication/:id
Supprimer un médicament

---

## Codes d'erreur

- **200** : Succès
- **201** : Créé avec succès
- **400** : Requête invalide
- **401** : Non authentifié
- **403** : Accès refusé
- **404** : Ressource non trouvée
- **500** : Erreur serveur

## Format des erreurs

```json
{
  "success": false,
  "error": "Message d'erreur descriptif"
}
```

---

## Exemples avec cURL

### Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Lister les résidents
```bash
curl http://localhost:3000/api/residents \
  -H "Authorization: Bearer <votre_token>"
```

### Scanner un badge
```bash
curl -X POST http://localhost:3000/api/nfc/scan \
  -H "Authorization: Bearer <votre_token>" \
  -H "Content-Type: application/json" \
  -d '{"badgeUid":"04A3B2C1","location":"Salle commune"}'
```
