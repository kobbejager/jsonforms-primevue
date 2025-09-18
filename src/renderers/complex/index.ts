export { default as ObjectRenderer } from './ObjectRenderer';
export { default as OneOfRenderer } from './OneOfRenderer';

import { entry as objectRendererEntry } from './ObjectRenderer';
import { entry as oneOfRendererEntry } from './OneOfRenderer';

export const complexRenderers = [
    objectRendererEntry,
    oneOfRendererEntry,
];
