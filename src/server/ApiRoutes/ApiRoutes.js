import express from 'express';
import axios from 'axios';
import parser from 'jsonapi-parserinator';

import Model from 'dgx-model-data';
import _ from 'underscore';

import config from '../../../appConfig.js';
import { formatFilters } from '../../app/utils/utils.js';

// Syntax that both ES6 and Babel 6 support
const { HeaderItemModel } = Model;
const { api, headerApi, newArrivalsApi } = config;

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

const getHeaderData = () => {
  const headerApiUrl = parser.getCompleteApi(headerOptions);
  return fetchApiData(headerApiUrl);
};
const getLanguageData = () => {
  const days = '30';
  const languageApiUrl = `${newArrivalsApi.languages}?&days=${days}&minPublishYear=2015`;
  return fetchApiData(languageApiUrl);
};


const newArrivalsApp = (req, res, next) => {
  const itemCount = '18';
  const formats = formatFilters();
  const baseApiUrl = `${newArrivalsApi.bibItems}?format=${formats}` +
    `&availability=New%20Arrival&itemCount=${itemCount}&minPublishYear=2015`;

  axios.all([getHeaderData(), fetchApiData(baseApiUrl), getLanguageData()])
    .then(axios.spread((headerData, newArrivalsData, languageData) => {
      const headerParsed = parser.parse(headerData.data, headerOptions);
      const headerModelData = HeaderItemModel.build(headerParsed);

      const languages = _.chain(languageData.data)
        .filter(language =>
          (language.count >= 100 &&
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
          languages,
          availabilityType: 'New Arrival',
        },
        completeApiUrl: '',
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
          languages: [],
          availabilityType: 'New Arrival',
        },
      };

      next();
    }); /* end Axios call */
};

function selectPage(req, res) {
  const query = req.query;
  const audience = query.audience || '';
  const format = query.format || '';
  const language = query.language || '';
  const pageNum = query.pageNum || '1';
  const itemCount = query.itemCount || '18';
  const availability = query.availability || '';
  const genre = query.genre || '';

  const formatQuery = format ? `&format=${format}` : '';
  const audienceQuery = audience ? `&audience=${audience}` : '';
  const languageQuery = language ? `&language=${language}` : '';
  const availabilityQuery = availability ? `&availability=${availability}` : '';
  const genreQuery = genre ? `&genre=${genre}` : '';
  const apiUrl = `${newArrivalsApi.bibItems}?${formatQuery}` +
    `${languageQuery}${audienceQuery}${availabilityQuery}` +
    `${genreQuery}&itemCount=${itemCount}&pageNum=${pageNum}&minPublishYear=2015`;

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
