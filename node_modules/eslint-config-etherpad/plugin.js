'use strict';

module.exports = {
  overrides: [
    {
      files: ['**/.eslintrc.js'],
      extends: 'etherpad/node',
    },
    {
      files: ['**/*'],
      excludedFiles: ['**/.eslintrc.js', 'static/js/**/*', 'static/tests/frontend/**/*'],
      extends: 'etherpad/node',
    },
    {
      files: ['static/js/**/*'],
      excludedFiles: ['**/.eslintrc.js'],
      extends: 'etherpad/browser',
    },
    {
      files: ['static/tests/**/*'],
      excludedFiles: ['**/.eslintrc.js'],
      extends: 'etherpad/tests',
    },
    {
      files: ['static/tests/backend/**/*'],
      excludedFiles: ['**/.eslintrc.js'],
      extends: 'etherpad/tests/backend',
    },
    {
      files: ['static/tests/frontend/**/*'],
      excludedFiles: ['**/.eslintrc.js'],
      extends: 'etherpad/tests/frontend',
    },
  ],
};
