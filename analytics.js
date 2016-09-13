// Account codes for Google Analytics for different environments
const Google = {
  // Return the Google Analytics code for the production property if
  // isProd is true, or the dev property if isProd is false
  code(isProd) {
    const codes = {
      production: 'UA-1420324-3',
      dev: 'UA-1420324-122',
    };

    if (isProd === true) {
      return codes.production;
    }

    return codes.dev;
  },
};

export default {
  google: Google,
};
