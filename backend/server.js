const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Visitor = require('./models/Visitor');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/visitors', async (req, res) => {
  try {
    const { name, tel, room, visitTime, visitDate } = req.body;

    // Validation de l'heure
    const validTimeRanges = [
      { start: '06:00', end: '08:00' },
      { start: '12:00', end: '14:00' },
      { start: '18:00', end: '20:00' },
    ];
    const isValidTime = validTimeRanges.some(range => 
      visitTime >= range.start && visitTime <= range.end
    );

    if (!isValidTime) {
      return res.status(400).json({ message: 'Heure de visite non valide.' });
    }

    const visitor = await Visitor.create({ name, tel, room, visitTime, visitDate });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement.' });
  }
});
app.get('/api/visitors', async (req, res) => {
    try {
      const visitors = await Visitor.findAll();
      res.status(200).json(visitors);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des visiteurs', details: err.message });
    }
  });

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));