const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  visitTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  visitDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

sequelize.sync()
  .then(() => console.log('Modèle synchronisé avec la base de données.'))
  .catch(err => console.error('Erreur lors de la synchronisation :', err));

module.exports = Visitor;
