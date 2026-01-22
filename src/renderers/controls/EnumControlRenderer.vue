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
import type { EnumControlOptions } from "../util";

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

        return usePrimeVueControl<ReturnType<typeof useJsonFormsEnumControl>, EnumControlOptions>(
            useJsonFormsEnumControl(props),
            adaptTarget
        );
    },
    computed: {
        filteredOptions(): Array<{ label: string; value: any }> {
            const enumValues = (this.appliedOptions as any)?.enumValues as any[] | undefined;
            const enumLabels = (this.appliedOptions as any)?.enumLabels as string[] | undefined;
            let opts = this.control.options as Array<{ label: string; value: any }>;
            if (Array.isArray(enumValues) && enumValues.length > 0) {
                opts = opts.filter(o => enumValues.includes(o.value));
            }
            if (Array.isArray(enumLabels) && enumLabels.length === opts.length) {
                return opts.map((o, idx) => ({ label: enumLabels[idx] ?? String(o.value), value: o.value }));
            }
            return opts;
        },
        includeNotApplicable(): boolean {
            const opts: any = this.appliedOptions as any;
            const isAlt = !!opts?.radio || !!opts?.selectButton;
            if (this.control.required) return false;
            if (isAlt) {
                if (opts?.allowNotApplicable === false) return false;
                return true;
            }
            return !!opts?.allowNotApplicable;
        },
        notApplicableLabel(): string {
            const opts: any = this.appliedOptions as any;
            return opts?.NotApplicableLabel || opts?.notApplicableLabel || 'Not applicable';
        },
        selectOptions(): Array<{ label: string; value: any }> {
            const base = this.filteredOptions;
            if (this.includeNotApplicable) {
                return [{ label: this.notApplicableLabel, value: '__NOT_APPLICABLE__' }, ...base];
            }
            return base;
        },
    },
    methods: {
        updateAlt(val: any): void {
            if (val === '__NOT_APPLICABLE__') {
                // Unset the property entirely
                this.handleChange?.(this.control.path, undefined);
            } else {
                this.onChange(val);
            }
        },
        handleSelectUpdate(val: any): void {
            if (val === undefined || val === null || val === '__NOT_APPLICABLE__') {
                this.handleChange?.(this.control.path, undefined);
            } else {
                this.onChange(val);
            }
        },
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
                :model-value="control.data ?? (includeNotApplicable ? '__NOT_APPLICABLE__' : control.data)"
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
        <div v-else-if="appliedOptions.radio" :class="appliedOptions.horizontal ? 'flex flex-wrap gap-6 items-center' : 'flex flex-col gap-2'">
            <div v-for="(opt, idx) in selectOptions" :key="idx" class="flex items-center gap-2">
                <RadioButton
                    :inputId="control.id + `-radio-${idx}`"
                    :model-value="control.data ?? (includeNotApplicable ? '__NOT_APPLICABLE__' : control.data)"
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
        <Select
            v-else
            :id="control.id + '-select'"
            :model-value="control.data"
            :options="selectOptions"
            optionLabel="label"
            optionValue="value"
            :showClear="!control.required"
            fluid
            :class="styles.control.select"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :invalid="showErrors"
            @update:model-value="handleSelectUpdate"
            @focus="isFocused = true"
            @blur="() => { isFocused = false; markTouched(); }"
        >
        </Select>
    </control-wrapper>
</template>