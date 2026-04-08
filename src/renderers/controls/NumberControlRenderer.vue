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
        sliderValue(): number {
            return typeof this.control.data === 'number' ? this.control.data : this.sliderMin;
        },
        sliderPercent(): number {
            const min = this.sliderMin;
            const max = this.sliderMax;
            if (max <= min) {
                return 0;
            }
            const clampedValue = Math.min(max, Math.max(min, this.sliderValue));
            return ((clampedValue - min) / (max - min)) * 100;
        },
        prefix(): string | undefined {
            const options: any = this.appliedOptions;
            return typeof options.prefix === 'string' ? options.prefix : undefined;
        },
        suffix(): string | undefined {
            const options: any = this.appliedOptions;
            return typeof options.suffix === 'string' ? options.suffix : undefined;
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
        formattedSliderValue(): string {
            const formatOptions: Intl.NumberFormatOptions = this.mode === 'currency'
                ? {
                    style: 'currency',
                    currency: this.currency,
                }
                : {};
            if (typeof this.minFractionDigits === 'number') {
                formatOptions.minimumFractionDigits = this.minFractionDigits;
            }
            if (typeof this.maxFractionDigits === 'number') {
                formatOptions.maximumFractionDigits = this.maxFractionDigits;
            }
            const formattedNumber = this.sliderValue.toLocaleString(this.locale, formatOptions);
            return `${this.prefix ?? ''}${formattedNumber}${this.suffix ?? ''}`;
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
        <div v-if="variant === 'slider'" class="w-full mt-4">
            <div class="relative w-full pb-4">
            <Slider
                :id="control.id + '-slider'"
                :model-value="sliderValue"
                :min="sliderMin"
                :max="sliderMax"
                :step="step"
                :disabled="!control.enabled"
                :class="[styles.control.input, 'w-full']"
                :invalid="showErrors"
                @update:model-value="onChange"
                @focus="isFocused = true"
                @blur="() => { isFocused = false; markTouched(); }"
            />
                <span
                    class="absolute top-full mt-0 -translate-x-1/2 text-xs whitespace-nowrap pointer-events-none opacity-70"
                    :style="{ left: `${sliderPercent}%` }"
                >
                    {{ formattedSliderValue }}
                </span>
            </div>
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
