export { default as ControlWrapper } from './ControlWrapper.vue';
export { default as StringControlRenderer } from './StringControlRenderer';
export { default as StringExamplesControlRenderer } from './StringExamplesControlRenderer';
export { default as StringSelectControlRenderer } from './StringSelectControlRenderer';
export { default as MultiStringControlRenderer } from './MultiStringControlRenderer';
export { default as NumberControlRenderer } from './NumberControlRenderer';
export { default as IntegerControlRenderer } from './IntegerControlRenderer';
export { default as EnumControlRenderer } from './EnumControlRenderer';
export { default as oneOfEnumControlRenderer } from './EnumOneOfControlRenderer';
export { default as DateControlRenderer } from './DateControlRenderer';
export { default as DateTimeControlRenderer } from './DateTimeControlRenderer';
export { default as TimeControlRenderer } from './TimeControlRenderer';
export { default as BooleanControlRenderer } from './BooleanControlRenderer';

import { entry as stringControlRendererEntry } from './StringControlRenderer';
import { entry as stringExamplesControlRendererEntry } from './StringExamplesControlRenderer';
import { entry as stringSelectControlRendererEntry } from './StringSelectControlRenderer';
import { entry as multiStringControlRendererEntry } from './MultiStringControlRenderer';
import { entry as numberControlRendererEntry } from './NumberControlRenderer';
import { entry as integerControlRendererEntry } from './IntegerControlRenderer';
import { entry as enumControlRendererEntry } from './EnumControlRenderer';
import { entry as oneOfEnumControlRendererEntry } from './EnumOneOfControlRenderer';
import { entry as dateControlRendererEntry } from './DateControlRenderer';
import { entry as dateTimeControlRendererEntry } from './DateTimeControlRenderer';
import { entry as timeControlRendererEntry } from './TimeControlRenderer';
import { entry as booleanControlRendererEntry } from './BooleanControlRenderer';

export const controlRenderers = [
    stringControlRendererEntry,
    stringExamplesControlRendererEntry,
    stringSelectControlRendererEntry,
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
