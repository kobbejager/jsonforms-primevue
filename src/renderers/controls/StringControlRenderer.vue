<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isStringControl,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { usePrimeVueControl } from "../util";

import InputText from "primevue/inputtext";

const controlRenderer = defineComponent({
    name: "StringControlRenderer",
    components: {
        ControlWrapper,
        InputText,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) => 
            value === "" ? undefined : value.toString();

        return usePrimeVueControl(
            useJsonFormsControl(props),
            adaptTarget
        );
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(1, isStringControl),
};
</script>

<template>
    <control-wrapper
        v-bind="controlWrapper"
        :styles="styles"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <InputText
            :id="control.id + '-input'"
            :model-value="control.data"
            fluid
            :class="styles.control.input"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :invalid="control.errors.length > 0"
            @update:model-value="onChange"
            @focus="isFocused = true"
            @blur="isFocused = false"
        />
    </control-wrapper>
</template>
