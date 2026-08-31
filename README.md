# jsonforms-primevue

> [!WARNING]
> On June 29, 2026, PrimeTek dropped the open-source MIT license for PrimeVue starting with version 5, moving the project to the commercial PrimeUI license model. That is a dumb decision, and I will not migrate to PrimeVue v5. For now I will keep developing jsonforms-primevue on PrimeVue v4, and may later switch to a PrimeVue fork (e.g. [BumbleVue](https://bumblevue.org/)) or to another framework entirely.

This repository implements a [PrimeVue](https://primevue.org/) (version ^4.4) renderer set for [JSON Forms](https://jsonforms.io/) (version ^3.6).

__This is work in progress and not ready for production use!__

__Current Status__
All core renderers have been migrated to PrimeVue, and many configuration options are already available. However, the simple controls don’t yet fully conform to strict JSON Schema behavior. Additional variants for several renderers are planned for the near future.

## Install from npm

1) Add the package

```bash
yarn add @kobbejager/jsonforms-primevue
# or
npm install @kobbejager/jsonforms-primevue
```

2) Ensure peer dependencies are installed in your app

```bash
yarn add vue@^3.5 primevue@^4.4 primeicons@^7 @jsonforms/core@^3.6 @jsonforms/vue@^3.6
```

3) Install and import a PrimeVue theme (CSS) in your app entry

```bash
yarn add @primeuix/themes
```

```ts
import '@primeuix/themes/aura/theme.css'
import 'primeicons/primeicons.css'
```

4) Use the renderers

```ts
import { primeVueRenderers } from '@kobbejager/jsonforms-primevue'
import '@kobbejager/jsonforms-primevue/index.css'
```

### Optional: install from GitHub tags

```bash
yarn add @kobbejager/jsonforms-primevue@github:kobbejager/jsonforms-primevue#v0.9.0
# or with semver selector to auto-allow compatible updates
yarn add @kobbejager/jsonforms-primevue@github:kobbejager/jsonforms-primevue#semver:^0.9.0
```

Note: release tags must include the built `dist/` artifacts. If you build locally from Git, ensure your environment can run the package’s build step.

## License and contributions

See the LICENSE file for details.

The code was originally based on the on the [vanilla rendereres of JSON forms](https://github.com/eclipsesource/jsonforms/tree/master/packages/vanilla-renderers), which is licensed under the MIT license and copyrighted by EclipseSource Munich. Even though the renderers have been heavily modified and ported to PrimeVue, some parts of the code are still based on the vanilla renderers.

For this reason, the MIT licensed code in this repository is copyrighted partially by Kobbejager, and partially by EclipseSource Munich.

## Demo app

- Clone this repository using git, or download and extract the zip file.
- Install dependencies using `yarn` or `npm install`
- Run the demo app in development mode using `yarn dev` or `npm run dev`
- Build the demo app for production using `yarn build:demo` or `npm run build:demo` (output: `dist-demo/`)
- Open the browser at [http://localhost:5173](http://localhost:5173) when using development mode

## Library build

- Build the library package (for publishing/consumption) using `yarn build` or `npm run build`
- Library artifacts are written to `dist/`
