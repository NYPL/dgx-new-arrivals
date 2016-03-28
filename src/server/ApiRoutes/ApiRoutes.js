import express from 'express';
import axios from 'axios';
import parser from 'jsonapi-parserinator';

import Model from 'dgx-model-data';

import config from '../../../appConfig.js';

// Syntax that both ES6 and Babel 6 support
const { HeaderItemModel } = Model;
const { api, headerApi, newArrivalsApi } = config;

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

function NewArrivalsApp(req, res, next) {
  const itemCount = '18';
  const days = '60';
  const baseApiUrl = `${newArrivalsApi.bibItems}?&itemCount=${itemCount}`;

  axios.all([getHeaderData(), fetchApiData(baseApiUrl)])
    .then(axios.spread((headerData, newArrivalsData) => {
      const headerParsed = parser.parse(headerData.data, headerOptions);
      const headerModelData = HeaderItemModel.build(headerParsed)

      res.locals.data = {
        HeaderStore: {
          headerData: headerModelData,
        },
        NewArrivalsStore: {
          displayType: 'grid',
          newArrivalsData: newArrivalsData.data,
          filters: {}
        },
        completeApiUrl: ''
      };

      next();
    }))
    .catch(error => {
      console.log('error calling API : ' + error);
      console.log('Attempted to call : ' + baseApiUrl);

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
  const audience = query.audience || '';
  const bibNumber = query.bibNumber || '';
  const days = query.days || '';
  const format = query.format || '';
  const language = query.language || '';
  const pageNum = query.pageNum || '1';
  const itemCount = query.itemCount || '18';

  const formatQuery = format ? `&format=${format}` : '';
  const audienceQuery = audience ? `&audience=${audience}` : '';
  const languageQuery = language ? `&language=${language}` : '';
  const apiUrl = `${newArrivalsApi.bibItems}?${formatQuery}` +
    `${languageQuery}${audienceQuery}&itemCount=${itemCount}`;

  axios
    .get(apiUrl)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log('error calling API : ' + error);
      console.log('Attempted to call : ' + apiUrl);

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
