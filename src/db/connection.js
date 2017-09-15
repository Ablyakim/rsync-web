const path = require('path');
const Sequelize = require('sequelize');
const pathToStorage = path.join(__dirname, '..', '..', 'db.sqlite');

const sequelize = new Sequelize('sqlite://' + pathToStorage, {
  dialect: 'sqlite',
  storage: pathToStorage
});

/**
 * @return {Promise}
 */
module.exports = () => sequelize.sync();