const config = require('config');
const { Sequelize } = require('sequelize');

let connection;

function init() {
  const dbConf = config.get('DATABASE');
  const creds = `${dbConf.USER}:${dbConf.PASSWORD}`;
  connection = new Sequelize(`mysql://${creds}@${dbConf.HOST}:${dbConf.PORT}/${dbConf.DATABASE}`);
}

function getConnection() {
  return connection;
}

module.exports = {
  init,
  getConnection,
};
