export { default as ControlWrapper } from './ControlWrapper.vue';
export { default as StringControlRenderer } from './StringControlRenderer';
export { default as MultiStringControlRenderer } from './MultiStringControlRenderer';
export { default as NumberControlRenderer } from './NumberControlRenderer';
export { default as IntegerControlRenderer } from './IntegerControlRenderer';
export { default as EnumControlRenderer } from './EnumControlRenderer';
export { default as oneOfEnumControlRenderer } from './EnumOneOfControlRenderer';
export { default as DateControlRenderer } from './DateControlRenderer';
export { default as DateTimeControlRenderer } from './DateTimeControlRenderer';
export { default as TimeControlRenderer } from './TimeControlRenderer';
export { default as BooleanControlRenderer } from './BooleanControlRenderer';

import { entry as stringControlRendererEntry } from './StringControlRenderer.vue';
import { entry as multiStringControlRendererEntry } from './MultiStringControlRenderer.vue';
import { entry as numberControlRendererEntry } from './NumberControlRenderer.vue';
import { entry as integerControlRendererEntry } from './IntegerControlRenderer.vue';
import { entry as enumControlRendererEntry } from './EnumControlRenderer.vue';
import { entry as oneOfEnumControlRendererEntry } from './EnumOneOfControlRenderer.vue';
import { entry as dateControlRendererEntry } from './DateControlRenderer.vue';
import { entry as dateTimeControlRendererEntry } from './DateTimeControlRenderer.vue';
import { entry as timeControlRendererEntry } from './TimeControlRenderer.vue';
import { entry as booleanControlRendererEntry } from './BooleanControlRenderer.vue';

export const controlRenderers = [
  stringControlRendererEntry,
  multiStringControlRendererEntry,
  numberControlRendererEntry,
  integerControlRendererEntry,
  enumControlRendererEntry,
  oneOfEnumControlRendererEntry,
  dateControlRendererEntry,
  dateTimeControlRendererEntry,
  timeControlRendererEntry,
  booleanControlRendererEntry,
];
