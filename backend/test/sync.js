const sinon = require('sinon');
const { expect } = require('chai');

const tmdbConnector = require('../src/utils/tmdb-connector');
const moviesService = require('../src/services/movies');
const helpers = require('../src/utils/helpers');

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function _fakeTmdbRequest(method, url, options) {
  switch (options.params.page) {
    case 1:
      return {
        page: 1,
        total_pages: 3,
        results: [
          {
            id: '1',
            poster_path: 'path1',
            title: 'title1',
            overview: 'overview1',
            release_date: 'date1',
            popularity: 100,
          },
          {
            id: '2',
            poster_path: 'path2',
            title: 'title2',
            overview: 'overview2',
            release_date: 'date2',
            popularity: 200,
          },
        ]
      };
    case 2:
      return {
        page: 2,
        total_pages: 3,
        results: [],
      };
    case 3:
      return {
        page: 3,
        total_pages: 3,
        results: [
          {
            id: '3',
            poster_path: 'path3',
            title: 'title3',
            overview: 'overview3',
            release_date: 'date3',
            popularity: 300,
          },
          {
            id: '4',
            poster_path: 'path4',
            title: 'title4',
            overview: 'overview4',
            release_date: 'date4',
            popularity: 400,
          },
          {
            id: '5',
            poster_path: 'path5',
            title: 'title5',
            overview: 'overview5',
            release_date: 'date5',
            popularity: 500,
          },
        ]
      };
    default:
      return null;
  }
}

describe('syncLatest()', function() {
  it('should sync all pages', async function() {
    const fakeTmdbRequest = sinon.replace(tmdbConnector, 'request', sinon.fake(_fakeTmdbRequest));
    const fakeEachLimit = sinon.replace(helpers, 'eachLimit', sinon.fake());
    await moviesService.syncLatest();

    expect(fakeTmdbRequest.callCount).to.equal(3);
    expect(fakeEachLimit.callCount).to.equal(1);
    expect(fakeEachLimit.firstArg).to.eql([
      {
        tmdbId: '1',
        posterPath: 'path1',
        title: 'title1',
        overview: 'overview1',
        releaseDate: 'date1',
        popularity: 100
      },
      {
        tmdbId: '2',
        posterPath: 'path2',
        title: 'title2',
        overview: 'overview2',
        releaseDate: 'date2',
        popularity: 200
      },
      {
        tmdbId: '3',
        posterPath: 'path3',
        title: 'title3',
        overview: 'overview3',
        releaseDate: 'date3',
        popularity: 300
      },
      {
        tmdbId: '4',
        posterPath: 'path4',
        title: 'title4',
        overview: 'overview4',
        releaseDate: 'date4',
        popularity: 400
      },
      {
        tmdbId: '5',
        posterPath: 'path5',
        title: 'title5',
        overview: 'overview5',
        releaseDate: 'date5',
        popularity: 500
      }
    ]);
  });
});
