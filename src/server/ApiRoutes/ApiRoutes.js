import express from 'express';
import axios from 'axios';
import parser from 'jsonapi-parserinator';
import tempData from '../../../temp.js';

// import { HeaderItemModel, HomepageModel } from 'dgx-model-data';
import { api, homepageApi, headerApi } from '../../../appConfig.js';

let router = express.Router(),
  appEnvironment = process.env.APP_ENV || 'production',
  apiRoot = api.root[appEnvironment];


function NewArrivalsApp(req, res, next) {
  // const tempUrl = 'http://10.224.6.14:8080/';
  const tempUrl = '/newArrivalsData';

  res.locals.data = {
    NewArrivalsStore: {
      newArrivalsData: tempData.data,
    },
  };

  next();

//   axios.get(tempUrl)
//     .then(homepageData => {
//       // let homepageParsed = parser.parse(homepageData.data, homepageOptions),
//       // const homepageModelData = HomepageModel.build(homepageParsed);
// console.log(homepageData);
//       res.locals.data = {
//         NewArrivalsStore: {
//           newArrivalsData: homepageData.data,
//         },
//       };

//       next();
//     })
//     .catch(error => {
//       console.log('error calling API : ' + error);
//       console.log('Attempted to call : ' + completeApiUrl);

//       res.locals.data = {
//         Store: {
//           _storeVar: []
//         },
//       };
//       next();
//     }); /* end Axios call */
}

router
  .route('/')
  .get(NewArrivalsApp);

router
  .route('/newArrivalsData')
  .get((req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    res.json(tempData);
  });

export default router;
