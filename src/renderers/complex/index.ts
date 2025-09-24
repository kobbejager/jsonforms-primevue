export { default as ObjectRenderer } from './ObjectRenderer';
export { default as OneOfRenderer } from './OneOfRenderer';
export { default as AnyOfRenderer } from './AnyOfRenderer';
export { default as AllOfRenderer } from './AllOfRenderer';

import { entry as objectRendererEntry } from './ObjectRenderer';
import { entry as oneOfRendererEntry } from './OneOfRenderer';
import { entry as anyOfRendererEntry } from './AnyOfRenderer';
import { entry as allOfRendererEntry } from './AllOfRenderer';

export const complexRenderers = [
    objectRendererEntry,
    oneOfRendererEntry,
    anyOfRendererEntry,
    allOfRendererEntry,
];
