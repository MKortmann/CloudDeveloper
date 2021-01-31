'use strict';
// migration works in order of time, the reason that the
// file name starts with date
/*
  UP MIGRATION: going to the next state
  DOWN MIGRATION: going down to the prior state
  Below we have a createTable migration which will create a
  table with FeedItem, and we will have a few columns that
  we're adding.
  We will add a few parameters to specify what kind of column that is within Postgres,

*/
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FeedItem', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      caption: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FeedItem');
  }
};