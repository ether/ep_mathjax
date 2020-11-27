'use strict';

module.exports = {
  env: {
    mocha: true,
  },
  extends: [
    'etherpad',
    'plugin:mocha/recommended',
  ],
  plugins: [
    'mocha',
  ],
  rules: {
    'mocha/no-hooks-for-single-case': 'off',
    'mocha/no-return-from-async': 'error',
    // Disabled due to false positives:
    //   - https://github.com/lo1tuma/eslint-plugin-mocha/issues/274
    //   - Using a loop to define tests can trigger it unless the logic is trivial.
    'mocha/no-setup-in-describe': 'off',
    'mocha/no-synchronous-tests': 'error',
    'mocha/prefer-arrow-callback': 'error',
    // The node/no-unpublished-require rule considers devDependencies to be unpublished. Downgrade
    // the severity to warn for test code so that test code can require something from
    // devDependencies without causing the lint check to fail. Alternatives:
    //   - Set it to 'off' for test code. This would silence warnings about "acceptable" uses of
    //     devDependencies, but it would also hide true bugs.
    //   - Add test code to .npmignore. This would cause the test code to also be considered
    //     unpublished, so the rule wouldn't complain about depending on someting that is
    //     unpublished. Unfortunately, .npmignore is tricky to get right, it can be dangerous (for
    //     example, it's easy to accidentally publish credentials saved in dot files), and it
    //     imposes a burden on all users of this config.
    //   - Parse package.json and add all of the devDependencies to this rule's allowModules
    //     setting. Example of this approach:
    //     https://github.com/mysticatea/eslint-plugin-node/issues/47#issuecomment-629777952
    //     Unfortunately it is not feasible to find the user's package.json so this approach is not
    //     usable here.
    'node/no-unpublished-require': 'warn',
    'prefer-arrow-callback': 'off',
    'prefer-arrow/prefer-arrow-functions': 'off',
  },
};
