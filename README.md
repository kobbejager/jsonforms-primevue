# jsonforms-primevue

This repository implements a [PrimeVue](https://primevue.org/) (version ^4.2) renderer set for [JSON Forms](https://jsonforms.io/) (version ^3.4).

__This is work in progress and not ready for production use!__

Most primitive controls have been implemented (ported from the Vanilla Vue renderer set). Layouts and more complex controls are still missing, as well as advanced configuration options.

At the moment, jsonforms-primevue renderers and the example app are in one and the same package. This will need to be split up in the future (help wanted!), before the renderer set can be published to npm. For now, you can install the renderer set directly from GitHub using a release tag and import it in your app as shown below.

## Install from GitHub tags

1) Add the dependency using a tag (recommended)

```bash
yarn add github:ORG/REPO#v0.1.0
# or with semver selector to auto-allow compatible updates
yarn add github:ORG/REPO#semver:^0.1.0
```

2) Ensure peer dependencies are installed in your app

```bash
yarn add vue@^3.5 primevue@^4.2 primeicons@^7 @primevue/themes@^4.2 @jsonforms/core@^3.4 @jsonforms/vue@^3.4
```

3) Import required CSS in your app entry (e.g. main.ts/main.js)

```ts
import '@primevue/themes/aura/theme.css'
import 'primeicons/primeicons.css'
```

4) Use the renderers

```ts
import { primeVueRenderers } from 'jsonforms-primevue'
```

### Updating to a newer tag

- If you used a fixed tag: update `package.json` from `#v0.1.0` to the new tag (e.g. `#v0.1.1`) and run `yarn install`.
- If you used the semver selector (`#semver:^0.1.0`): run `yarn up jsonforms-primevue` to pull the latest compatible tag.

Note: release tags must include the built `dist/` artifacts. If you build locally from Git, ensure your environment can run the package’s build step.

## License and contributions

See the LICENSE file for details.

The code was originally based on the on the [vanilla rendereres of JSON forms](https://github.com/eclipsesource/jsonforms/tree/master/packages/vanilla-renderers), which is licensed under the MIT license and copyrighted by EclipseSource Munich. Even though the renderers have been heavily modified and ported to PrimeVue, some parts of the code are still based on the vanilla renderers.

For this reason, the MIT licensed code in this repository is copyrighted partially by Kobbejager, and partially by EclipseSource Munich.

## Demo app

- Clone this repository using git, or download and extract the zip file.
- Install dependencies using `yarn` or `npm install`
- Run the demo app in development mode using `yarn dev` or `npm run dev`
- Open the browser at [http://localhost:5173](http://localhost:5173)
