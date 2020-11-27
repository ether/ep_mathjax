'use strict';

module.exports = {
  extends: [
    'etherpad',
  ],
  env: {
    browser: true,
    jquery: true,
  },
  globals: {
    clientVars: 'readonly',
    exports: 'readonly',
    html10n: 'readonly',
    io: 'readonly',
    module: 'readonly',
    pad: 'readonly',
    require: 'readonly',
  },
};
