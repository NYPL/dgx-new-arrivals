import express from 'express';
import axios from 'axios';
import parser from 'jsonapi-parserinator';

import Model from 'dgx-model-data';

import config from '../../../appConfig.js';
import { map as _map } from 'underscore';

// Syntax that both ES6 and Babel 6 support
const { HeaderItemModel } = Model;
const { api, headerApi, newArrivalsApi } = config;
const baseUrl = newArrivalsApi.base;
const itemCount = '18';

const router = express.Router();
const appEnvironment = process.env.APP_ENV || 'production';
const apiRoot = api.root[appEnvironment];
const headerOptions = createOptions(headerApi);

function createOptions(api) {
  return {
    endpoint: `${apiRoot}${api.endpoint}`,
    includes: api.includes,
    filters: api.filters,
  };
}

function fetchApiData(url) {
  return axios.get(url);
}

function getHeaderData() {
  const headerApiUrl = parser.getCompleteApi(headerOptions);
  return fetchApiData(headerApiUrl);
}

function getProp(arr, val) {
  return _map(arr, (obj) => {
    return obj[val];
  });
}

function NewArrivalsApp(req, res, next) {
  const apiUrl = `${baseUrl}${newArrivalsApi.bibItems}?&itemCount=${itemCount}`;
  const languageEndpointUrl = `${baseUrl}${newArrivalsApi.languages}`;
  const formatsEndpointUrl = `${baseUrl}${newArrivalsApi.formats}`;
  const audienceEndpointUrl = `${baseUrl}${newArrivalsApi.audience}`;

  axios.all([
      getHeaderData(),
      fetchApiData(apiUrl),
      fetchApiData(audienceEndpointUrl),
      fetchApiData(formatsEndpointUrl),
      fetchApiData(languageEndpointUrl)
    ])
    .then(axios.spread((headerData, newArrivalsData, audienceData, formatsData, languageData) => {
      const headerParsed = parser.parse(headerData.data, headerOptions);
      const headerModelData = HeaderItemModel.build(headerParsed);

      const audienceFilters = getProp(audienceData.data, 'name');
      const formatsFilters = getProp(formatsData.data.formats, 'name');
      const languageFilters = getProp(languageData.data, 'name');


      res.locals.data = {
        HeaderStore: {
          headerData: headerModelData,
        },
        NewArrivalsStore: {
          displayType: 'grid',
          newArrivalsData: newArrivalsData.data,
        },
        completeApiUrl: ''
      };

      next();
    }))
    .catch(error => {
      console.log(`error calling API : ${error}`);
      console.log(`Attempted to call : ${apiUrl}`);

      res.locals.data = {
        Store: {
          _storeVar: []
        },
      };
      next();
    }); /* end Axios call */
}

function SelectPage(req, res) {
  const query = req.query;
  const audience = query.language || '';
  const bibNumber = query.bibNumber || '';
  const days = query.days || '';
  const format = query.format || '';
  const language = query.language || '';
  const pageNum = query.pageNum || '1';
  const itemCount = query.itemCount || '18';

  const formatQuery = format ? `&format=${format}` : '';
  const audienceQuery = audience ? `&audience=${audience}` : '';
  const languageQuery = language ? `&language=${language}` : '';
  const apiUrl = `${base}${bibItems}?${formatQuery}` +
    `${languageQuery}&itemCount=${itemCount}`;

  axios
    .get(apiUrl)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log(`error calling API : ${error}`);
      console.log(`Attempted to call : ${apiUrl}`);

      res.json({
        error
      });
    }); /* end axios call */
}

router
  .route('/')
  .get(NewArrivalsApp);

router
  .route('/api')
  .get(SelectPage);


export default router;
