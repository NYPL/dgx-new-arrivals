import axios from 'axios';
import {
  map as _map,
  mapObject as _mapObject,
} from 'underscore';

import config from '../../../appConfig.js';
import { createHistory, useQueries, createMemoryHistory } from 'history';

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

const createAppHistory = () => {
  if (typeof(window) !== 'undefined') {
    return useQueries(createHistory)();
  }

  return useQueries(createMemoryHistory)();
};

const manageHistory = (opts = {}, history, reset = false) => {
  const {
    filters,
    availabilityType,
    publicationType,
    pageNum,
  } = opts;
  let query = '?';

  if (!reset) {
    _mapObject(filters, (val, key) => {
      if (val) {
        query += `&${key}=${val}`;
      }
    });

    if (availabilityType === 'On Order' && query.indexOf('availability') !== -1) {
      query += '&availability=On%20Order';
    }

    if (publicationType === 'justAdded') {
      query += '&publishYear=justAdded';
    }

    if (pageNum !== 2) {
      query += `&pageNum=${pageNum - 1}`;
    }
  }

  if (availabilityType === 'On Order') {
    query += '&availability=On%20Order';
  }

  query = (query === '?') ? '' : query;

  history.push({
    // pathname: '/the/path',
    search: query,
    // state: { the: 'state' }
  });
};

export {
  formatFilters,
  titleShortener,
  makeQuery,
  makeApiCall,
  createDate,
  createAppHistory,
  manageHistory,
};
