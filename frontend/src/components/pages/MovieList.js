import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment';
import { Link } from 'react-router-dom';

import config from '../../config';
import movieActions from '../../actions/movies';
import '../../css/MovieList.scss';

const mapStateToProps = (state) => ({
  movies: state.movies.movies,
});

const mapDispatchToProps = (dispatch) => ({
  loadMovies: () => dispatch(movieActions.loadMovies()),
});

class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 'latest',
    };
  }

  componentDidMount() {
    this.props.loadMovies();
  }

  render() {
    const { movies } = this.props;
    if (!movies) {
      return <p>loading</p>;
    }

    const latest = _(movies)
      .orderBy(['releaseDate'], ['desc'])
      .slice(0, 30)
      .value();
    const popular = _(movies)
      .orderBy(['popularity'], ['desc'])
      .slice(0, 30)
      .value();

    return (
      <div style={{ marginTop: '50px' }}>
        <Tabs>
          <TabList>
            <Tab>Latest</Tab>
            <Tab>Popular</Tab>
          </TabList>

          <TabPanel>
            {this.renderMovieList(latest)}
          </TabPanel>
          <TabPanel>
            {this.renderMovieList(popular)}
          </TabPanel>
        </Tabs>
      </div>
    );
  }

  renderMovie = movie => {
    const posterPath = movie.posterPath
      ? `${config.tmdbBaseImageUrl}${movie.posterPath}`
      : config.emptyPosterPath;

    return (
      <div style={{ marginRight: '35px', marginBottom: '30px' }} className='movie-card' key={movie.id}>
        <div className='movie-poster'>
          <Link className='poster-image' to={`/movie/${movie.id}`} title={movie.title}>
            <img src={posterPath} alt='' />
          </Link>
        </div>
        <div className='movie-content'>
          <Link className='title' to={`/movie/${movie.id}`} title={movie.title}>
            <h2 className='title-text'>{movie.title}</h2>
          </Link>
          <span className='date'>{moment(movie.releaseDate).format('MMM DD, YYYY')}</span>
        </div>
      </div>
    )
  }

  renderMovieList(movies) {
    return (
      <div className='movie-list'>
        {_.map(movies, this.renderMovie)}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieList);
