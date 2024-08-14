<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isEnumControl,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsEnumControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { useVanillaControl } from "../util";

import Select from "primevue/select";

const controlRenderer = defineComponent({
    name: "EnumControlRenderer",
    components: {
        ControlWrapper,
        Select,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        return useVanillaControl(useJsonFormsEnumControl(props), (target) =>
            target.selectedIndex === 0 ? undefined : target.value
        );
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(2, isEnumControl),
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
            :id="control.id + '-select'"
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
        </Select>
    </control-wrapper>
</template>