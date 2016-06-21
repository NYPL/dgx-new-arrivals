import axios from 'axios';
import { ga } from 'dgx-react-ga';
import {
  map as _map,
  mapObject as _mapObject,
  findWhere as _findWhere,
} from 'underscore';
import {
  createHistory,
  useQueries,
  createMemoryHistory,
} from 'history';

import config from '../../../appConfig.js';

const {
  appFilters,
  itemCount,
  pageNum,
  newArrivalsApi,
  currentYear,
  titleRemovedText,
} = config;
const minPublishYear = currentYear - 1;

const formatFilters = () => {
  const formats = _map(appFilters.formatData.data, format => format.id);
  return formats.join(',');
};

const titleAuthorShortener = (title, author, itemTitleLength = 65) => {
  if (!title) {
    return '';
  }

  let updatedTitle = title.split(':')[0].split('/')[0];
  let updatedAuthor = author || '';

  updatedTitle = updatedTitle.replace(titleRemovedText, '');

  if (updatedTitle.length > itemTitleLength) {
    updatedTitle = `${updatedTitle.substring(0, itemTitleLength)}...`;
  }

  if (updatedAuthor.length > 26) {
    updatedAuthor = `${author.substring(0, 26)}...`;
  }

  return {
    title: updatedTitle,
    author: updatedAuthor,
  };
};

const makeFrontEndQuery = (
  filters = {},
  availability = '',
  page = pageNum,
  publishType = 'recentlyReleased',
  updateItems = false
) => {
  let query = '';
  let itemsQuery = itemCount;
  let pageQuery = page;

  if (updateItems) {
    itemsQuery = itemCount * page;
    pageQuery = 1;
  }

  _mapObject(filters, (val, key) => {
    if (val !== '') {
      query += `&${key}=${val}`;
    } else if (key === 'format') {
      query += `&format=${formatFilters()}`;
    }
  });

  if (availability) {
    query += `&availability=${availability}`;
  }

  query += `&itemCount=${itemsQuery}&pageNum=${pageQuery}&publishYear=${publishType}`;

  return query;
};

const makeApiQuery = (
  filters = {},
  availability = 'New%20Arrival',
  pageNumber,
  publishYear = 'recentlyReleased',
  updateItems = false
) => {
  let baseApiUrl = `${newArrivalsApi.bibItems}?`;
  let itemsQuery = itemCount;
  let pageQuery = parseInt(pageNumber, 10) || 1;

  if (updateItems) {
    itemsQuery = itemCount * pageQuery;
    pageQuery = 1;
  }

  _mapObject(filters, (val, key) => {
    if (val !== '') {
      baseApiUrl += `&${key}=${val}`;
    } else if (key === 'format') {
      baseApiUrl += `&format=${formatFilters()}`;
    }
  });

  if (baseApiUrl.indexOf('format') === -1) {
    baseApiUrl += `&format=${formatFilters()}`;
  }
  baseApiUrl += `&availability=${availability}&itemCount=${itemsQuery}&pageNum=${pageQuery}`;

  if (publishYear === 'recentlyReleased') {
    baseApiUrl += `&minPublishYear=${minPublishYear}`;
  }

  return baseApiUrl;
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

    if (publicationType === 'anyYear') {
      query += '&publishYear=anyYear';
    }
    if (parseInt(pageNum, 10) !== 1) {
      query += `&pageNum=${pageNum}`;
    }
  }

  if (availabilityType === 'On Order') {
    query += '&availability=On%20Order';
  }

  query = (query === '?') ? '' : query;

  history.push({
    search: query,
    state: { newArrivals: true }
  });
};

const createEncoreLink = (bibNumber = '') => {
  if (!bibNumber) {
    return '';
  }

  return `//browse.nypl.org/iii/encore/record/C__Rb${bibNumber}?lang=eng&source=NewArrivals`;
};

const getFilterLabel = (filterType = '', id = '') => {
  if (!filterType) {
    return '';
  }

  const filterArray = appFilters[`${filterType}Data`].data;
  const filter = _findWhere(filterArray, { id: id });

  return filter ? filter.label : '';
};

const trackNewArrivals = ga._trackEvent('New Arrivals');

export {
  formatFilters,
  titleAuthorShortener,
  makeFrontEndQuery,
  makeApiQuery,
  makeApiCall,
  createDate,
  createAppHistory,
  manageHistory,
  createEncoreLink,
  getFilterLabel,
  trackNewArrivals,
};
