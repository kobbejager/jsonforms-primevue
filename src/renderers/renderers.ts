import { arrayRenderers } from './array';
import { complexRenderers } from './complex';
import { controlRenderers } from './controls';
import { labelRenderers } from './label';
import { layoutRenderers } from './layouts';

export const primeVueRenderers = [
    ...controlRenderers,
    ...layoutRenderers,
    ...complexRenderers,
    ...arrayRenderers,
    ...labelRenderers,
];
