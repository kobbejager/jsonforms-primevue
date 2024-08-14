<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isIntegerControl,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { useVanillaControl } from "../util";

import InputNumber from "primevue/inputnumber";


const controlRenderer = defineComponent({
    name: "IntegerControlRenderer",
    components: {
        ControlWrapper,
        InputNumber,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        return useVanillaControl(
            useJsonFormsControl(props), 
            (target) => target.modelValue === "" ? undefined : Number(target.modelValue)
        );
    },
    methods: {
        onChange(value){
            console.log(value)
        }
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(1, isIntegerControl),
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
            inputId="integeronly"
            showButtons
            fluid
            :step="1"
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
