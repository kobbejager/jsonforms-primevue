<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isOneOfEnumControl,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
    rendererProps,
    useJsonFormsOneOfEnumControl,
    RendererProps,
} from '@jsonforms/vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { usePrimeVueControl } from '../util';

import Select from "primevue/select";

const controlRenderer = defineComponent({
    name: 'EnumOneofControlRenderer',
    components: {
        ControlWrapper,
        Select
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) =>
            value === undefined ? undefined : value;

        return usePrimeVueControl(
            useJsonFormsOneOfEnumControl(props),
            adaptTarget
        );
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(5, isOneOfEnumControl),
};
</script>

<template>
    <control-wrapper
        v-bind="controlWrapper"
        :styles="styles"
        :is-focused="isFocused" 
        :applied-options="appliedOptions"
    >
        <Select
            :id="control.id + '-input'"
            :model-value="control.data"
            :options="control.options"
            optionLabel="label"
            optionValue="value"
            showClear
            fluid
            :class="styles.control.select"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :invalid="control.errors.length > 0"
            @update:model-value="onChange"
            @focus="isFocused = true"
            @blur="isFocused = false"
        >
            <!--option key="empty" value="" :class="styles.control.option" />
            <option v-for="optionElement in control.options" :key="optionElement.value" :value="optionElement.value"
                :label="optionElement.label" :class="styles.control.option"></option -->
        </Select>
    </control-wrapper>
</template>