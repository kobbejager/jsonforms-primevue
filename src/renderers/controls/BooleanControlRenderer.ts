import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import Component, { entry as sfcEntry } from './BooleanControlRenderer.vue';

export default Component;
export const entry: JsonFormsRendererRegistryEntry = {
    ...sfcEntry,
    renderer: Component,
};

