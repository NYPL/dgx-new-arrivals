import express from 'express';
import tempData from '../../../temp.js';
import config from '../../../appConfig.js';

const { api } = config;

const router = express.Router();
const appEnvironment = process.env.APP_ENV || 'production';
const apiRoot = api.root[appEnvironment];

function NewArrivalsApp(req, res, next) {
  // const tempUrl = 'http://10.224.6.14:8080/';
  const tempUrl = '/newArrivalsData';

  res.locals.data = {
    NewArrivalsStore: {
      newArrivalsData: tempData.data,
    },
  };

  next();
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
