import express from 'express';
import tempData from '../../../temp.js';
import config from '../../../appConfig.js';

import axios from 'axios';

const { api } = config;

const router = express.Router();
const appEnvironment = process.env.APP_ENV || 'production';
const apiRoot = api.root[appEnvironment];

function NewArrivalsApp(req, res, next) {
  const tempUrl = 'http://10.224.6.14:8087/categories/1?days=20&pageNum=3';
  // const tempUrl = '/newArrivalsData';

  axios
    .get(tempUrl)
    .then(response => {
      // console.log(response.data);
      // const data = response.data;
      // const categoryName = data.name;
      // const totalItems = data.totalItems;
      // const items = data.bibItems;
      // const links = data._links;

      res.locals.data = {
        NewArrivalsStore: {
          newArrivalsData: response.data,
          displayType: 'grid',
        },
      };

      next();

    }); /* end axios call */
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
