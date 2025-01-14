const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('visitordb', 'root', 'Virtu@se2020', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
  });

sequelize.authenticate()
  .then(() => console.log('Connexion à la base de données réussie.'))
  .catch(err => console.error('Impossible de se connecter :', err));

module.exports = sequelize;
