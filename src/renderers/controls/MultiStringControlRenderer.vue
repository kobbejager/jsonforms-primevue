<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isStringControl,
    isMultiLineControl,
    schemaMatches,
    and,
    or,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { usePrimeVueControl } from "../util";

import Textarea from "primevue/textarea";

const controlRenderer = defineComponent({
    name: "MultiStringControlRenderer",
    components: {
        ControlWrapper,
        Textarea,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const adaptTarget = (value: any) => 
            value === "" ? undefined : value.toString();

        return usePrimeVueControl(
            useJsonFormsControl(props),
            adaptTarget
        );
    },
});

export default controlRenderer;

const isTextAreaControl = and(
    isStringControl, 
    schemaMatches(
        (schema) => (schema.format == 'textarea')
    )
);

const isBetterMultiLineControl = or(isMultiLineControl, isTextAreaControl);

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(2, and(isStringControl, isBetterMultiLineControl)),
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
      <Textarea
          :id="control.id + '-input'"
          :model-value="control.data"
          fluid
          autoResize
          rows="3"
          :class="styles.control.textarea"
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
