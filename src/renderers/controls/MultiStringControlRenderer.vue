<script lang="ts">
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    isStringControl,
    isMultiLineControl,
    and,
} from "@jsonforms/core";
import { defineComponent } from "vue";
import { rendererProps, useJsonFormsControl, RendererProps } from "@jsonforms/vue";
import { default as ControlWrapper } from "./ControlWrapper.vue";
import { useVanillaControl } from "../util";

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
        return useVanillaControl(
            useJsonFormsControl(props),
            (target) => target.value || undefined
        );
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(2, and(isStringControl, isMultiLineControl)),
};
</script>

<template>
  <control-wrapper
      v-bind="controlWrapper"
      :styles="styles"
      :is-focused="isFocused"
      :applied-options="appliedOptions"
  >
      <Textarea
          :id="control.id + '-input'"
          fluid
          autoResize
          rows="3"
          :class="styles.control.textarea"
          v-model="control.data"
          :disabled="!control.enabled"
          :autofocus="appliedOptions.focus"
          :placeholder="appliedOptions.placeholder"
          @change="onChange"
          @focus="isFocused = true"
          @blur="isFocused = false"
      />
  </control-wrapper>
</template>
