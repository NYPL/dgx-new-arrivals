# NYPL New Arrivals

## Version
> v1.5.8

Get bib items that are new arrivals or on order at NYPL.

## Getting Started
### Installation
This app runs on Node.js (v6), Express, and React. After cloning this repo, install all the dependencies by running the following command:

```sh
$ npm install
```

### Development Mode
The following command starts the application using a hot-reload server environment in `localhost:3001`

```sh
$ npm start
```

You can also set the `APP_ENV` variable to `development`, `qa`, or production to use those respective environments.

> The default is **production**.

```sh
$ APP_ENV=development npm start
```

### Production Mode
To simulate what the production server would execute, run:

```sh
$ npm run dist // builds all distribution assets
$ NODE_ENV=production npm start // runs the Node/Express server in production mode
```

## Deployment
We use AWS Elastic Beanstalk to deploy the application.

### Production
 In production, we utilize Travis CI to trigger automatic deployments to our production instance on AWS. Secure credentials are encrypted and stored in the Travis repository settings.

The `.travis.yml` file contains the necessary configurations that will:

* Install all node_modules and cache them
* Attempt to build the distribution assets by running `npm run dist` prior to triggering the deploy
* The `deploy` task only occurs on the `master` branch upon a successful `npm run dist`

### QA
For QA, developers use the `aws-cli` to trigger deployments via `eb deploy` to the proper AWS application environment.
