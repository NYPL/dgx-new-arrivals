import axios from 'axios';
import {
  map as _map,
  mapObject as _mapObject,
} from 'underscore';

import config from '../../../appConfig.js';

const {
  appFilters,
  itemCount,
  pageNum,
} = config;

const formatFilters = () => {
  const formats = _map(appFilters.formatData.data, format => format.id);
  return formats.join(',');
};

const titleShortener = (title, itemTitleLength = 96) => {
  if (!title) {
    return '';
  }

  let updatedTitle = title.split(':')[0].split('/')[0];

  if (updatedTitle.length > itemTitleLength) {
    updatedTitle = updatedTitle.substring(0, itemTitleLength);
  }

  return updatedTitle;
};

const makeQuery = (
  filters = {},
  availability = '',
  page = pageNum,
  updateItems = false,
  publishType = 'recentlyReleased'
) => {
  let queries = '';
  let itemsQuery = itemCount;
  let pageQuery = page;

  if (updateItems) {
    itemsQuery = itemCount * (page - 1);
    pageQuery = 1;
  }

  _mapObject(filters, (val, key) => {
    if (val !== '') {
      queries += (val === 'Research') ? `&audience=${val}` : `&${key}=${val}`;
    } else if (key === 'format') {
      queries += `&format=${formatFilters()}`;
    }
  });

  if (availability) {
    queries += `&availability=${availability}`;
  }

  queries += `&itemCount=${itemsQuery}&pageNum=${pageQuery}&publishYear=${publishType}`;

  return queries;
};

const makeApiCall = (queries, callbackFn) => {
  axios
    .get(`/api?${queries}`)
    .then(callbackFn)
    .catch(error => {
      console.log(`error making ajax call: ${error}`);
    }); /* end Axios call */
};

const createDate = (date) => {
  if (!date) {
    return null;
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  const d = new Date(date);

  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export {
  formatFilters,
  titleShortener,
  makeQuery,
  makeApiCall,
  createDate,
};
