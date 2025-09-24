export { default as ObjectRenderer } from './ObjectRenderer';
export { default as OneOfRenderer } from './OneOfRenderer';
export { default as AnyOfRenderer } from './AnyOfRenderer';

import { entry as objectRendererEntry } from './ObjectRenderer';
import { entry as oneOfRendererEntry } from './OneOfRenderer';
import { entry as anyOfRendererEntry } from './AnyOfRenderer';

export const complexRenderers = [
    objectRendererEntry,
    oneOfRendererEntry,
    anyOfRendererEntry,
];
