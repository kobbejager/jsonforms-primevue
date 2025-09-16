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
import { usePrimeVueControl } from "../util";

import Select from "primevue/select";
import RadioButton from "primevue/radiobutton";
import SelectButton from "primevue/selectbutton";

const controlRenderer = defineComponent({
    name: "EnumControlRenderer",
    components: {
        ControlWrapper,
        Select,
        RadioButton,
        SelectButton,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) =>
            value === undefined ? undefined : value;

        return usePrimeVueControl(
            useJsonFormsEnumControl(props),
            adaptTarget
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
        :show-errors="showErrors"
    >
        <div v-if="appliedOptions.selectButton">
            <SelectButton
                :id="control.id + '-selectbutton'"
                :model-value="control.data"
                :options="control.options"
                optionLabel="label"
                optionValue="value"
                :disabled="!control.enabled"
                :class="styles.control.select"
                :invalid="showErrors"
                @update:model-value="onChange"
                @focus="isFocused = true"
                @blur="() => { isFocused = false; markTouched(); }"
            />
        </div>
        <div v-else-if="appliedOptions.radio" :class="appliedOptions.horizontal ? 'flex flex-wrap gap-6 items-center' : 'flex flex-col gap-2'">
            <div v-for="(opt, idx) in control.options" :key="idx" class="flex items-center gap-2">
                <RadioButton
                    :inputId="control.id + `-radio-${idx}`"
                    :model-value="control.data"
                    :value="opt.value"
                    :disabled="!control.enabled"
                    :invalid="showErrors"
                    @update:model-value="onChange"
                    @focus="isFocused = true"
                    @blur="() => { isFocused = false; markTouched(); }"
                />
                <label :for="control.id + `-radio-${idx}`">{{ opt.label }}</label>
            </div>
        </div>
        <Select
            v-else
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
            :invalid="showErrors"
            @update:model-value="onChange"
            @focus="isFocused = true"
            @blur="() => { isFocused = false; markTouched(); }"
        >
        </Select>
    </control-wrapper>
</template>