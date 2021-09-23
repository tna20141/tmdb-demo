import _ from 'lodash';

import requester from '../utils/requester';

function loadMovies() {
  return async (dispatch) => {
    const latest = await requester.request('get', '/movies/latest');
    const popular = await requester.request('get', '/movies/popular');
    dispatch({
      type: 'MOVIES_LOADED',
      payload: {
        latest,
        popular,
      },
    });
    return {
      latest,
      popular,
    };
  }
}

/**
 * @returns {boolean} true if the movie doesn't exist, false otherwise
 */
function loadMovie(movieId) {
  return async (dispatch, getState) => {
    const state = getState();
    const movie = _.find(state.movies.movies, { id: parseInt(movieId) });
    if (movie) {
      return false;
    }
    try {
      const movie = await requester.request('get', `/movie/${movieId}`);
      dispatch({
        type: 'MOVIE_LOADED',
        payload: {
          movie,
        },
      });
      return false;
    } catch (error) {
      if (_.get(error, 'statusCode') === 404) {
        return true;
      }
      throw error;
    }
  };
}

const exports = {
  loadMovies,
  loadMovie,
}

export default exports;
