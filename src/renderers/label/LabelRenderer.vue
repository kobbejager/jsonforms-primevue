<script lang="ts">
import {
    JsonFormsRendererRegistryEntry,
    LabelElement,
    rankWith,
    uiTypeIs,
} from '@jsonforms/core';
import { Resolve } from '@jsonforms/core';
import { defineComponent, computed } from 'vue';
import {
    rendererProps,
    RendererProps,
    useJsonFormsLabel,
} from '@jsonforms/vue';
import { usePrimeVueLabel } from '../util';
import type { LabelOptions } from '../util';

const labelRenderer = defineComponent({
    name: 'LabelRenderer',
    props: {
        ...rendererProps<LabelElement>(),
    },
    setup(props: RendererProps<LabelElement>) {
        const base = useJsonFormsLabel(props);
        const model = usePrimeVueLabel<typeof base, LabelOptions>(base);
        const description = computed(() => {
            const uiDesc = model.appliedOptions.value?.description;
            if (uiDesc) return uiDesc;
            const scope = model.appliedOptions.value?.scope || (base as any).label.value?.uischema?.scope;
            if (scope) {
                const baseSchema = (props as any).rootSchema ?? (props as any).schema;
                const resolved = Resolve.schema(
                    baseSchema,
                    scope,
                    baseSchema
                );
                return resolved?.description;
            }
            return undefined;
        });
        return { ...model, description };
    },
});

export default labelRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: labelRenderer,
    tester: rankWith(1, uiTypeIs('Label')),
};
</script>


<template>
    <div v-if="label.visible">
        <label :class="styles.control.label">
            {{ label.text }}
        </label>
        <div v-if="description" :class="styles.control.description">
            {{ description }}
        </div>
    </div>
</template>