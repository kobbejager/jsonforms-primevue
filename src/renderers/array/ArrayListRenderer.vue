<script lang="ts">
import {
    composePaths,
    createDefaultValue,
    JsonFormsRendererRegistryEntry,
    rankWith,
    ControlElement,
    schemaTypeIs,
    Resolve,
    JsonSchema,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
    DispatchRenderer,
    rendererProps,
    useJsonFormsArrayControl,
    RendererProps,
} from '@jsonforms/vue';
import { usePrimeVueArrayControl } from '../util';
import type { ArrayListOptions } from '../util';
import ArrayListElement from './ArrayListElement.vue';

import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';


const controlRenderer = defineComponent({
    name: 'ArrayListRenderer',
    components: {
        ArrayListElement,
        DispatchRenderer,
        Button,
        ButtonGroup,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        return usePrimeVueArrayControl<ReturnType<typeof useJsonFormsArrayControl>, ArrayListOptions>(useJsonFormsArrayControl(props));
    },
    computed: {
        noData(): boolean {
            return !this.control.data || this.control.data.length === 0;
        },
        arraySchema(): JsonSchema | undefined {
            return Resolve.schema(
                this.schema,
                this.control.uischema.scope,
                this.control.rootSchema
            );
        },
        maxItemsReached(): boolean | undefined {
            return (
                this.arraySchema !== undefined &&
                this.arraySchema.maxItems !== undefined &&
                this.control.data !== undefined &&
                this.control.data.length >= this.arraySchema.maxItems
            );
        },
        // Do not enforce minItems at the UI level for delete behavior
        minItemsReached(): boolean | undefined {
            return false;
        },
        showAsterisk(): boolean {
            return this.control.required && !this.appliedOptions?.hideRequiredAsterisk;
        },
        dataSummary(): Array<string> {
            let result = [];
            if (this.control.data && Array.isArray(this.control.data) && this.control.data.length > 0) {
                // if data is an array of objects or arrays, return empty array (too complex to show)
                if (typeof this.control.data[0] === 'object' || Array.isArray(this.control.data[0])) {
                    return result;
                }
                // if data is an array of primitives, return an array of the data as strings
                result = this.control.data.map(item => item.toString());
                // shorten all strings in the array to 15 characters
                result = result.map(item => {
                    if (item.length > 15) {
                        return item.substring(0, 15) + '...';
                    }
                    return item;
                });
            }
            return result;
        }
    },
    methods: {
        composePaths,
        createDefaultValue,
        addButtonClick() {
            this.markTouched();
            this.addItem(
                this.control.path,
                createDefaultValue(this.control.schema, this.control.rootSchema)
            )();
        },
        deleteAtIndex(index: number) {
            const willBeEmpty = Array.isArray(this.control.data) && this.control.data.length === 1;
            // Perform removal
            this.removeItems(this.control.path, [index])();
            // If it becomes empty and not allowed and not required, unset property
            if (
                willBeEmpty &&
                !this.appliedOptions?.allowEmptyArrays &&
                !this.control.required
            ) {
                // Fallback to dispatch via injected action if handleChange is not available
                if (typeof this.handleChange === 'function') {
                    this.handleChange(this.control.path, undefined);
                } else if (typeof (this as any).$?.appContext?.provides?.dispatch === 'function') {
                    const dispatch = (this as any).$?.appContext?.provides?.dispatch;
                    const { update } = require('@jsonforms/core');
                    dispatch(update(this.control.path, () => undefined));
                }
            }
        },
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(2, schemaTypeIs('array')),
};
</script>

<template>
    <div 
        v-if="control.visible" 
        :class="styles.arrayList.root"
    >
        <div :class="styles.arrayList.legend">
            <div class="grow">
                <label :class="styles.arrayList.label">
                    {{ control.label }}
                    <span v-if="showAsterisk" :class="styles.control.asterisk">*</span>
                </label>
                <div :class="styles.control.description">
                    {{ control.description }}
                </div>
            </div>
            <ButtonGroup>
                <Button 
                    :label="String(control.data?.length ?? 0)"
                    severity="secondary"
                    outlined
                    disabled
                />
                <Button 
                    :class="styles.arrayList.addButton" 
                    icon="pi pi-plus" 
                    severity="secondary" 
                    outlined
                    :disabled="!control.enabled || (appliedOptions.restrict && maxItemsReached)" 
                    @click="addButtonClick" 
                />
            </ButtonGroup>
        </div>
        
        <div 
            v-for="(element, index) in control.data" 
            :key="`${control.path}-${index}`"
            :class="styles.arrayList.itemWrapper"
        >
            <array-list-element 
                :move-up="moveUp(control.path, index)" 
                :move-up-enabled="control.enabled && index > 0"
                :move-down="moveDown(control.path, index)"
                :move-down-enabled="control.enabled && index < control.data.length - 1"
                :delete-enabled="control.enabled" 
                :delete="() => deleteAtIndex(index)"
                :label="childLabelForIndex(index)" 
                :sortable="appliedOptions?.sortable ?? false"
                :styles="styles"
            >
                <dispatch-renderer 
                    :schema="control.schema" 
                    :uischema="childUiSchema"
                    :path="composePaths(control.path, `${index}`)" 
                    :enabled="control.enabled"
                    :renderers="control.renderers" 
                    :cells="control.cells" 
                />
            </array-list-element>
        </div>
        
        <div 
            v-if="showErrors && control.errors"
            :class="styles.control.error"
        >
            <i class="pi pi-exclamation-triangle" style="font-size: 0.75rem"></i> {{ control.errors }}
        </div>
    </div>
</template>