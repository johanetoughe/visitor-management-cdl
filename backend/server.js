const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Pour le hachage des mots de passe
const Visitor = require('./models/Visitor');
const User = require('./models/User'); // Assurez-vous que ce modèle est correctement défini
const db = require('./db');

const app = express();

// Middleware
app.use(cors({
   // Remplacez par l'URL de votre frontend
  credentials: true, // Autorise l'envoi de cookies
}));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'Virtu@se2020', // Changez ceci pour une clé plus sécurisée
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Passez à true si vous utilisez HTTPS
  })
);

// Route pour l'ajout de visiteurs
app.post('/api/visitors', async (req, res) => {
  try {
    const { name, tel, room, visitTime, visitDate } = req.body;

    // Validation de l'heure
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

// Route pour récupérer les visiteurs
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

// Route pour la connexion de l'admin
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Tentative de connexion avec l'utilisateur :", username);  // Log pour vérifier le username

    // Chercher l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log("Utilisateur non trouvé");  // Log si l'utilisateur n'est pas trouvé
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    console.log("Utilisateur trouvé, vérification du mot de passe...");

    // Comparer le mot de passe en texte clair
    if (password !== user.password) {
      console.log("Mot de passe incorrect");  // Log si le mot de passe est incorrect
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Si tout est ok, on crée une session
    req.session.userId = user.id;
    console.log("Connexion réussie pour l'utilisateur :", username);  // Log de la connexion réussie

    res.status(200).json({ message: "Connexion réussie." });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);  // Log de l'erreur
    res.status(500).json({ error: "Erreur lors de la connexion." });
  }
});
// Route pour vérifier si l'utilisateur est connecté
app.get('/auth', (req, res) => {
  if (req.session.userId) {
    return res.status(200).json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
});

// Route protégée pour l'admin
app.get('/admin', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Non autorisé." });
  }
  res.status(200).json({ message: "Bienvenue, admin." });
});

// Déconnexion
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
