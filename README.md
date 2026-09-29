# RoBomed RHMS — Système de Gestion Humanitaire Intégré

[![Django](https://img.shields.io/badge/Django-6.0-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> **RoBomed Humanitarian Management System (RHMS)** est une plateforme logicielle moderne et complète dédiée au pilotage, à la transparence et à l'automatisation des actions humanitaires de l'ONG **RoBomed**.

---

## 📌 Fonctionnalités Principales

- **🌍 Projets & Missions Humanitaires** : Suivi des forages solaires, rentrées scolaires, santé pédiatrique, distributions alimentaires et soins palliatifs.
- **💳 Collecte de Dons & Reçus Fiscaux** : Enregistrement des dons, génération instantanée de reçus fiscaux PDF avec QR code.
- **📦 Gestion des Stocks & Distributions** : Suivi rigoureux des vivres, kits scolaires et équipements médicaux, traçabilité des distributions par bénéficiaire.
- **🤝 Gestion des Bénévoles** : Candidatures en ligne, approbation administrative, affectation aux missions sur le terrain.
- **📸 Galerie Médias & Actualités** : Partage transparent des réalisations, photos et vidéos vérifiées.
- **📊 Reporting & Tableaux de Bord** : Rapports statistiques consolidés, exports PDF d'activité et tableurs Excel.
- **🔐 Sécurité & Permissions Granulaires** : Gestion des rôles (Administrateur, Coordinateur, Donateur, Bénévole), traçabilité des actions et journal d'incidents (Logs).

---

## 🛠️ Architecture & Technologies

### Backend
- **Framework** : Django 6.0 & Django REST Framework (DRF)
- **Authentification** : Token JWT / Sessions sécurisées
- **Base de données** : SQLite (développement) / PostgreSQL (production)
- **Génération de documents** : ReportLab (PDF), OpenPyXL (Excel)

### Frontend
- **Framework** : React 19, TypeScript, Vite
- **Design & Styles** : Tailwind CSS, Framer Motion, Lucide Icons
- **Routage & Données** : React Router DOM 7, Axios (Intercepteurs JWT)

---

## 🚀 Démarrage Rapide (Développement Local)

### 1. Prérequis
- Python 3.12+
- Node.js 20+ et npm

### 2. Lancement du Backend
```bash
cd rhms
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 3. Lancement du Frontend
```bash
cd rhms/frontend
npm install
npm run dev
```

L'application est accessible sur :
- **Frontend** : [http://localhost:5173](http://localhost:5173)
- **API REST & Swagger** : [http://localhost:8000/api/](http://localhost:8000/api/)
- **Administration Django** : [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## 📚 Documentation & Spécifications

- 📖 [Guide Utilisateur](file:///home/userxn/Bureau/Robomed/docs/GUIDE_UTILISATEUR.md) : Mode d'emploi pas à pas pour chaque rôle.
- ⚙️ [Documentation Technique](file:///home/userxn/Bureau/Robomed/docs/DOCUMENTATION_TECHNIQUE.md) : Modèle de données, endpoints API et sécurité.
- 📐 [Spécifications & Maquettes](file:///home/userxn/Bureau/Robomed/docs/specifications/) : Cahier des charges, diagrammes UML et maquettes d'écrans.

---

## 👥 Auteur & Organisation
- **Organisation** : Association Humanitaire RoBomed
- **Auteur** : nouserrx (<nouradinezakariamahamat1@gmail.com>)
