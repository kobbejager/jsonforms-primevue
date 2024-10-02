<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isDateControl,
} from "@jsonforms/core";
import { defineComponent, ref, onMounted } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { usePrimeVueControl } from "../util";

import DatePicker from "primevue/datepicker";


const controlRenderer = defineComponent({
    name: "DateControlRenderer",
    components: {
        ControlWrapper,
        DatePicker,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const jsDate = ref();
        const adaptTarget = (value: any) => 
            value instanceof Date 
                ? value.getFullYear() + "-" + ("0" + value.getMonth()).slice(-2) + "-" + ("0" + value.getDate()).slice(-2) 
                : undefined;
        const control = usePrimeVueControl(
            useJsonFormsControl(props),
            adaptTarget
        );

        // set initial value
        onMounted(() => {
            const value = control.control.value.data;
            if (value !== undefined && value !== null) {
                jsDate.value = new Date(value);
            }
        });

        return {
            ...control,
            jsDate,
        };
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(2, isDateControl),
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
            v-model="jsDate"
            showIcon
            iconDisplay="input"
            fluid
            dateFormat="dd/mm/yy"
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
