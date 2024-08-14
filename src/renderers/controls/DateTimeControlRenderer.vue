<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isDateTimeControl,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { useVanillaControl } from "../util";

import DatePicker from "primevue/datepicker";

const toISOString = (inputDateTime: string) => {
    return inputDateTime === "" ? undefined : inputDateTime + ":00.000Z";
};

const controlRenderer = defineComponent({
    name: "DatetimeControlRenderer",
    components: {
        ControlWrapper,
        DatePicker
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        return useVanillaControl(useJsonFormsControl(props), (target) =>
            toISOString(target.value)
        );
    },
    computed: {
        dataTime(): string {
            return (this.control.data ?? "").substr(0, 16);
        },
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(2, isDateTimeControl),
};
</script>

<template>
    <control-wrapper
        v-bind="controlWrapper"
        :styles="styles"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <DatePicker
            :id="control.id + '-input'"
            :model-value="dataTime"
            showTime 
            hourFormat="24" 
            fluid
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