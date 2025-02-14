const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const Visitor = require('./models/Visitor');
const User = require('./models/User');
const db = require('./db');
const { Op } = require('sequelize');

const app = express();

// Middleware
app.use(cors({ credentials: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'Virtu@se2020',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// 📌 **Route pour récupérer les KPI avec les salles spécifiques**
app.get('/api/kpi', async (req, res) => {
  try {
    const totalVisits = await Visitor.count();
    const today = new Date().toISOString().split('T')[0];
    const visitsToday = await Visitor.count({ where: { visitDate: today } });

    // Liste des salles à suivre
    const rooms = [
      "Boxe 1", "Boxe 2", "Malabo", "Dakar", "Woleu",
      "Ntem", "Mpassa", "Lolo", "Ngounie", "Ogoué",
      "Ivindo", "Nianga", "Komo", "Abanga", "Mbei"
    ];

    // Obtenir le nombre de visites pour chaque salle
    const visitsByRoom = {};
    for (const room of rooms) {
      visitsByRoom[room] = await Visitor.count({ where: { room } });
    }

    res.status(200).json({
      totalVisits,
      visitsToday,
      visitsByRoom,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des KPI:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des KPI." });
  }
});

// 📌 **Route pour l'ajout de visiteurs**
app.post('/api/visitors', async (req, res) => {
  try {
    const { name, tel, room, visitTime, visitDate } = req.body;

    const validTimeRanges = [
      { start: '06:00', end: '08:00' },
      { start: '12:00', end: '14:00' },
      { start: '18:00', end: '20:00' },
    ];
    const isValidTime = validTimeRanges.some(
      (range) => visitTime >= range.start && visitTime <= range.end
    );

    if (!isValidTime) {
      return res.status(400).json({ message: "Heure de visite non valide." });
    }

    const visitor = await Visitor.create({ name, tel, room, visitTime, visitDate });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement." });
  }
});

// 📌 **Route pour récupérer les visiteurs**
app.get('/api/visitors', async (req, res) => {
  try {
    const visitors = await Visitor.findAll();
    res.status(200).json(visitors);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des visiteurs",
      details: err.message,
    });
  }
});

// 📌 **Route de connexion de l'admin**
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Chercher l'utilisateur
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    // Comparer directement le mot de passe
    if (password !== user.password) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Création de la session
    req.session.userId = user.id;
    res.status(200).json({ message: "Connexion réussie." });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ error: "Erreur lors de la connexion." });
  }
});

// 📌 **Route pour vérifier si l'utilisateur est connecté**
app.get('/auth', (req, res) => {
  if (req.session.userId) {
    return res.status(200).json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
});

// 📌 **Déconnexion**
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la déconnexion." });
    }
    res.status(200).json({ message: "Déconnexion réussie." });
  });
});

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));