# Etherpad ESLint Shareable Config

This package contains an [ESLint](https://eslint.org/) [shareable
config](https://eslint.org/docs/developer-guide/shareable-configs) that is used
by [Etherpad](https://etherpad.org/) and Etherpad plugins in the
https://github.com/ether namespace. You are encouraged to use it for your own
Etherpad plugins so that your code stays consistent with the Etherpad codebase.

## Available Configs

* **`etherpad`**: Base config containing settings that are common to all files.
* **`etherpad/node`**: Extends `etherpad` for code that runs in Node.js.
* **`etherpad/browser`**: Extends `etherpad` for code that runs in the browser.
* **`etherpad/tests`**: Extends `etherpad` for test code.
* **`etherpad/tests/backend`**: Extends `etherpad/node` and `etherpad/tests` for
  backend test code.
* **`etherpad/tests/frontend`**: Extends `etherpad/browser` and `etherpad/tests`
  for frontend test code.
* **`etherpad/plugin`**: Applies the above configs to the appropriate files.
  Assumes the plugin follows the [typical file
  layout](https://etherpad.org/doc/latest/#index_folder_structure).

## Usage in an Etherpad Plugin

1.  Install the shareable config and its dependencies:

    ```shell
    npm install --save-dev \
        eslint \
        eslint-plugin-mocha \
        eslint-plugin-node \
        eslint-plugin-prefer-arrow \
        eslint-plugin-promise \
        eslint-config-etherpad
    ```

2.  Edit your `package.json` to use the shareable config:

    ```json
      "eslintConfig": {
        "root": true,
        "extends": "etherpad/plugin"
      },
    ```

3. If you `require('ep_etherpad-lite/*')` anywhere in your server-side code, add
   a peer dependency so that the `node` ESLint plugin won't complain about
   unavailable modules:

   ```json
      "peerDependencies": {
        "ep_etherpad-lite": ">=1.8.6"
      },
   ```

   Adding an entry to `peerDependencies` does not cause `npm install` to install
   that peer dependency; you must manually install it yourself:

   ```shell
   npm install --no-save ep_etherpad-lite@file:/path/to/etherpad-lite/src
   ```

   The above command creates a symlink at `node_modules/ep_etherpad-lite` that
   points to `/path/to/etherpad-lite/src`. Unfortunately, `npm` automatically
   deletes that symlink whenever you run `npm install` to install, add, or
   update a regular dependency, so remember to re-run the above command each
   time you run `npm install`.

4. *Optional but recommended:* Define a `lint` script so that you can run `npm
   run lint` to check the code:

    ```json
      "scripts": {
        "lint": "eslint ."
      },
    ```

5. *Optional but recommended:* Specify the minimum version of Node.js you
    support (ideally this would match [Etherpad's minimum required
    version](https://github.com/ether/etherpad-lite#requirements)) so that the
    `node` ESLint plugin can warn you when you use incompatible features:

    ```json
      "engines": {
        "node": ">=10.13.0"
      },
    ```

6. Apply automatic fixes. If you added the optional `lint` script to
   `package.json`, you can run:

   ```shell
   npm run lint -- --fix
   ```

   Or you can run:

   ```shell
   npx eslint --fix .
   ```

## Overrides

If you need to tune the configs, you can specify
[overrides](https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns)
in your `package.json`. For example:

```json
  "eslintConfig": {
    "root": true,
    "extends": "etherpad/plugin",
    "overrides": [
      {
        "files": ["static/js/shared/**/*"],
        "env": {
          "shared-node-browser": true
        },
        "extends": "etherpad/node"
      }
    ]
  },
```

## Copyright and License

Copyright © 2020 Richard Hansen <rhansen@rhansen.org>

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License"); you
may not use this file except in compliance with the License. You may obtain a
copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
