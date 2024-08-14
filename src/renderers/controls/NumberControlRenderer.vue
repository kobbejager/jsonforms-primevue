<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isNumberControl,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { useVanillaControl } from "../util";

import InputNumber from "primevue/inputnumber";

const NUMBER_REGEX_TEST = /^[+-]?\d+([.]\d+)?([eE][+-]?\d+)?$/;

const controlRenderer = defineComponent({
    name: "NumberControlRenderer",
    components: {
        ControlWrapper,
        InputNumber,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) => 
            typeof value === 'number' ? value : value || undefined;

        return useVanillaControl(
            useJsonFormsControl(props), 
            adaptTarget
        );
    },
    computed: {
        step(): number {
            const options: any = this.appliedOptions;
            return options.step ?? 0.1;
        },
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(1, isNumberControl),
};
</script>

<template>
    <control-wrapper
        v-bind="controlWrapper"
        :styles="styles"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <InputNumber
            :id="control.id + '-input'"
            :model-value="control.data"
            :useGrouping="false"
            :minFractionDigits="1"
            showButtons
            fluid
            :step="step"
            :class="styles.control.input"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            @update:model-value="onChange"
            @focus="isFocused = true"
            @blur="isFocused = false"
        />
    </control-wrapper>
</template>
