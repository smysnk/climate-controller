require('babel-polyfill');
require('babel-core/register')({
  'presets': ['env']
});
require('./src/main');
