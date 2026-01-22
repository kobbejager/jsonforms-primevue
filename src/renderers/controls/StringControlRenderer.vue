<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isStringControl,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { usePrimeVueControl } from "../util";
import type { StringControlOptions } from "../util";

import InputText from "primevue/inputtext";
import Password from "primevue/password";
import InputMask from "primevue/inputmask";

const controlRenderer = defineComponent({
    name: "StringControlRenderer",
    components: {
        ControlWrapper,
        InputText,
        Password,
        InputMask,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) => 
            value === "" ? undefined : value.toString();

        return usePrimeVueControl<ReturnType<typeof useJsonFormsControl>, StringControlOptions>(
            useJsonFormsControl(props),
            adaptTarget
        );
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(1, isStringControl),
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
        <Password
            v-if="appliedOptions.password"
            :id="control.id + '-password'"
            :model-value="control.data"
            fluid
            :class="styles.control.input"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :feedback="false"
            :toggleMask="appliedOptions.toggleMask ?? true"
            :invalid="showErrors"
            @update:model-value="onChange"
            @focus="isFocused = true"
            @blur="() => { isFocused = false; markTouched(); }"
        />
        <InputMask
            v-else-if="appliedOptions.inputMask"
            :id="control.id + '-mask'"
            :model-value="control.data"
            fluid
            :class="styles.control.input"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder ?? appliedOptions.inputMask"
            :mask="appliedOptions.inputMask"
            :invalid="showErrors"
            @update:model-value="onChange"
            @focus="isFocused = true"
            @blur="() => { isFocused = false; markTouched(); }"
        />
        <InputText
            v-else
            :id="control.id + '-input'"
            :model-value="control.data"
            fluid
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
