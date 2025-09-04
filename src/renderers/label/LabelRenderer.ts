import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import Component, { entry as sfcEntry } from './LabelRenderer.vue';

export default Component;
export const entry: JsonFormsRendererRegistryEntry = {
  ...sfcEntry,
  renderer: Component,
};
