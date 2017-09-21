const Sequelize = require('sequelize');

const init = async connection => {
  const sequelize = await connection();
  
  const Site = sequelize.define('site', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    port: {
      type: Sequelize.INTEGER
    },
    destination: {
      type: Sequelize.STRING
    },
    source: {
      type: Sequelize.STRING
    },
    flags: {
      type: Sequelize.STRING
    },
    exclude: {
      type: Sequelize.TEXT,
      get() {
        return JSON.parse(this.getDataValue('exclude'));
      },
      set(value) {
        this.setDataValue('exclude', JSON.stringify(value));
      }
    },
    options: {
      type: Sequelize.TEXT,
      get() {
        return JSON.parse(this.getDataValue('options'));
      },
      set(value) {
        this.setDataValue('options', JSON.stringify(value));
      }
    },
  });
  
  return Site;
};

module.exports = init;