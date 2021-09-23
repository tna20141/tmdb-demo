// eslint-disable-next-line
const server = require('./server');
const db = require('./db');
const moviesService = require('./services/movies');

const start = async () => {
  db.init();

  // TODO: in a proper environment, this should be triggered by an external service.
  // Here setInterval is used to invoke syncing, for simplicity.
  setInterval(moviesService.sync, 1000 * 86400);
};

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log('UNHANDLED REJECTION', err);
});

start();
