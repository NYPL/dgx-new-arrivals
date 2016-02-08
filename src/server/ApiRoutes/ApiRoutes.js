import express from 'express';
import axios from 'axios';
import parser from 'jsonapi-parserinator';

// import { HeaderItemModel, HomepageModel } from 'dgx-model-data';
import { api, homepageApi, headerApi } from '../../../appConfig.js';

let router = express.Router(),
  appEnvironment = process.env.APP_ENV || 'production',
  apiRoot = api.root[appEnvironment];


function NewArrivalsApp(req, res, next) {
  const tempUrl = 'http://10.224.6.14:8080/';

  axios.get(tempUrl)
    .then(homepageData => {
      // let homepageParsed = parser.parse(homepageData.data, homepageOptions),
      // const homepageModelData = HomepageModel.build(homepageParsed);

      res.locals.data = {
        NewArrivalsStore: {
          newArrivalsData: homepageData.data,
        },
      };

      next();
    })
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
  .get(NewArrivalsApp);

export default router;
