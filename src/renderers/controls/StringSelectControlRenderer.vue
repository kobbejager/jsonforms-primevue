<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isStringControl,
} from "@jsonforms/core";
import { defineComponent, computed } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { usePrimeVueControl } from "../util";
import type { StringSelectControlOptions } from "../util";

import Select from "primevue/select";

const hasUiEnumValues = (uischema: any): boolean => {
    const opts = (uischema as any)?.options;
    return Array.isArray(opts?.enumValues) && opts.enumValues.length > 0;
};

const controlRenderer = defineComponent({
    name: "StringSelectControlRenderer",
    components: {
        ControlWrapper,
        Select,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) =>
            value === "" ? undefined : value;

        const base = usePrimeVueControl<ReturnType<typeof useJsonFormsControl>, StringSelectControlOptions>(
            useJsonFormsControl(props),
            adaptTarget
        );

        const options = computed(() => {
            const values: any[] = (base.appliedOptions.value as any)?.enumValues ?? [];
            const labels: string[] | undefined = (base.appliedOptions.value as any)?.enumLabels;
            if (Array.isArray(labels) && labels.length === values.length) {
                return values.map((v: any, idx: number) => ({ label: labels[idx] ?? String(v), value: v }));
            }
            return values.map((v: any) => ({ label: String(v), value: v }));
        });

        return {
            ...base,
            options,
        };
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(5, (uischema, schema, ctx) => {
        // Only for string controls, without schema enum, but with UI enumValues
        const isString = isStringControl(uischema, schema, ctx);
        if (!isString) return false;
        try {
            const hasSchemaEnum = Array.isArray((schema as any)?.enum);
            if (hasSchemaEnum) return false;
        } catch (e) {
            // ignore
        }
        return hasUiEnumValues(uischema);
    }),
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
        <Select
            :id="control.id + '-select'"
            :model-value="control.data"
            :options="options"
            optionLabel="label"
            optionValue="value"
            showClear
            fluid
            :class="styles.control.select"
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


