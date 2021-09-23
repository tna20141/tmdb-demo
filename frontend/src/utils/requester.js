import _ from 'lodash';
import axios from 'axios';

import config from '../config';

function request(method, path, options = {}) {
  return axios({
    method,
    url: `${config.apiUrl}${path}`,
    data: options.data || {},
  })
    .then(result => {
      return result.data;
    })
    .catch(error => {
      const errorFormatted = {
        statusCode: _.get(error, 'response.status'),
        data: _.get(error, 'response.data', error),
      };
      throw errorFormatted;
    });
}

const exports = {
  request,
};

export default exports;
