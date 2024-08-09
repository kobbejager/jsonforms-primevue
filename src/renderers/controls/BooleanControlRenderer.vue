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
import { useVanillaControl } from "../util";

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
        return useVanillaControl(useJsonFormsControl(props), (target) => target.checked);
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
    >
        <Checkbox
            :id="control.id + '-input'"
            binary
            :indeterminate="control.data === undefined"
            :class="styles.control.input"
            v-model="control.data"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            @change="onChange"
            @focus="isFocused = true"
            @blur="isFocused = false"
        />
        <label class="ml-2">{{ control.label }}</label> 

    </control-wrapper>
</template>