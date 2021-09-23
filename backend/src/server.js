const express = require('express');
const morgan = require('morgan');
const config = require('config');
const cors = require('cors');

const moviesRepo = require('./repositories/movies');

const app = express();

app.use(morgan('combined'));
app.use(cors());

app.get('/test', (req, res) => {
  res.send('Hello world');
});

app.get('/movies/latest', async (req, res) => {
  const movies = await moviesRepo.getMovies({
    sortBy: {
      field: 'releaseDate',
      order: 'DESC',
    },
    paging: {
      pageSize: 30,
      pageNum: 1,
    },
  });

  res.send(movies);
});

app.get('/movies/popular', async (req, res) => {
  const movies = await moviesRepo.getMovies({
    sortBy: {
      field: 'popularity',
      order: 'DESC',
    },
    paging: {
      pageSize: 30,
      pageNum: 1,
    },
  });

  res.send(movies);
});

app.get('/movie/:movieId', async (req, res) => {
  const movie = await moviesRepo.get(req.params.movieId);
  if (!movie) {
    return res.status(404).send('NOT_FOUND');
  }
  return res.send(movie);
});

app.listen(config.get('PORT'));
