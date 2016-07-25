import express from 'express';
import axios from 'axios';
import parser from 'jsonapi-parserinator';

import { navConfig } from 'dgx-header-component';
import Model from 'dgx-model-data';
import _ from 'underscore';

import config from '../../../appConfig.js';
import {
  formatFilters,
  makeQuery,
  makeApiQuery,
} from '../../app/utils/utils.js';

// Syntax that both ES6 and Babel 6 support
const { HeaderItemModel } = Model;
const {
  api,
  headerApi,
  inventoryService,
  languageDays,
  languageItemCount,
  itemCount,
  currentYear,
} = config;

const createOptions = (apiValue) => ({
  endpoint: `${apiRoot}${apiValue.endpoint}`,
  includes: apiValue.includes,
  filters: apiValue.filters,
});
const fetchApiData = (url) => axios.get(url);

const router = express.Router();
// const appEnvironment = process.env.APP_ENV || 'development';
const appEnvironment = 'development';
const apiRoot = api.root[appEnvironment];
const inventoryRoot = inventoryService.root[appEnvironment];

const headerOptions = createOptions(headerApi);
// Always the year before the current year.
const minPublishYear = currentYear - 1;

const getHeaderData = () => {
  const headerApiUrl = parser.getCompleteApi(headerOptions);
  return fetchApiData(headerApiUrl);
};
const getLanguageData = () => {
  const languageApiUrl =
    `${inventoryRoot}${inventoryService.languages}?&days=` +
    `${languageDays}&minPublishYear=${minPublishYear}`;

  return fetchApiData(languageApiUrl);
};
const filterLanguages = (languagesArray, minCount) => {
  return _.chain(languagesArray)
    .filter(language =>
      (language.count >= minCount &&
      language.name !== 'Multiple languages' &&
      language.name !== 'No linguistic content' &&
      language.name !== 'Undetermined' &&
      language.name !== '---')
    )
    .map(language =>
      ({
        name: language.name,
        count: language.count,
      })
    )
    .value();
};

const newArrivalsApp = (req, res, next) => {
  const filters = _.omit(req.query, ['availability', 'pageNum', 'publishYear']);
  const {
    availability,
    pageNum,
    publishYear,
  } = req.query;

  const baseApiUrl = makeApiQuery(filters, availability, pageNum, publishYear, true);

  console.log('first call', baseApiUrl);

  axios.all([getHeaderData(), fetchApiData(baseApiUrl), getLanguageData()])
    .then(axios.spread((headerData, newArrivalsData, languageData) => {
      const headerParsed = parser.parse(headerData.data, headerOptions);
      const headerModelData = HeaderItemModel.build(headerParsed);
      const languages = filterLanguages(languageData.data, languageItemCount);

      res.locals.data = {
        HeaderStore: {
          headerData: navConfig.current,
        },
        NewArrivalsStore: {
          displayType: 'grid',
          publicationType: publishYear || 'recentlyReleased',
          newArrivalsData: newArrivalsData.data,
          pageNum: pageNum || '1',
          filters: {
            format: filters.format || '',
            audience: filters.audience || '',
            language: filters.language || '',
            genre: filters.genre || '',
          },
          availabilityType: availability || 'New Arrival',
          displayPagination: newArrivalsData.data.bibItems.length === 0 ? false : true,
          languages,
        },
      };

      next();
    }))
    .catch(error => {
      console.log(`error calling API : ${error}`);
      console.log(`Attempted to call : ${baseApiUrl}`);

      res.locals.data = {
        HeaderStore: {
          headerData: navConfig.current,
        },
        NewArrivalsStore: {
          displayType: 'grid',
          publicationType: 'recentlyReleased',
          newArrivalsData: {},
          pageNum: '1',
          filters: {
            format: '',
            audience: '',
            language: '',
            genre: '',
          },
          availabilityType: 'New Arrival',
          displayPagination: false,
          languages: [],
        },
      };

      next();
    }); /* end Axios call */
};

function selectPage(req, res) {
  const query = req.query;

  const filters = {
    format: query.format || '',
    audience: query.audience || '',
    language: query.language || '',
    genre: query.genre || '',
  };

  const availability = query.availability || 'New%20Arrival';
  const pageNum = query.pageNum || '1';
  const publishYear = query.publishYear || 'recentlyReleased';

  const apiUrl = makeApiQuery(filters, availability, pageNum, publishYear);

  console.log('ajax call', apiUrl);

  axios
    .get(apiUrl)
    .then(response => res.json(response.data))
    .catch(error => {
      console.log(`error calling API : ${error}`);
      console.log(`Attempted to call : ${apiUrl}`);

      res.json({
        error,
      });
    }); /* end axios call */
}

router
  .route('/')
  .get(newArrivalsApp);

router
  .route('/browse/new-arrivals')
  .get(newArrivalsApp);

router
  .route('/api')
  .get(selectPage);

router
  .route('/browse/new-arrivals/api')
  .get(selectPage);


export default router;
