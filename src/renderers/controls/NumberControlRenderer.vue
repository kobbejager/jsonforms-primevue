<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isNumberControl,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { usePrimeVueControl } from "../util";

import InputNumber from "primevue/inputnumber";
import Slider from "primevue/slider";

const NUMBER_REGEX_TEST = /^[+-]?\d+([.]\d+)?([eE][+-]?\d+)?$/;

const controlRenderer = defineComponent({
    name: "NumberControlRenderer",
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
            if (typeof stepValue === 'number' && stepValue > 0) {
                return stepValue;
            }
            return 0.1;
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
        showClear(): boolean {
            const options: any = this.appliedOptions;
            if (this.control.required) {
                return false;
            }
            return options.showClear ?? false;
        },
        locale(): string | undefined {
            const options: any = this.appliedOptions;
            return typeof options.locale === 'string' ? options.locale : undefined;
        },
        currency(): string | undefined {
            const options: any = this.appliedOptions;
            return typeof options.currency === 'string' ? options.currency : undefined;
        },
        mode(): 'decimal' | 'currency' {
            const options: any = this.appliedOptions;
            return typeof options.currency === 'string' ? 'currency' : 'decimal';
        },
        minFractionDigits(): number | undefined {
            const options: any = this.appliedOptions;
            return typeof options.minFractionDigits === 'number' ? options.minFractionDigits : undefined;
        },
        maxFractionDigits(): number | undefined {
            const options: any = this.appliedOptions;
            return typeof options.maxFractionDigits === 'number' ? options.maxFractionDigits : undefined;
        },
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(1, isNumberControl),
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
                :useGrouping="false"
                :mode="mode"
                :currency="currency"
                :locale="locale"
                :minFractionDigits="minFractionDigits ?? (mode === 'currency' ? undefined : 1)"
                :maxFractionDigits="maxFractionDigits"
                :showButtons="showButtons"
                :step="step"
                :min="sliderMin"
                :max="sliderMax"
                :prefix="prefix"
                :suffix="suffix"
                :showClear="showClear"
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
            :useGrouping="false"
            :mode="mode"
            :currency="currency"
            :locale="locale"
            :minFractionDigits="minFractionDigits ?? (mode === 'currency' ? undefined : 1)"
            :maxFractionDigits="maxFractionDigits"
            :showButtons="showButtons"
            fluid
            :step="step"
            :min="min"
            :max="max"
            :prefix="prefix"
            :suffix="suffix"
            :showClear="showClear"
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
