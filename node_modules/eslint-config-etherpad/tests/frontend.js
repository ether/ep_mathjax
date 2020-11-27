'use strict';

module.exports = {
  extends: [
    'etherpad/browser',
    'etherpad/tests',
  ],
  globals: {
    _: 'readonly',
    expect: 'readonly',
    helper: 'readonly',
  },
};
