require('rootpath')();

// Babel 6 requires the use of babel-core instead of the babel module
require('babel-core/register');

module.exports = require('server');
