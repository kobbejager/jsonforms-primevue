<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isBooleanControl,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { usePrimeVueControl } from "../util";
import type { BooleanControlOptions } from "../util";

import Checkbox from "primevue/checkbox";
import ToggleButton from "primevue/togglebutton";
import ToggleSwitch from "primevue/toggleswitch";
import SelectButton from "primevue/selectbutton";
import RadioButton from "primevue/radiobutton";
import Button from "primevue/button";

const controlRenderer = defineComponent({
    name: "BooleanControlRenderer",
    components: {
        ControlWrapper,
        Checkbox,
        ToggleButton,
        ToggleSwitch,
        SelectButton,
        RadioButton,
        Button,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) =>
            value === undefined ? undefined : value;

        return usePrimeVueControl<ReturnType<typeof useJsonFormsControl>, BooleanControlOptions>(
            useJsonFormsControl(props),
            adaptTarget
        );
    },
    computed: {
        variant(): 'checkbox' | 'togglebutton' | 'toggleswitch' | 'selectbutton' | 'radio' {
            const options = this.appliedOptions as BooleanControlOptions;
            return options.variant ?? 'checkbox';
        },
        includeNotApplicable(): boolean {
            const options = this.appliedOptions as BooleanControlOptions;
            if (this.control.required) {
                return false;
            }
            return !!options?.allowNotApplicable;
        },
        notApplicableLabel(): string {
            const options: any = this.appliedOptions;
            return options?.NotApplicableLabel || options?.notApplicableLabel || 'Not applicable';
        },
        trueLabel(): string {
            const options = this.appliedOptions as BooleanControlOptions;
            return options?.trueLabel || 'True';
        },
        falseLabel(): string {
            const options = this.appliedOptions as BooleanControlOptions;
            return options?.falseLabel || 'False';
        },
        selectedOptionValue(): boolean | '__NOT_APPLICABLE__' | undefined {
            if (this.control.data === undefined && this.includeNotApplicable) {
                return '__NOT_APPLICABLE__';
            }
            return this.control.data;
        },
        selectOptions(): Array<{ label: string; value: boolean | '__NOT_APPLICABLE__' }> {
            const base: Array<{ label: string; value: boolean | '__NOT_APPLICABLE__' }> = [
                { label: this.trueLabel, value: true },
                { label: this.falseLabel, value: false },
            ];
            if (this.includeNotApplicable) {
                return [...base, { label: this.notApplicableLabel, value: '__NOT_APPLICABLE__' }];
            }
            return base;
        },
        optionContainerClass(): string {
            const options = this.appliedOptions as BooleanControlOptions;
            return options?.horizontal
                ? 'flex flex-wrap gap-6 items-center'
                : 'flex flex-col gap-2';
        },
    },
    methods: {
        onBinaryUpdate(value: boolean): void {
            this.onChange(value);
        },
        updateAlt(value: boolean | '__NOT_APPLICABLE__' | undefined | null): void {
            if (value === '__NOT_APPLICABLE__' || value === undefined || value === null) {
                this.handleChange?.(this.control.path, undefined);
                return;
            }
            this.onChange(value);
        },
        unsetValue(): void {
            this.handleChange?.(this.control.path, undefined);
        },
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(1, isBooleanControl),
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
        <div v-if="variant === 'selectbutton'">
            <SelectButton
                :id="control.id + '-selectbutton'"
                :model-value="selectedOptionValue"
                :options="selectOptions"
                optionLabel="label"
                optionValue="value"
                :disabled="!control.enabled"
                :class="styles.control.select"
                :invalid="showErrors"
                @update:model-value="updateAlt"
                @focus="isFocused = true"
                @blur="() => { isFocused = false; markTouched(); }"
            />
        </div>
        <div v-else-if="variant === 'radio'" :class="optionContainerClass">
            <div v-for="(opt, idx) in selectOptions" :key="idx" class="flex items-center gap-2">
                <RadioButton
                    :inputId="control.id + `-radio-${idx}`"
                    :model-value="selectedOptionValue"
                    :value="opt.value"
                    :disabled="!control.enabled"
                    :invalid="showErrors"
                    @update:model-value="updateAlt"
                    @focus="isFocused = true"
                    @blur="() => { isFocused = false; markTouched(); }"
                />
                <label :for="control.id + `-radio-${idx}`">{{ opt.label }}</label>
            </div>
        </div>
        <div v-else-if="variant === 'togglebutton'" class="flex items-center gap-2">
            <ToggleButton
                :id="control.id + '-togglebutton'"
                :model-value="control.data === true"
                :onLabel="trueLabel"
                :offLabel="falseLabel"
                :disabled="!control.enabled"
                :class="styles.control.input"
                :invalid="showErrors"
                @update:model-value="onBinaryUpdate"
                @focus="isFocused = true"
                @blur="() => { isFocused = false; markTouched(); }"
            />
            <Button
                v-if="includeNotApplicable && control.data !== undefined"
                type="button"
                severity="secondary"
                text
                size="small"
                :label="notApplicableLabel"
                :disabled="!control.enabled"
                @click="unsetValue"
            />
        </div>
        <div v-else-if="variant === 'toggleswitch'" class="flex items-center gap-2">
            <ToggleSwitch
                :inputId="control.id + '-toggleswitch'"
                :model-value="control.data === true"
                :class="styles.control.input"
                :disabled="!control.enabled"
                :invalid="showErrors"
                @update:model-value="onBinaryUpdate"
                @focus="isFocused = true"
                @blur="() => { isFocused = false; markTouched(); }"
            />
            <label :for="control.id + '-toggleswitch'">
                {{ control.data === true ? trueLabel : falseLabel }}
            </label>
            <Button
                v-if="includeNotApplicable && control.data !== undefined"
                type="button"
                severity="secondary"
                text
                size="small"
                :label="notApplicableLabel"
                :disabled="!control.enabled"
                @click="unsetValue"
            />
        </div>
        <div v-else class="flex items-center gap-2">
            <Checkbox
                :id="control.id + '-input'"
                :model-value="control.data === true"
                binary
                :indeterminate="control.data === undefined"
                :class="styles.control.input"
                :disabled="!control.enabled"
                :autofocus="appliedOptions.focus"
                :placeholder="appliedOptions.placeholder"
                :invalid="showErrors"
                @update:model-value="onBinaryUpdate"
                @focus="isFocused = true"
                @blur="() => { isFocused = false; markTouched(); }"
            />
            <label class="ml-2">{{ control.label }}</label>
            <Button
                v-if="includeNotApplicable && control.data !== undefined"
                type="button"
                severity="secondary"
                text
                size="small"
                :label="notApplicableLabel"
                :disabled="!control.enabled"
                @click="unsetValue"
            />
        </div>

    </control-wrapper>
</template>