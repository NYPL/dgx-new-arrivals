import express from 'express';
import config from '../../../appConfig.js';

import axios from 'axios';
import parser from 'jsonapi-parserinator';

import Model from 'dgx-model-data';

const { HeaderItemModel } = Model;
const { api, headerApi } = config;

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
  const category = 1;
  const days = 26;
  const itemCount = 18;
  const pageNum = 4;
  const tempUrl = `http://10.224.6.14:8087/categories/${category}?` +
    `days=${days}&itemCount=${itemCount}&pageNum=${pageNum}`;

  axios.all([getHeaderData(), fetchApiData(tempUrl)])
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
        },
        completeApiUrl: ''
      };

      next();
    }))
    .catch(error => {
      console.log('error calling API : ' + error);
      console.log('Attempted to call : ' + completeApiUrl);

      res.locals.data = {
        Store: {
          _storeVar: []
        },
      };
      next();
    }); /* end Axios call */
}

function SelectPage(req, res) {
  const pageNum = req.params.page;
  const category = 1;
  const days = 26;
  const itemCount = 18;
  const tempUrl = `http://10.224.6.14:8087/categories/${category}?` +
    `days=${days}&itemCount=${itemCount}&pageNum=${pageNum}`;

  axios
    .get(tempUrl)
    .then(response => {
      res.json(response.data);
    }); /* end axios call */
}

router
  .route('/')
  .get(NewArrivalsApp);

router
  .route('/:page')
  .get(SelectPage);

router
  .route('/newArrivalsData')
  .get((req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    res.json(tempData);
  });

export default router;
