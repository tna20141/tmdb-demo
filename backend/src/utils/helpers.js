const Bottleneck = require('bottleneck');

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function withRetries(func, times, options = {}) {
  let triesLeft = times;
  let delay = options.delay;
  while (triesLeft > 0) {
    try {
      // eslint-disable-next-line
      const result = await func();
      return result;
    } catch (error) {
      triesLeft -= 1;
      if (triesLeft <= 0) {
        throw error;
      }
      if (delay) {
        // eslint-disable-next-line
        await sleep(delay);
      }
      if (options.delayScheme === 'exponential') {
        delay *= 2;
      }
    }
  }
  return null;
}

function eachLimit(items, limit, func) {
  const limiter = new Bottleneck({
    maxConcurrent: limit,
  });

  return Promise.all(items.map(item => limiter.schedule(func, item)));
}

function log(level, message, meta) {
  // eslint-disable-next-line
  console.log(level, message, meta);
}

module.exports = {
  sleep,
  withRetries,
  eachLimit,
  log,
};
