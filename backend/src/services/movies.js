const moment = require('moment');
const config = require('config');
const fp = require('lodash/fp');

const helpers = require('../utils/helpers');
const moviesRepo = require('../repositories/movies');
const tmdbConnector = require('../utils/tmdb-connector');

const tmdbDateFormat = config.get('TMDB').DATE_FORMAT;

function _mapMovieFromTmdb(movieRaw) {
  return {
    tmdbId: movieRaw.id,
    posterPath: movieRaw.poster_path,
    title: movieRaw.title,
    overview: movieRaw.overview,
    releaseDate: movieRaw.release_date,
    popularity: movieRaw.popularity,
  };
}

/* eslint-disable camelcase */
async function _syncPages(startPage, endPage, method, url, options = {}) {
  const { page, results, total_pages } = await tmdbConnector.request(method, url, {
    ...options,
    params: fp.merge(options.params, { page: startPage }),
  });

  const _endPage = endPage || total_pages;
  if (page + 1 > _endPage) {
    return results;
  }

  return [
    ...results,
    ...(await _syncPages(page + 1, endPage, method, url, options)),
  ];
}
/* eslint-enable camelcase */

async function _syncLatest() {
  const today = moment().format(tmdbDateFormat);
  const moviesRaw = await _syncPages(
    1,
    null,
    'get',
    '/discover/movie',
    {
      params: {
        'primary_release_date.gte': today,
        'primary_release_date.lte': today,
      },
    },
  );

  // TODO: consider bulk operations.
  return helpers.eachLimit(fp.map(_mapMovieFromTmdb, moviesRaw), 5, moviesRepo.upsert);
}

function syncLatest() {
  return helpers.withRetries(() => _syncLatest(), 3, {
    delay: 1000,
    delayScheme: 'exponential',
  });
}

async function _syncPopularity() {
  // The first few pages should contain enough data for our use case.
  const moviesRaw = await _syncPages(
    1,
    5,
    'get',
    '/discover/movie',
    {
      params: {
        sort_by: 'popularity.desc',
      },
    },
  );

  return helpers.eachLimit(fp.map(_mapMovieFromTmdb, moviesRaw), 5, moviesRepo.upsert);
}

function syncPopularity() {
  return helpers.withRetries(() => _syncPopularity(), 3, {
    delay: 1000,
    delayScheme: 'exponential',
  });
}

// TODO: make sync frequency configurable.
async function sync() {
  // Ignore errors so as to not interrupt the flow.
  await syncLatest().catch(error => {
    helpers.log('error', 'syncLatest()', error);
  });
  await syncPopularity().catch(error => {
    helpers.log('error', 'syncPopularity()', error);
  });
}

module.exports = {
  syncLatest,
  syncPopularity,
  sync,
};
