'use strict';

module.exports = {
  extends: [
    'etherpad',
    'plugin:node/recommended',
  ],
  env: {
    node: true,
  },
  ignorePatterns: [
    'node_modules/',
  ],
  plugins: [
    'node',
  ],
};
