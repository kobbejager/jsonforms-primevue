<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isBooleanControl,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { usePrimeVueControl } from "../util";

import Checkbox from "primevue/checkbox";

const controlRenderer = defineComponent({
    name: "BooleanControlRenderer",
    components: {
        ControlWrapper,
        Checkbox,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) => 
            value || false

        return usePrimeVueControl(
            useJsonFormsControl(props), 
            adaptTarget
        );
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(1, isBooleanControl),
};
</script>

<template>
    <control-wrapper
        v-bind="controlWrapper"
        :styles="styles"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :show-errors="showErrors"
    >
        <Checkbox
            :id="control.id + '-input'"
            :model-value="control.data"
            binary
            :indeterminate="control.data === undefined"
            :class="styles.control.input"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :invalid="showErrors"
            @update:model-value="onChange"
            @focus="isFocused = true"
            @blur="() => { isFocused = false; markTouched(); }"
        />
        <label class="ml-2">{{ control.label }}</label> 

    </control-wrapper>
</template>