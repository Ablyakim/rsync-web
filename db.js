const connect = require('./src/db-connection');
const Sequelize = require('sequelize');

const launch = async() => {
  try {
    const connection = await connect();
    connection.queryInterface.createTable('sites', {
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
        type: Sequelize.TEXT
      },
      options: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    });
    const Site = await require('./src/model/site')();
    
    Site.create({
      port: 8888,
      destination: 'test-destination',
      source: 'test-source',
      flags: 'azv',
      exclude: [
        '.idea/',
        '.git/',
        'cache/*'
      ],
      options: [
        {name: 'no-perms', value: ''},
        {name: 'delete', value: ''},
        {name: 'no-owner', value: ''},
        {name: 'no-group', value: ''}
      ]
    });
  } catch (e) {
    console.log(e);
  }
};

launch();
