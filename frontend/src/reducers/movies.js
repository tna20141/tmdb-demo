import _ from 'lodash';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'MOVIES_LOADED':
      return {
        ...state,
        movies: _.unionBy(
          state.movies,
          _.concat(action.payload.latest, action.payload.popular),
          'tmdbId',
        ),
      };
    case 'MOVIE_LOADED':
      return {
        ...state,
        movies: _.unionBy(
          state.movies,
          [action.payload.movie],
          'tmdbId',
        ),
      };
    default:
      return state;
  }
}

export default reducer;
