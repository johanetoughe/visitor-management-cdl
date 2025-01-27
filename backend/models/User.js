const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Assurez-vous que le chemin est correct pour votre fichier db.js

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users', // Nom de la table dans la base de données
  timestamps: false, // Désactiver les champs createdAt et updatedAt
});

module.exports = User;
