<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isStringControl,
    Resolve,
} from "@jsonforms/core";
import { defineComponent, computed } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { usePrimeVueControl } from "../util";

import Select from "primevue/select";

const controlRenderer = defineComponent({
    name: "StringExamplesControlRenderer",
    components: {
        ControlWrapper,
        Select,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) =>
            value === "" ? undefined : value?.toString?.() ?? value;

        const base = usePrimeVueControl(
            useJsonFormsControl(props),
            adaptTarget
        );

        const selectOptions = computed(() => {
            const opts: any = base.appliedOptions.value ?? {};
            const uiExamples = Array.isArray(opts.examples) ? opts.examples : undefined;
            const uiSuggestions = Array.isArray(opts.suggestions) ? opts.suggestions : undefined;
            const schemaExamples = Array.isArray(base.control.value.schema?.examples)
                ? base.control.value.schema.examples
                : undefined;

            const values = uiExamples ?? uiSuggestions ?? schemaExamples ?? [];
            return values.map((v: any) => ({ label: String(v), value: v }));
        });

        return {
            ...base,
            selectOptions,
        };
    },
});

export default controlRenderer;

const hasUiOrSchemaExamples = (uischema: any, schema: any, ctx?: any): boolean => {
    const opts = (uischema as any)?.options ?? {};
    const uiExamples = Array.isArray(opts.examples);
    const uiSuggestions = Array.isArray(opts.suggestions);
    let schemaExamples = false;
    try {
        const resolved = Resolve.schema(ctx?.rootSchema ?? schema, uischema?.scope);
        schemaExamples = Array.isArray((resolved as any)?.examples);
    } catch (e) {
        schemaExamples = false;
    }
    return uiExamples || uiSuggestions || schemaExamples;
};

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(4, (uischema, schema, ctx) => {
        return isStringControl(uischema, schema, ctx) && hasUiOrSchemaExamples(uischema, schema, ctx);
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
            :options="selectOptions"
            optionLabel="label"
            optionValue="value"
            editable
            showClear
            fluid
            dropdownIcon="pi pi-heart"
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


