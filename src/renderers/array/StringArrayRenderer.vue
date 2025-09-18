<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    and,
    uiTypeIs,
    schemaMatches,
    hasType,
    optionIs,
    Resolve,
} from "@jsonforms/core";
import { defineComponent, ref } from "vue";
import { rendererProps, useJsonFormsArrayControl, RendererProps } from "@jsonforms/vue";
import { usePrimeVueArrayControl } from "../util";
import type { StringArrayOptions } from "../util";

import AutoComplete from "primevue/autocomplete";
import { default as ControlWrapper } from "../controls/ControlWrapper.vue";

const controlRenderer = defineComponent({
    name: "StringArrayRenderer",
    components: {
        ControlWrapper,
        AutoComplete,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const base = usePrimeVueArrayControl<ReturnType<typeof useJsonFormsArrayControl>, StringArrayOptions>(
            useJsonFormsArrayControl(props)
        );
        return { ...base, isFocused: ref(false) };
    },
    data() {
        return {
            localValues: [] as any[],
        };
    },
    watch: {
        'control.data': {
            immediate: true,
            handler(val: any) {
                this.localValues = Array.isArray(val) ? [...val] : [];
            }
        }
    },
    computed: {
        arraySchema(): any | undefined {
            try {
                return Resolve.schema(
                    // @ts-ignore schema prop from rendererProps
                    this.schema,
                    this.control.uischema.scope,
                    this.control.rootSchema
                );
            } catch (e) {
                return undefined;
            }
        },
    },
    methods: {
        arraysEqual(a: any[], b: any[]): boolean {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        },
        onUpdate(values: any[]) {
            const nextRaw = Array.isArray(values) ? values : [];
            const schemaUnique = this.arraySchema?.uniqueItems === true;
            const optionUnique = (this.appliedOptions as any)?.uniqueItems === true;
            const enforceUnique = schemaUnique || optionUnique;
            const next: any[] = enforceUnique ? Array.from(new Set(nextRaw)) : nextRaw;
            const current: any[] = Array.isArray(this.control.data) ? [...this.control.data] : [];

            // Update UI immediately
            this.localValues = [...next];

            // No-op if nothing changed
            if (this.arraysEqual(current, next)) return;

            // Replace underlying data to match next exactly (simple and predictable)
            for (let i = current.length - 1; i >= 0; i--) {
                this.removeItems?.(this.control.path, [i])();
            }
            next.forEach((val) => this.addItem(this.control.path, val)());
        },
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(
        4,
        and(
            uiTypeIs('Control'),
            schemaMatches((schema) => {
                const isStringArray = hasType(schema, 'array') && !Array.isArray(schema.items) && (schema.items as any)?.type === 'string';
                return isStringArray;
            }),
            optionIs('compactStringArray', true)
        )
    ),
};
</script>

<template>
    <control-wrapper
        :id="control.id"
        :description="control.description"
        :errors="showErrors ? control.errors : ''"
        :label="control.label"
        :visible="control.visible"
        :required="control.required"
        :applied-options="appliedOptions"
        :is-focused="isFocused"
        :styles="styles"
        :show-errors="showErrors"
    >
        <AutoComplete
            :id="control.id + '-ac'"
            :model-value="localValues"
            multiple
            fluid
            :typeahead="false"
            :dropdown="false"
            :invalid="showErrors"
            :disabled="!control.enabled"
            :class="styles.control.input"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            @update:model-value="onUpdate"
            @focus="isFocused = true"
            @blur="() => { isFocused = false; markTouched(); }"
        />
    </control-wrapper>
</template>


