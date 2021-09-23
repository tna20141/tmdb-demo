const { DataTypes } = require('sequelize');

const db = require('../db');

let Movie;

function _getModel() {
  if (Movie) {
    return Movie;
  }
  const connection = db.getConnection();
  if (!connection) {
    throw new Error('Connection not established yet!');
  }

  Movie = connection.define('movies', {
    tmdbId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posterPath: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.TEXT,
    },
    overview: {
      type: DataTypes.TEXT,
    },
    popularity: {
      type: DataTypes.INTEGER,
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['tmdbId'],
      },
    ],
  });

  return Movie;
}

function upsert(record) {
  return _getModel().upsert(record);
}

function getMovies(options = {}) {
  const params = { raw: true };
  if (options.sortBy) {
    params.order = [[options.sortBy.field, options.sortBy.direction || 'DESC']];
  }
  if (options.paging) {
    params.limit = options.paging.pageSize;
    params.offset = options.paging.pageSize * (options.paging.pageNum - 1);
  }
  return _getModel().findAll(params);
}

function get(movieId) {
  return _getModel().findByPk(movieId, { raw: true });
}

module.exports = {
  upsert,
  getMovies,
  get,
};
