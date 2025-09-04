export { default as ObjectRenderer } from './ObjectRenderer';
export { default as OneOfRenderer } from './OneOfRenderer';
export { default as EnumArrayRenderer } from './EnumArrayRenderer';

import { entry as objectRendererEntry } from './ObjectRenderer.vue';
import { entry as oneOfRendererEntry } from './OneOfRenderer.vue';
import { entry as enumArrayRendererEntry } from './EnumArrayRenderer.vue';

export const complexRenderers = [
  objectRendererEntry,
  oneOfRendererEntry,
  enumArrayRendererEntry,
];
