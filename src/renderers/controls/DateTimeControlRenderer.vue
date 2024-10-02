<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isDateTimeControl,
} from "@jsonforms/core";
import { defineComponent, ref, onMounted } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { usePrimeVueControl } from "../util";

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
        const jsDate = ref();
        const adaptTarget = (value: any) => 
            value instanceof Date 
                ? value.toISOString()
                : undefined;
            // value.toSIOString returns a UTC date with timezone info
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
    }
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
            v-model="jsDate"
            showTime 
            hourFormat="24"
            showIcon
            iconDisplay="input"
            fluid
            dateFormat="dd/mm/yy"
            :showSeconds="true"
            :class="styles.control.input"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :invalid="control.errors.length > 0"
            @update:model-value="onChange"
            @focus="isFocused = true"
            @blur="isFocused = false"
        >
            <template #inputicon="slotProps">
                <i class="pi pi-calendar-clock" @click="slotProps.clickCallback" />
            </template>
        </DatePicker>
    </control-wrapper>
</template>