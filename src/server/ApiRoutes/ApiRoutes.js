import express from 'express';
import axios from 'axios';
import parser from 'jsonapi-parserinator';

import _ from 'underscore';

import config from '../../../appConfig.js';
import {
  formatFilters,
  makeQuery,
  makeApiQuery,
} from '../../app/utils/utils.js';

const {
  api,
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
const appEnvironment = process.env.APP_ENV || 'production';
const inventoryRoot = inventoryService.root['development'];
const apiRoot = api.root[appEnvironment];

// Always the year before the current year.
const minPublishYear = currentYear - 1;

const getLanguageData = () => {
  const languageApiUrl =
    `${inventoryRoot}${inventoryService.languages}?minPublishYear=${minPublishYear}`;

  return fetchApiData(languageApiUrl);
};
const filterLanguages = (languagesArray, minCount) => {
  const languages = _.chain(languagesArray)
    .filter(language =>
      (language.count >= minCount &&
      language.name !== 'Multiple languages' &&
      language.name !== 'No linguistic content' &&
      language.name !== 'Undetermined' &&
      language.name !== '---')
    )
    .map(language =>
      ({
        id: language.name,
        label: language.name,
        count: language.count,
      })
    )
    .value();

  languages.splice(0, 0, { id: 'AnyLanguage', label: 'Any', count: 100 });

  return languages;
};

const newArrivalsApp = (req, res, next) => {
  const filters = _.omit(req.query, ['availability', 'pageNum', 'publishYear']);
  const {
    availability,
    pageNum,
    publishYear,
  } = req.query;

  const baseApiUrl = makeApiQuery(filters, availability, pageNum, publishYear, true);

  axios.all([fetchApiData(baseApiUrl), getLanguageData()])
    .then(axios.spread((newArrivalsData, languageData) => {
      const languages = filterLanguages(languageData.data, languageItemCount);

      res.locals.data = {
        NewArrivalsStore: {
          displayType: 'grid',
          publicationType: publishYear || 'recentlyReleased',
          newArrivalsData: newArrivalsData.data,
          pageNum: pageNum || '1',
          filters: {
            format: filters.format || 'AnyFormat',
            audience: filters.audience || 'AnyAudience',
            language: filters.language || 'AnyLanguage',
            genre: filters.genre || 'AnyGenre',
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
        NewArrivalsStore: {
          displayType: 'grid',
          publicationType: 'recentlyReleased',
          newArrivalsData: {},
          pageNum: '1',
          filters: {
            format: 'AnyFormat',
            audience: 'AnyAudience',
            language: 'AnyLanguage',
            genre: 'AnyGenre',
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
  .route('/books-music-dvds/new-arrivals')
  .get(newArrivalsApp);

router
  .route('/api')
  .get(selectPage);

router
  .route('/books-music-dvds/new-arrivals/api')
  .get(selectPage);


export default router;
