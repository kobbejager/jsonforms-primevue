<script lang="ts">
import {
    JsonFormsRendererRegistryEntry,
    LabelElement,
    rankWith,
    uiTypeIs,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
    rendererProps,
    RendererProps,
    useJsonFormsLabel,
} from '@jsonforms/vue';
import { usePrimeVueLabel } from '../util';

const labelRenderer = defineComponent({
    name: 'LabelRenderer',
    props: {
        ...rendererProps<LabelElement>(),
    },
    setup(props: RendererProps<LabelElement>) {
        return usePrimeVueLabel(useJsonFormsLabel(props));
    },
});

export default labelRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: labelRenderer,
    tester: rankWith(1, uiTypeIs('Label')),
};
</script>


<template>
    <label v-if="label.visible" :class="styles.label.root">
        {{ label.text }}
    </label>
</template>