<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isTimeControl,
} from "@jsonforms/core";
import { defineComponent, ref, onMounted } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { useVanillaControl } from "../util";

import DatePicker from "primevue/datepicker";

const controlRenderer = defineComponent({
    name: "TimeControlRenderer",
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
                ? ("0" + value.getHours()).slice(-2) + ":" + ("0" + value.getMinutes()).slice(-2) + ":"+ ("0" + value.getSeconds()).slice(-2) 
                : undefined;
        const control = useVanillaControl(
            useJsonFormsControl(props),
            adaptTarget
        );

        // set initial value
        onMounted(() => {
            // split value into hours, minutes and seconds
            let parts = control.control.value.data.split(":");
            // transform to numbers
            parts = parts.map(Number);
            // if none of the parts are NaN, proceed
            if (!parts.some(isNaN)) {
                let value = new Date();
                value.setHours(Number(parts[0]));
                if (parts.length > 1) {
                    value.setMinutes(Number(parts[1]));
                }
                if (parts.length > 2) {
                    value.setSeconds(Number(parts[2]));
                }
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
    tester: rankWith(2, isTimeControl),
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
            timeOnly
            showIcon
            fluid
            iconDisplay="input"
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
                <i class="pi pi-clock" @click="slotProps.clickCallback" />
            </template>
        </DatePicker>
    </control-wrapper>
</template>
