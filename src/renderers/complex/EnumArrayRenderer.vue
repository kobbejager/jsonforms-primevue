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
        <div v-if="appliedOptions.selectButton" :class="containerClass">
            <SelectButton
                :id="control.id + '-selectbutton'"
                :model-value="control.data"
                :options="control.options"
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

        <div v-else :class="containerClass">
            <div
                v-for="(checkElement, index) in control.options"
                :key="index"
                class="flex items-center gap-2"
            >
                <component
                    :is="appliedOptions.toggleSwitch ? 'ToggleSwitch' : 'Checkbox'"
                    :inputId="control.id + `-input-${index}`"
                    :model-value="
                        appliedOptions.toggleSwitch
                            ? dataHasEnum(checkElement.value)
                            : control.data
                    "
                    :value="appliedOptions.toggleSwitch ? undefined : checkElement.value"
                    :class="styles.control.input"
                    :disabled="!control.enabled"
                    :invalid="showErrors"
                    @update:model-value="(val) => appliedOptions.toggleSwitch ? onToggleSwitch(checkElement.value, val as boolean) : onUpdateOption(checkElement.value, val)"
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
import Checkbox from 'primevue/checkbox'
import ToggleSwitch from 'primevue/toggleswitch'
import SelectButton from 'primevue/selectbutton'
import { ControlWrapper } from '../controls'

const controlRenderer = defineComponent({
    name: 'EnumArrayRenderer',
    components: {
        Checkbox,
        ToggleSwitch,
        SelectButton,
        ControlWrapper,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const control = useJsonFormsMultiEnumControl(props)

        return {
            ...usePrimeVueArrayControl(control),
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
            this.handleChange(this.control.path, newModel ?? [])
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
