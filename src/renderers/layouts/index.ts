export { default as LayoutRenderer } from './LayoutRenderer';
export { default as GroupRenderer } from './GroupRenderer';
export { default as CategorizationRenderer } from './CategorizationRenderer';

import { entry as layoutRendererEntry } from './LayoutRenderer';
import { entry as groupRendererEntry } from './GroupRenderer';
import { entry as categorizationEntry } from './CategorizationRenderer';

export const layoutRenderers = [
    layoutRendererEntry,
    groupRendererEntry,
    categorizationEntry
];
