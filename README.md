# NYPL New Arrivals

## Version
> v1.7.7

A React/Node Universal JavaScript Application focused on displaying bib items that are new arrivals or on order at NYPL.

## Installation
Install all npm dependencies listed under `package.json`
```sh
$ npm install
```

## Running the Application
### Development Mode
We use Webpack to fire off a hot-reloading development server. This allows for continuous code changes without the need to refresh your browser.

```sh
$ npm start // Starts localhost:3001 defaulting to APP_ENV=development
```

You can also set the `APP_ENV` variable to `development`, `qa`, or `production` to use those respective environments.

> The default is **production**.

```sh
$ APP_ENV=development|qa|production npm start // Starts localhost:3001 with set APP_ENV
```

### Production Mode
To replicate the application in a production state. We execute 2 npm scripts with the proper `ENV` variables. By using `NODE_ENV=production`, we disable the hot-reload server. In addition, the `production` Webpack configuration is set by running `npm run dist`.

* **Step 1**: Build the distribution assets into `./dist/`
```sh
$ npm run dist
```

* **Step 2**: Starts the Node/Express server in `localhost:3001` with the `APP_ENV` set to `production`, targeting the proper `production` API's.
```sh
$ APP_ENV=production NODE_ENV=production npm start
```

## GIT Workflow
We follow a [feature-branch](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) workflow. If you need to introduce/update the application code, you `SHOULD`:

* Create a new branch off the `development` branch
* Send a pull request pointing to the `development` branch upon completion
* Once the pull request is approved, it should be merged into the `development` branch
* Travis CI is setup to automatically build and deploy the `development` branch on our Elastic Beanstalk Development server
* If there are several pull requests in process, a release should be scheduled by merging all completed pull requests into the `development` branch
* When a release is scheduled to be deployed, the `development` branch will be merged into the `qa` branch
* Travis CI will build and deploy the `qa` branch into our Elastic Beanstalk QA server
* Upon a successful verification of the application on our staging (QA) environment, the `qa` branch should be merged into the `master` branch
* Travis CI will build and deploy the `master` branch into our Elastic Beanstalk Production server
* All releases merged into `master` `MUST` be tagged and pushed to Github with their corresponding `version`

## AWS Elastic Beanstalk Application Settings
By using the `aws-cli`, developers can deploy the application to the AWS application environments listed below:

| AWS Profile | Application Name | Environment |
|---|---|---|
| `nypl-digital-dev` | `new-arrivals-app` | **QA**: `new-arrivals-qa` <br><br> **Production**: `new-arrivals-production` |
| `nypl-sandbox` | `new-arrivals-app` | **Development**: `new-arrivals-development` |

> Note: All QA and Development servers should be configured with only 1 instance. Production servers are typically setup with auto-scaling supporting 2 or more instances.

## AWS Deployment with Continuous Integration & Delivery
Travis CI is configured to run our build and deployment process on AWS.

Our Travis CI/CD pipeline will execute the following steps for each deployment trigger:
* Run unit test coverage
* Run the npm task to build the distribution assets
* Execute the `deploy` hook only for `development`, `qa` and `master` branches to adhere to our AWS Elastic Beanstalk `development`, `qa` and `production` servers
* Developers do not need to manually deploy the application unless an error occurred via Travis
