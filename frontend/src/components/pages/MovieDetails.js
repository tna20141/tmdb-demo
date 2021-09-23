import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';

import moviesAction from '../../actions/movies';
import config from '../../config';
import '../../css/MovieDetails.scss';

const mapStateToProps = (state) => ({
  movies: state.movies.movies,
});

const mapDispatchToProps = (dispatch) => ({
  loadMovie: movieId => dispatch(moviesAction.loadMovie(movieId)),
});

class MovieDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notFound: false,
      movieId: this.props.match.params.movieid,
    };
  }

  componentDidMount() {
    this.props.loadMovie(this.state.movieId)
      .then(notFound => {
        if (notFound) {
          this.setState({ notFound: true });
        }
      });
  }

  renderNotFound = () => {
    return <p>Not found</p>;
  }

  render() {
    if (this.state.notFound) {
      return this.renderNotFound();
    }
    const { movies } = this.props;
    const movie = _.find(movies, { id: parseInt(this.state.movieId) });
    if (!movie) {
      return <p>loading</p>;
    }

    const posterPath = movie.posterPath
      ? `${config.tmdbBaseImageUrl}${movie.posterPath}`
      : config.emptyPosterPath;

    console.log(movie);
    return (
      <div style={{ marginTop: '50px' }}>
        <section className='details-section'>
          <div className='poster'>
            <img src={posterPath} alt='' />
          </div>
          <div className='content-wrapper'>
            <section>
              <div className='title'>
                <h2 className='title-text'>{movie.title}</h2>
              </div>
              <div className='facts'>
                <span className='date'>{moment(movie.releaseDate).format('MM/DD/YYYY')}</span>
              </div>
              <div className='overview'>
                <h3 className='overview-label'>Overview</h3>
                <div className='overview-text'>
                  <p>{movie.overview || '(None)'}</p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MovieDetails));
