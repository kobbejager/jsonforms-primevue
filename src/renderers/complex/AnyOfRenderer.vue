<template>
    <div v-if="control.visible" :class="styles.oneOf.root">
        <combinator-properties
            :schema="control.schema"
            combinator-keyword="anyOf"
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
                <Tabs v-if="anyOfRenderInfos.length > 0" v-model:value="selectedIndex" class="-mb-4">
                    <TabList>
                        <Tab
                            v-for="(info, idx) in anyOfRenderInfos"
                            :key="`${control.path}-${anyOfRenderInfos.length}-${idx}`"
                            :value="idx"
                        >
                            {{ info.label }}
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel
                            v-for="(info, idx) in anyOfRenderInfos"
                            :key="`${control.path}-panel-${anyOfRenderInfos.length}-${idx}`"
                            :value="idx"
                            class="-mb-4"
                        >
                            <dispatch-renderer
                                :schema="info.schema"
                                :uischema="info.uischema"
                                :path="control.path"
                                :renderers="control.renderers"
                                :cells="control.cells"
                                :enabled="control.enabled"
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Fieldset>
        </control-wrapper>
    </div>
</template>

<script lang="ts">
import {
    CombinatorSubSchemaRenderInfo,
    ControlElement,
    createCombinatorRenderInfos,
    isAnyOfControl,
    JsonFormsRendererRegistryEntry,
    rankWith,
    update,
} from '@jsonforms/core'
import {
    DispatchRenderer,
    rendererProps,
    RendererProps,
    useJsonFormsAnyOfControl,
} from '@jsonforms/vue'
import { defineComponent, ref, watch, inject } from 'vue'
import { usePrimeVueControl } from '../util'
import type { AnyOfOptions } from '../util'
import { ControlWrapper } from '../controls'
import CombinatorProperties from './components/CombinatorProperties.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Fieldset from 'primevue/fieldset'

const controlRenderer = defineComponent({
    name: 'AnyOfRenderer',
    components: {
        ControlWrapper,
        DispatchRenderer,
        CombinatorProperties,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel,
        Fieldset,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const input = useJsonFormsAnyOfControl(props)
        const control = input.control.value

        const selectedIndex = ref(control.indexOfFittingSchema ?? 0)

        // Access JSON Forms dispatch for direct updates when handleChange is not present
        const dispatch = inject<any>('dispatch')
        const writeChange = (path: string, value: any) => {
            if (typeof (input as any).handleChange === 'function') {
                ;(input as any).handleChange(path, value)
            } else if (dispatch) {
                dispatch(update(path, () => value))
            }
        }

        // Auto-unset empty object when optional unless allowEmpty=true
        watch(
            () => input.control.value?.data,
            (newVal) => {
                try {
                    const isObject = newVal && typeof newVal === 'object' && !Array.isArray(newVal)
                    const isEmptyObject = isObject && Object.keys(newVal).length === 0
                    const allowEmpty = !!(input.control.value?.uischema?.options as AnyOfOptions | undefined)?.allowEmpty
                    const isRequired = !!input.control.value?.required
                    const path: string = input.control.value?.path ?? ''
                    const isRoot = path === '' || path === undefined || path === null
                    if (isEmptyObject && !allowEmpty && !isRequired && !isRoot) {
                        writeChange(path, undefined)
                    }
                } catch (e) {
                    // no-op: best-effort cleanup
                }
            },
            { deep: true }
        )

        return {
            ...usePrimeVueControl<typeof input, AnyOfOptions>(input),
            selectedIndex,
        }
    },
    computed: {
        anyOfRenderInfos(): CombinatorSubSchemaRenderInfo[] {
            const result = createCombinatorRenderInfos(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.control.schema.anyOf!,
                this.control.rootSchema,
                'anyOf',
                this.control.uischema,
                this.control.path,
                this.control.uischemas
            )
            return result.filter((info) => info.uischema)
        },
    },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(3, isAnyOfControl),
}
</script>


<style scoped>
/* Remove Fieldset legend gap when we render label above the Fieldset */
:deep(.no-legend-gap > .p-fieldset-legend) {
    display: none;
}
</style>
