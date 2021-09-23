const config = require('config');
const axios = require('axios');
const fp = require('lodash/fp');

const apiKey = config.get('TMDB').API_KEY;
const baseUrl = config.get('TMDB').BASE_URL;

function request(method, url, options = {}) {
  return axios.request({
    url: `${baseUrl}${url}`,
    method,
    data: options.data,
    params: fp.merge(options.params, { api_key: apiKey }),
  })
    .then(fp.get('data'))
    .catch(error => {
      throw fp.get('response.data', error) || fp.get('code', error);
    });
}

module.exports = {
  request,
};
