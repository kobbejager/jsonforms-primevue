<template>
    <div v-if="control.visible" :class="styles.oneOf.root">
        <combinator-properties
            :schema="control.schema"
            combinator-keyword="oneOf"
            :path="path"
            :root-schema="control.rootSchema"
        />
        <control-wrapper
            v-bind="controlWrapper"
            :styles="styles"
            :is-focused="isFocused"
            :applied-options="appliedOptions"
        >
            <Fieldset class="no-legend-gap">
                <div v-if="appliedOptions.selectButton" class="mt-4">
                    <SelectButton
                        :id="control.id + '-selectbutton'"
                        :model-value="selectIndex"
                        :options="selectOptions"
                        optionLabel="label"
                        optionValue="index"
                        :disabled="!control.enabled"
                        :class="styles.control.select"
                        @update:model-value="updateIndex"
                        @focus="isFocused = true"
                        @blur="() => { isFocused = false; markTouched(); }"
                    />
                </div>
                <div v-else-if="appliedOptions.radio" :class="appliedOptions.horizontal ? 'flex flex-wrap gap-6 items-center mt-4' : 'flex flex-col gap-2 mt-4'">
                    <div v-for="(opt, idx) in selectOptions" :key="idx" class="flex items-center gap-2">
                        <RadioButton
                            :inputId="control.id + `-radio-${idx}`"
                            :model-value="selectIndex"
                            :value="opt.index"
                            :disabled="!control.enabled"
                            @update:model-value="updateIndex"
                            @focus="isFocused = true"
                            @blur="() => { isFocused = false; markTouched(); }"
                        />
                        <label :for="control.id + `-radio-${idx}`">{{ opt.label }}</label>
                    </div>
                </div>
                <InputGroup v-else class="mt-4">
                    <Select
                        :inputId="control.id + '-input'"
                        :class="styles.control.select"
                        :options="selectOptions"
                        optionLabel="label"
                        optionValue="index"
                        :modelValue="selectIndex"
                        :showClear="!control.required"
                        :disabled="!control.enabled"
                        @change="handleSelectChange"
                        @update:model-value="handleModelUpdate"
                        @focus="isFocused = true"
                        @blur="isFocused = false"
                    />
                </InputGroup>

                <div 
                v-if="selectedIndex !== undefined && selectedIndex !== null && selectedIndex >= 0"
                class="-mb-4"
                >
                    <Divider />
                    <dispatch-renderer
                        :schema="indexedOneOfRenderInfos[selectedIndex].schema"
                        :uischema="indexedOneOfRenderInfos[selectedIndex].uischema"
                        :path="control.path"
                        :renderers="control.renderers"
                        :cells="control.cells"
                        :enabled="control.enabled"
                    />
                </div>
                
            </Fieldset>
        </control-wrapper>

    </div>
</template>

<script lang="ts">
import {
    CombinatorSubSchemaRenderInfo,
    ControlElement,
    createCombinatorRenderInfos,
    createDefaultValue,
    isOneOfControl,
    JsonFormsRendererRegistryEntry,
    rankWith,
} from '@jsonforms/core'
import {
    DispatchRenderer,
    rendererProps,
    RendererProps,
    useJsonFormsOneOfControl,
} from '@jsonforms/vue'
import { defineComponent, ref } from 'vue'
import { usePrimeVueControl } from '../util'
import { ControlWrapper } from '../controls'
import CombinatorProperties from './components/CombinatorProperties.vue'
import Select from 'primevue/select'
import RadioButton from 'primevue/radiobutton'
import SelectButton from 'primevue/selectbutton'
import InputGroup from 'primevue/inputgroup'
import Fieldset from 'primevue/fieldset'
import Divider from 'primevue/divider'


