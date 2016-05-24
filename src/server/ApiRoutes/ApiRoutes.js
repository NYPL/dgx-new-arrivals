import express from 'express';
import axios from 'axios';
import parser from 'jsonapi-parserinator';

import Model from 'dgx-model-data';
import _ from 'underscore';

import config from '../../../appConfig.js';
import { formatFilters } from '../../app/utils/utils.js';

// Syntax that both ES6 and Babel 6 support
const { HeaderItemModel } = Model;
const {
  api,
  headerApi,
  newArrivalsApi,
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
const apiRoot = api.root[appEnvironment];
const headerOptions = createOptions(headerApi);
// Always the year before the current year.
const minPublishYear = currentYear - 1; 

const getHeaderData = () => {
  const headerApiUrl = parser.getCompleteApi(headerOptions);
  return fetchApiData(headerApiUrl);
};
const getLanguageData = () => {
  const languageApiUrl =
    `${newArrivalsApi.languages}?&days=${languageDays}&minPublishYear=${minPublishYear}`;

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
  const formats = formatFilters();
  const baseApiUrl = `${newArrivalsApi.bibItems}?` +
    `format=${formats}` +
    `&availability=New%20Arrival` +
    `&itemCount=${itemCount}` +
    `&minPublishYear=${minPublishYear}`;
console.log(baseApiUrl);

  axios.all([getHeaderData(), fetchApiData(baseApiUrl), getLanguageData()])
    .then(axios.spread((headerData, newArrivalsData, languageData) => {
      const headerParsed = parser.parse(headerData.data, headerOptions);
      const headerModelData = HeaderItemModel.build(headerParsed);
      const languages = filterLanguages(languageData.data, languageItemCount);

      res.locals.data = {
        HeaderStore: {
          headerData: headerModelData,
        },
        NewArrivalsStore: {
          displayType: 'grid',
          newArrivalsData: newArrivalsData.data,
          pageNum: 2,
          filters: {
            format: '',
            audience: '',
            language: '',
            genre: '',
          },
          availabilityType: 'New Arrival',
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
          headerData: [],
        },
        NewArrivalsStore: {
          displayType: 'grid',
          newArrivalsData: {},
          pageNum: 2,
          filters: {
            format: '',
            audience: '',
            language: '',
            genre: '',
          },
          availabilityType: 'New Arrival',
          languages: [],
        },
      };

      next();
    }); /* end Axios call */
};

function selectPage(req, res) {
  const query = req.query;

  const format = query.format || formatFilters();
  const audience = query.audience || '';
  const language = query.language || '';
  const genre = query.genre || '';
  const availability = query.availability || 'New%20Arrival';
  const pageNum = query.pageNum || '1';
  const items = query.itemCount || itemCount;

  const formatQuery = `&format=${format}`;
  const audienceQuery = audience ? `&audience=${audience}` : '';
  const languageQuery = language ? `&language=${language}` : '';
  const genreQuery = genre ? `&genre=${genre}` : '';
  const availabilityQuery = `&availability=${availability}`;
  const pageNumQuery = `&pageNum=${pageNum}`;
  const itemCountQuery = `&itemCount=${items}`;
  const publishYearQuery = `&minPublishYear=${minPublishYear}`;

  const apiUrl = `${newArrivalsApi.bibItems}?` +
    `${formatQuery}` +
    `${audienceQuery}` +
    `${languageQuery}` +
    `${genreQuery}` +
    `${availabilityQuery}` +
    `${itemCountQuery}` +
    `${pageNumQuery}` +
    `${publishYearQuery}`;

console.log(apiUrl);
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
  .route('/api')
  .get(selectPage);


export default router;
