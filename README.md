# jsonforms-primevue

This repository implements a [PrimeVue](https://primevue.org/) renderer set for [JSON Forms](https://jsonforms.io/).

__This is work in progress and not ready for production use!__

Most primitive controls have been implemented (ported from the Vanilla Vue renderer set). Layouts and more complex controls are still missing, as well as advanced configuration options.

At the moment, jsonforms-primevue renderers and the example app are in one and the same package. This will need to be split up in the future (help wanted!), before the renderer set can be published to npm. For now, one can copy the `src/renderers` folder into an existing project and use it as a local renderer set.

## License and contributions

See the LICENSE file for details.

The code was originally based on the on the [vanilla rendereres of JSON forms](https://github.com/eclipsesource/jsonforms/tree/master/packages/vanilla-renderers), which is licensed under the MIT license and copyrighted by EclipseSource Munich. Even though the renderers have been heavily modified and ported to PrimeVue, some parts of the code are still based on the vanilla renderers.

For this reason, the MIT licensed code in this repository is copyrighted partially by Kobbejager, and partially by EclipseSource Munich.

## Demo app

- Clone this repository using git, or download and extract the zip file.
- Install dependencies using `yarn` or `npm install`
- Run the demo app in development mode using `yarn dev` or `npm run dev`
- Open the browser at [http://localhost:5173](http://localhost:5173)
