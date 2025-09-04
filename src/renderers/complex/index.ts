export { default as ObjectRenderer } from './ObjectRenderer';
export { default as OneOfRenderer } from './OneOfRenderer';
export { default as EnumArrayRenderer } from './EnumArrayRenderer';

import { entry as objectRendererEntry } from './ObjectRenderer';
import { entry as oneOfRendererEntry } from './OneOfRenderer';
import { entry as enumArrayRendererEntry } from './EnumArrayRenderer';

export const complexRenderers = [
  objectRendererEntry,
  oneOfRendererEntry,
  enumArrayRendererEntry,
];
