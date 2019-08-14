# NYPL New Arrivals

## Version
> v1.7.11

A React/Node Universal JavaScript Application focused on displaying bib items that are new arrivals or on order at NYPL.

## Installation
Install all npm dependencies listed under `package.json`
```sh
$ npm install
```

**In OSX, if you encounter install issues**, you may be helped by [this SO post](https://stackoverflow.com/a/52633713/2092409) - which, depending on the state of your Command Line Tools, may just boil down to running:

```
CXXFLAGS="-mmacosx-version-min=10.9" LDFLAGS="-mmacosx-version-min=10.9" npm install
```

## Running the Application

*Note: Running `npm start` or `npm run dist` may dump a bunch of stack traces to stdout. [They may be safe to ignore](#stacktraces-in-logs)*

### Development Mode
We use Webpack to fire off a hot-reloading development server. This allows for continuous code changes without the need to refresh your browser.

```sh
$ npm start # Starts localhost:3001 defaulting to APP_ENV=production
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

## Troubleshooting

### Stacktraces in logs

Under Node v6.11.5 (and v6.10.3), installed dependencies seem to spew a lot of warnings like this:

```
$ npm run dist

> dgx-new-arrivals@1.7.10 dist /Users/_/projects/nypl/dgx-new-arrivals
> NODE_ENV=production webpack --config webpack.config.js

(node) v8::ObjectTemplate::Set() with non-primitive values is deprecated
(node) and will stop working in the next major release.

==== JS stack trace =========================================

Security context: 0x82e30dcf781 <JS Object>#0#
    1: .node [module.js:597] [pc=0x2bc9140e59a4] (this=0x16c8a9094499 <an Object with deprecated map 0x28d5bec1ba11>#1#,module=0x1ddb77ab5461 <a Module with map 0x28d5bec1cf61>#2#,filename=0x1ddb77ab3ae1 <String[107]: /Users/_/projects/nypl/dgx-new-arrivals/node_modules/node-sass/vendor/darwin-x64-48/binding.node>)
    2: load [module.js:~478] [pc=0x2bc913b82323] (this=0x1ddb77ab5461 <a Module with map 0x28d5bec1cf61>#2#,filename=0x1ddb77ab3ae1 <String[107]: /Users/_/projects/nypl/dgx-new-arrivals/node_modules/node-sass/vendor/darwin-x64-48/binding.node>)
    3: tryModuleLoad(aka tryModuleLoad) [module.js:446] [pc=0x2bc913842afd] (this=0x82e30d04381 <undefined>,module=0x1ddb77ab5461 <a Module with map 0x28d5bec1cf61>#2#,filename=0x1ddb77ab3ae1 <String[107]: /Users/_/projects/nypl/dgx-new-arrivals/node_modules/node-sass/vendor/darwin-x64-48/binding.node>)
```

This is happening in the production EB deployment too. Apparently these are [just warnings](https://stackoverflow.com/questions/36897992/nodejs-upgrade-causing-stack-trace) where old packages are hitting deprecation warnings in Node v6. Upgrading a few packages may cuase the warnings to disappear.
