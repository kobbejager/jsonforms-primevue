export { default as ArrayListRenderer } from './ArrayListRenderer';
export { default as StringArrayRenderer } from './StringArrayRenderer';
export { default as EnumArrayRenderer } from './EnumArrayRenderer';

import { entry as arrayListRendererEntry } from './ArrayListRenderer';
import { entry as stringArrayRendererEntry } from './StringArrayRenderer';
import { entry as enumArrayRendererEntry } from './EnumArrayRenderer';

export const arrayRenderers = [arrayListRendererEntry, stringArrayRendererEntry, enumArrayRendererEntry];
