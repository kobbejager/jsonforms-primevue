<template>
    <div
        v-if="control.visible"
        :class="styles.oneOf.root"
        @focusout="markTouched"
    >
        <template v-if="delegateUISchema">
            <dispatch-renderer
                :schema="control.schema"
                :uischema="delegateUISchema"
                :path="control.path"
                :enabled="control.enabled"
                :renderers="control.renderers"
                :cells="control.cells"
            />
        </template>
        <template v-else>
            <combinator-properties
                :schema="control.schema"
                combinator-keyword="allOf"
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
                    
                    <div v-if="appliedOptions.accordion">
                        <Accordion :multiple="true">
                            <AccordionPanel
                                v-for="(info, idx) in allOfRenderInfos"
                                :key="`${control.path}-acc-${allOfRenderInfos.length}-${idx}`"
                                :value="idx"
                            >
                                <AccordionHeader>
                                    {{ info.label }}
                                </AccordionHeader>
                                <AccordionContent>
                                    <div>
                                        <dispatch-renderer
                                            :schema="info.schema"
                                            :uischema="info.uischema"
                                            :path="control.path"
                                            :enabled="control.enabled"
                                            :renderers="control.renderers"
                                            :cells="control.cells"
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>
                        </Accordion>
                    </div>

                    <div v-else-if="appliedOptions.tabs">
                        <Tabs v-if="allOfRenderInfos.length > 0" v-model:value="selectedIndex">
                            <TabList>
                                <Tab
                                    v-for="(info, idx) in allOfRenderInfos"
                                    :key="`${control.path}-${allOfRenderInfos.length}-${idx}`"
                                    :value="idx"
                                >
                                    {{ info.label }}
                                </Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel
                                    v-for="(info, idx) in allOfRenderInfos"
                                    :key="`${control.path}-panel-${allOfRenderInfos.length}-${idx}`"
                                :value="idx"
                                >
                                    <dispatch-renderer
                                        :schema="info.schema"
                                        :uischema="info.uischema"
                                        :path="control.path"
                                        :enabled="control.enabled"
                                        :renderers="control.renderers"
                                        :cells="control.cells"
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </div>

                    <div v-else :class="styles.allOf.list">
                        <div :class="[styles.allOf.content, styles.allOf.top]">
                            <div
                                v-for="(info, idx) in allOfRenderInfos"
                                :key="`${control.path}-flat-${allOfRenderInfos.length}-${idx}`"
                                :class="styles.group.item"
                            >
                                <dispatch-renderer
                                    :schema="info.schema"
                                    :uischema="info.uischema"
                                    :path="control.path"
                                    :enabled="control.enabled"
                                    :renderers="control.renderers"
                                    :cells="control.cells"
                                />
                            </div>
                        </div>
                    </div>
                    
                </Fieldset>
            </control-wrapper>
        </template>
    </div>
</template>

<script lang="ts">
import {
    createCombinatorRenderInfos,
    findMatchingUISchema,
    CombinatorSubSchemaRenderInfo,
    ControlElement,
    UISchemaElement,
    isAllOfControl,
    JsonFormsRendererRegistryEntry,
    rankWith,
    update,
} from '@jsonforms/core'
import {
    DispatchRenderer,
    rendererProps,
    useJsonFormsAllOfControl,
    RendererProps,
} from '@jsonforms/vue'
import { defineComponent, ref, inject, watch } from 'vue'
import { usePrimeVueControl } from '../util'
import type { AllOfOptions } from '../util'
import { ControlWrapper } from '../controls'
import CombinatorProperties from './components/CombinatorProperties.vue'
import Fieldset from 'primevue/fieldset'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'

const controlRenderer = defineComponent({
    name: 'AllOfRenderer',
    components: {
        ControlWrapper,
        DispatchRenderer,
        CombinatorProperties,
        Fieldset,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel,
        Accordion,
        AccordionPanel,
        AccordionHeader,
        AccordionContent,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const input = useJsonFormsAllOfControl(props)
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
                    const allowEmpty = !!(input.control.value?.uischema?.options as AllOfOptions | undefined)?.allowEmpty
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
            ...usePrimeVueControl<typeof input, AllOfOptions>(input),
            selectedIndex,
        }
    },
    computed: {
        delegateUISchema(): UISchemaElement {
            return findMatchingUISchema(this.control.uischemas)(
                this.control.schema,
                this.control.uischema.scope,
                this.control.path
            )
        },
        allOfRenderInfos(): CombinatorSubSchemaRenderInfo[] {
            const result = createCombinatorRenderInfos(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.control.schema.allOf!,
                this.control.rootSchema,
                'allOf',
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
    tester: rankWith(3, isAllOfControl),
}
</script>


<style scoped>
/* Remove Fieldset legend gap when we render label above the Fieldset */
:deep(.no-legend-gap > .p-fieldset-legend) {
    display: none;
}
</style>
