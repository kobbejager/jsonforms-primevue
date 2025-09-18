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
        <div v-if="variant === 'selectbutton'" :class="containerClass">
            <SelectButton
                :id="control.id + '-selectbutton'"
                :model-value="control.data"
                :options="filteredOptions"
                optionLabel="label"
                optionValue="value"
                multiple
                :disabled="!control.enabled"
                :class="styles.control.select"
                :invalid="showErrors"
                @update:model-value="onSelectButtonUpdate"
                @focus="isFocused = true"
                @blur="
                    () => {
                        isFocused = false
                        markTouched()
                    }
                "
            />
        </div>

        <div v-else-if="variant === 'multiselect'" :class="containerClass">
            <MultiSelect
                :id="control.id + '-multiselect'"
                :model-value="control.data"
                :options="filteredOptions"
                optionLabel="label"
                optionValue="value"
                :disabled="!control.enabled"
                :class="styles.control.select"
                :invalid="showErrors"
                dropdownIcon="pi pi-tags"
                filter 
                display="chip"
                @update:model-value="onSelectButtonUpdate"
                @focus="isFocused = true"
                @blur="
                    () => {
                        isFocused = false
                        markTouched()
                    }
                "
            />
        </div>

        <div v-else :class="containerClass">
            <div
                v-for="(checkElement, index) in filteredOptions"
                :key="index"
                class="flex items-center gap-2"
            >
                <component
                    :is="variant === 'toggleswitch' ? 'ToggleSwitch' : 'Checkbox'"
                    :inputId="control.id + `-input-${index}`"
                    :model-value="
                        variant === 'toggleswitch'
                            ? dataHasEnum(checkElement.value)
                            : control.data
                    "
                    :value="variant === 'toggleswitch' ? undefined : checkElement.value"
                    :class="styles.control.input"
                    :disabled="!control.enabled"
                    :invalid="showErrors"
                    @update:model-value="(val) => variant === 'toggleswitch' ? onToggleSwitch(checkElement.value, val as boolean) : onUpdateOption(checkElement.value, val)"
                    @focus="isFocused = true"
                    @blur="
                        () => {
                            isFocused = false
                            markTouched()
                        }
                    "
                />
                <label :for="control.id + `-input-${index}`">
                    {{ checkElement.label }}
                </label>
            </div>
        </div>
    </control-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
    RendererProps,
    rendererProps,
    useJsonFormsMultiEnumControl,
} from '@jsonforms/vue'
import {
    ControlElement,
    JsonFormsRendererRegistryEntry,
    rankWith,
    uiTypeIs,
    and,
    schemaMatches,
    hasType,
    schemaSubPathMatches,
    JsonSchema,
} from '@jsonforms/core'
import { usePrimeVueArrayControl } from '../util'
import type { EnumArrayOptions } from '../util'
import Checkbox from 'primevue/checkbox'
import ToggleSwitch from 'primevue/toggleswitch'
import SelectButton from 'primevue/selectbutton'
import MultiSelect from 'primevue/multiselect'
import { ControlWrapper } from '../controls'

const controlRenderer = defineComponent({
    name: 'EnumArrayRenderer',
    components: {
        Checkbox,
        ToggleSwitch,
        SelectButton,
        MultiSelect,
        ControlWrapper,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const control = useJsonFormsMultiEnumControl(props)

        return {
            ...usePrimeVueArrayControl<typeof control, EnumArrayOptions>(control),
            isFocused: ref(false),
        }
    },
    computed: {
        containerClass(): string {
            const horizontal = !!this.appliedOptions?.horizontal
            return horizontal
                ? 'flex flex-wrap gap-6 items-center'
                : 'flex flex-col gap-2'
        },
        variant(): 'checkbox' | 'toggleswitch' | 'selectbutton' | 'multiselect' {
            const opt = this.appliedOptions as any
            return opt?.variant ?? 'checkbox'
        },
        filteredOptions(): Array<{ label: string; value: any }> {
            const enumValues = (this.appliedOptions as any)?.enumValues as any[] | undefined
            const enumLabels = (this.appliedOptions as any)?.enumLabels as string[] | undefined
            let opts = this.control.options as Array<{ label: string; value: any }>
            if (Array.isArray(enumValues) && enumValues.length > 0) {
                opts = opts.filter(o => enumValues.includes(o.value))
            }
            if (Array.isArray(enumLabels) && enumLabels.length === opts.length) {
                return opts.map((o, idx) => ({ label: enumLabels[idx] ?? String(o.value), value: o.value }))
            }
            return opts
        },
    },
    methods: {
        dataHasEnum(value: any): boolean {
            return !!this.control.data?.includes(value)
        },
        onUpdateOption(optionValue: any, newModel: any): void {
            const previouslySelected = this.dataHasEnum(optionValue)
            const nowSelected = Array.isArray(newModel) && newModel.includes(optionValue)
            if (nowSelected && !previouslySelected) {
                this.addItem(this.control.path, optionValue)
            } else if (!nowSelected && previouslySelected) {
                this.removeItem?.(this.control.path, optionValue)
            }
        },
        onToggleSwitch(optionValue: any, checked: boolean): void {
            if (checked && !this.dataHasEnum(optionValue)) {
                this.addItem(this.control.path, optionValue)
            } else if (!checked && this.dataHasEnum(optionValue)) {
                this.removeItem?.(this.control.path, optionValue)
            }
        },
        onSelectButtonUpdate(newModel: any): void {
            const current: any[] = Array.isArray(this.control.data)
                ? this.control.data
                : []
            const next: any[] = Array.isArray(newModel) ? newModel : []

            // Add newly selected values
            next
                .filter((value) => !current.includes(value))
                .forEach((value) => this.addItem(this.control.path, value))

            // Remove deselected values
            current
                .filter((value) => !next.includes(value))
                .forEach((value) => this.removeItem?.(this.control.path, value))
        },
    },
})

export default controlRenderer

const hasOneOfItems = (schema: JsonSchema): boolean =>
    schema.oneOf !== undefined &&
    schema.oneOf.length > 0 &&
    (schema.oneOf as JsonSchema[]).every((entry: JsonSchema) => {
        return entry.const !== undefined
    })

const hasEnumItems = (schema: JsonSchema): boolean =>
    schema.type === 'string' && schema.enum !== undefined

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(
        5,
        and(
            uiTypeIs('Control'),
            and(
                schemaMatches(
                    (schema) =>
                        hasType(schema, 'array') &&
                        !Array.isArray(schema.items) &&
                        schema.uniqueItems === true
                ),
                schemaSubPathMatches('items', (schema) => {
                    return hasOneOfItems(schema) || hasEnumItems(schema)
                })
            )
        )
    ),
}
</script>
// ... existing code ...

