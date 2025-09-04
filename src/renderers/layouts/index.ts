export { default as LayoutRenderer } from './LayoutRenderer';
export { default as GroupRenderer } from './GroupRenderer';
export { default as CategorizationRenderer } from '../layouts/CategorizationRenderer';
export { default as CategorizationStepperRenderer } from '../layouts/CategorizationStepperRenderer';

import { entry as layoutRendererEntry } from './LayoutRenderer.vue';
import { entry as groupRendererEntry } from './GroupRenderer.vue';
import { entry as categorizationEntry } from '../layouts/CategorizationRenderer.vue';
import { entry as categorizationStepperEntry } from '../layouts/CategorizationStepperRenderer.vue';

export const layoutRenderers = [
  layoutRendererEntry,
  groupRendererEntry,
  categorizationEntry,
  categorizationStepperEntry,
];
