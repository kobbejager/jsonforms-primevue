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
import { usePrimeVueControl } from "../util";

import InputNumber from "primevue/inputnumber";
import Slider from "primevue/slider";


const controlRenderer = defineComponent({
    name: "IntegerControlRenderer",
    components: {
        ControlWrapper,
        InputNumber,
        Slider,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) => 
            typeof value === 'number' ? value : value || undefined;

        return usePrimeVueControl(
            useJsonFormsControl(props),
            adaptTarget
        );
    },
    computed: {
        variant(): 'inputnumber' | 'slider' {
            const options: any = this.appliedOptions;
            return options.variant ?? 'inputnumber';
        },
        showButtons(): boolean {
            const options: any = this.appliedOptions;
            return options.showButtons ?? true;
        },
        step(): number {
            const options: any = this.appliedOptions;
            const stepValue = options.step;
            if (typeof stepValue === 'number' && Number.isInteger(stepValue) && stepValue >= 1) {
                return stepValue;
            }
            return 1;
        },
        min(): number | undefined {
            const options: any = this.appliedOptions;
            return typeof options.min === 'number' ? options.min : undefined;
        },
        max(): number | undefined {
            const options: any = this.appliedOptions;
            return typeof options.max === 'number' ? options.max : undefined;
        },
        sliderMin(): number {
            // For slider variant, min is required - fallback to 0 if not provided
            const options: any = this.appliedOptions;
            return typeof options.min === 'number' ? options.min : 0;
        },
        sliderMax(): number {
            // For slider variant, max is required - fallback to 100 if not provided
            const options: any = this.appliedOptions;
            return typeof options.max === 'number' ? options.max : 100;
        },
        prefix(): string | undefined {
            const options: any = this.appliedOptions;
            return typeof options.prefix === 'string' ? options.prefix : undefined;
        },
        suffix(): string | undefined {
            const options: any = this.appliedOptions;
            return typeof options.suffix === 'string' ? options.suffix : undefined;
        },
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
        :show-errors="showErrors"
    >
        <!-- Slider variant -->
        <div v-if="variant === 'slider'" class="flex items-center gap-3">
            <Slider
                :id="control.id + '-slider'"
                :model-value="control.data ?? sliderMin"
                :min="sliderMin"
                :max="sliderMax"
                :step="step"
                :disabled="!control.enabled"
                :class="styles.control.input"
                :invalid="showErrors"
                @update:model-value="onChange"
                @focus="isFocused = true"
                @blur="() => { isFocused = false; markTouched(); }"
                style="flex: 1;"
            />
            <InputNumber
                :id="control.id + '-input'"
                :model-value="control.data"
                inputId="integeronly"
                :useGrouping="false"
                :showButtons="showButtons"
                :step="step"
                :min="sliderMin"
                :max="sliderMax"
                :prefix="prefix"
                :suffix="suffix"
                :class="styles.control.input"
                :disabled="!control.enabled"
                :invalid="showErrors"
                @update:model-value="onChange"
                @focus="isFocused = true"
                @blur="() => { isFocused = false; markTouched(); }"
            />
        </div>
        <!-- InputNumber variant (default) -->
        <InputNumber
            v-else
            :id="control.id + '-input'"
            :model-value="control.data"
            inputId="integeronly"
            :useGrouping="false"
            :showButtons="showButtons"
            fluid
            :step="step"
            :min="min"
            :max="max"
            :prefix="prefix"
            :suffix="suffix"
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
