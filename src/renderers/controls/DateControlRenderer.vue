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

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const parseDateOnly = (value: string): Date | undefined => {
    const match = DATE_ONLY_PATTERN.exec(value);
    if (!match) return undefined;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    return new Date(year, month - 1, day);
};

const formatDateOnly = (value: Date): string =>
    value.getFullYear() +
    "-" +
    ("0" + (value.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + value.getDate()).slice(-2);

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
            value instanceof Date ? formatDateOnly(value) : undefined;
        const control = usePrimeVueControl(
            useJsonFormsControl(props),
            adaptTarget
        );

        // set initial value
        onMounted(() => {
            const value = control.control.value.data;
            if (typeof value === "string") {
                const parsed = parseDateOnly(value);
                if (parsed !== undefined) {
                    jsDate.value = parsed;
                }
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
        :show-errors="showErrors"
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
            :invalid="showErrors"
            @update:model-value="onChange"
            @focus="isFocused = true"
            @blur="() => { isFocused = false; markTouched(); }"
        />
    </control-wrapper>
</template>