const controlRenderer = defineComponent({
    name: 'OneOfRenderer',
    components: {
        ControlWrapper,
        DispatchRenderer,
        CombinatorProperties,
        Select,
        RadioButton,
        SelectButton,
        InputGroup,
        Fieldset,
        Divider,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const input = useJsonFormsOneOfControl(props)
        const control = input.control.value

        const selectedIndex = ref(control.indexOfFittingSchema)
        const selectIndex = ref(selectedIndex.value)
        const newSelectedIndex = ref(0)

        return {
            ...usePrimeVueControl(input),
            selectedIndex,
            selectIndex,
            newSelectedIndex,
        }
    },
    computed: {
        includeNotApplicable(): boolean {
            const opts: any = this.appliedOptions as any
            const isAlt = !!opts?.radio || !!opts?.selectButton
            if (this.control.required) return false
            if (isAlt) {
                if (opts?.allowNotApplicable === false) return false
                return true
            }
            return !!opts?.allowNotApplicable
        },
        indexedOneOfRenderInfos(): (CombinatorSubSchemaRenderInfo & {
            index: number
        })[] {
            const result = createCombinatorRenderInfos(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.control.schema.oneOf!,
                this.control.rootSchema,
                'oneOf',
                this.control.uischema,
                this.control.path,
                this.control.uischemas
            )

            return result
                .filter((info) => info.uischema)
                .map((info, index) => ({ ...info, index: index }))
        },
        selectOptions(): ({ label: string; index: number } & Partial<CombinatorSubSchemaRenderInfo>)[] {
            const base = this.indexedOneOfRenderInfos as any[]
            const includeNA = this.includeNotApplicable
            if (includeNA) {
                const naLabel = (this.appliedOptions as any)?.NotApplicableLabel || (this.appliedOptions as any)?.notApplicableLabel || 'Not applicable'
                return ([{ label: naLabel, index: -1 }] as any[]).concat(base)
            }
            return base as any[]
        },
    },
    methods: {
        updateIndex(val: any): void {
            if (!this.control.enabled) return
            this.selectIndex = val
            this.newSelectedIndex = this.selectIndex
            this.newSelection()
        },
        handleSelectChange(e: any): void {
            if (!this.control.enabled) {
                return
            }
            this.selectIndex = e.value
            this.newSelectedIndex = this.selectIndex
            this.newSelection()
        },
        handleModelUpdate(val: any): void {
            // Triggered by clear icon or programmatic updates
            if (val === undefined || val === null || val < 0) {
                if (!this.control.required && (this.appliedOptions as any)?.allowNotApplicable) {
                    this.newSelectedIndex = -1 as any
                    this.newSelection()
                } else {
                    // No NA option: keep internal indices consistent with cleared UI
                    this.newSelectedIndex = undefined as any
                    this.newSelection()
                }
            }
        },
        newSelection(): void {
            if (this.newSelectedIndex === undefined || this.newSelectedIndex === null || (this.newSelectedIndex as any) < 0) {
                if (!this.control.required) {
                    this.handleChange(this.control.path, undefined)
                } else {
                    this.handleChange(this.control.path, {})
                }
            } else {
                this.handleChange(
                    this.control.path,
                    createDefaultValue(
                        this.indexedOneOfRenderInfos[this.newSelectedIndex].schema,
                        this.control.rootSchema
                    )
                )
            }
            this.selectIndex = this.newSelectedIndex
            this.selectedIndex = this.newSelectedIndex
        },
    },
    mounted() {
        const hasNoData = this.control.data === undefined || this.control.data === null
        if (this.control.required) {
            if (hasNoData) {
                this.newSelectedIndex = 0
                this.newSelection()
            }
        } else {
            if (hasNoData) {
                if (this.includeNotApplicable) {
                    this.selectIndex = -1 as any
                    this.selectedIndex = -1 as any
                } else {
                    // No NA option: keep unset visually empty (no selection)
                    this.selectIndex = undefined as any
                    this.selectedIndex = undefined as any
                }
            }
        }
    },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(3, isOneOfControl),
}
</script>


<style scoped>
/* Remove Fieldset legend gap when we render label above the Fieldset */
:deep(.no-legend-gap > .p-fieldset-legend) {
    display: none;
}
</style>

