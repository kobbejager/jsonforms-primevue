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
            <div ref="selectAnchor">
                <Select
                    ref="selectRef"
                    :inputId="control.id + '-input'"
                    :class="styles.control.select"
                    :options="indexedOneOfRenderInfos"
                    optionLabel="label"
                    optionValue="index"
                    :modelValue="selectIndex"
                    :disabled="!control.enabled"
                    @change="handlePrimeSelectChange"
                    @focus="isFocused = true"
                    @blur="isFocused = false"
                />
                <ConfirmPopup />
            </div>
        </control-wrapper>

        <dispatch-renderer
            v-if="selectedIndex !== undefined && selectedIndex !== null"
            :schema="indexedOneOfRenderInfos[selectedIndex].schema"
            :uischema="indexedOneOfRenderInfos[selectedIndex].uischema"
            :path="control.path"
            :renderers="control.renderers"
            :cells="control.cells"
            :enabled="control.enabled"
        />
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
import isEmpty from 'lodash/isEmpty'
import { defineComponent, nextTick, ref } from 'vue'
import { usePrimeVueControl } from '../util'
import { ControlWrapper } from '../controls'
import CombinatorProperties from './components/CombinatorProperties.vue'
import ConfirmPopup from 'primevue/confirmpopup'
import Select from 'primevue/select'
import { useConfirm } from 'primevue/useconfirm'

const controlRenderer = defineComponent({
    name: 'OneOfRenderer',
    components: {
        ControlWrapper,
        DispatchRenderer,
        CombinatorProperties,
        ConfirmPopup,
        Select,
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

        const confirm = useConfirm()
        const selectAnchor = ref<HTMLElement>()
        const selectRef = ref<any>()

        return {
            ...usePrimeVueControl(input),
            selectedIndex,
            selectIndex,
            newSelectedIndex,
            confirm,
            selectAnchor,
            selectRef,
        }
    },
    computed: {
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
    },
    methods: {
        handlePrimeSelectChange(e: any): void {
            this.selectIndex = e.value
            if (this.control.enabled && !isEmpty(this.control.data)) {
                const nextIndex = this.selectIndex
                this.newSelectedIndex = nextIndex
                // revert the selection while the popup is open
                this.selectIndex = this.selectedIndex
                this.confirm.require({
                    target: (this.selectRef as any)?.$el as HTMLElement || (this.selectAnchor as unknown as HTMLElement),
                    header: 'Switch selection?',
                    message: 'Changing the selection will clear the current data. Continue?',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'Confirm',
                    rejectLabel: 'Cancel',
                    accept: () => {
                        this.newSelectedIndex = nextIndex
                        this.newSelection()
                    },
                    reject: () => {
                        this.newSelectedIndex = this.selectedIndex
                        this.selectIndex = this.selectedIndex
                    },
                })
            } else {
                nextTick(() => {
                    this.selectedIndex = this.selectIndex
                })
            }
        },
        newSelection(): void {
            this.handleChange(
                this.control.path,
                this.newSelectedIndex !== undefined && this.newSelectedIndex !== null
                    ? createDefaultValue(
                          this.indexedOneOfRenderInfos[this.newSelectedIndex].schema,
                          this.control.rootSchema
                      )
                    : {}
            )
            this.selectIndex = this.newSelectedIndex
            this.selectedIndex = this.newSelectedIndex
        },
    },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(3, isOneOfControl),
}
</script>
