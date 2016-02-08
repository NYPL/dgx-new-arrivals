import express from 'express';
import axios from 'axios';
import parser from 'jsonapi-parserinator';

import { HeaderItemModel, HomepageModel } from 'dgx-model-data';
import { api, homepageApi, headerApi } from '../../../appConfig.js';

let router = express.Router(),
  appEnvironment = process.env.APP_ENV || 'production',
  apiRoot = api.root[appEnvironment],
  headerOptions = createOptions(headerApi),
  homepageOptions = createOptions(homepageApi);

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

function HomepageApp(req, res, next) {
  const homepageApiUrl = parser.getCompleteApi(homepageOptions);

  axios.all([getHeaderData(), fetchApiData(homepageApiUrl)])
    .then(axios.spread((headerData, homepageData) => {
      let homepageParsed = parser.parse(homepageData.data, homepageOptions),
        homepageModelData = HomepageModel.build(homepageParsed),
        headerParsed = parser.parse(headerData.data, headerOptions),
        headerModelData = HeaderItemModel.build(headerParsed);

      res.locals.data = {
        HomepageStore: {
          recommendedRecentReleasesData: homepageModelData.RecommendedRecentReleases,
        },
        HeaderStore: {
          headerData: headerModelData,
        },
        // Set the API URL here so we can access it when we
        // render in the EJS file.
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

router
  .route('/')
  .get(HomepageApp);

export default router;
