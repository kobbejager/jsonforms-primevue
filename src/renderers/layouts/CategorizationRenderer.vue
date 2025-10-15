<template>
    <div :class="styles.categorization.root">
        <!-- Accordion variant -->
        <div v-if="appliedOptions?.variant === 'accordion'">
            <Accordion v-if="visibleCategories.length > 0" :multiple="true">
                <AccordionPanel
                    v-for="(category, index) in visibleCategories"
                    :key="`category-acc-${index}`"
                    :value="index"
                >
                    <AccordionHeader>
                        {{ category.value.label }}
                    </AccordionHeader>
                    <AccordionContent>
                        <div :class="styles.categorization.panel">
                            <DispatchRenderer
                                :schema="layout.schema"
                                :uischema="category.value.uischema"
                                :path="layout.path"
                                :enabled="layout.enabled"
                                :renderers="layout.renderers"
                                :cells="layout.cells"
                            />
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>

        <!-- Stepper variant -->
        <div v-else-if="appliedOptions?.variant === 'stepper'">
            <Stepper 
                v-if="visibleCategories.length > 0" 
                v-model:value="stepperValue" 
                :class="styles.categorization.contentStepper"
            >
                <StepList>
                    <Step
                        v-for="(category, index) in visibleCategories"
                        :key="`category-step-${index}`"
                        :value="String(index + 1)"
                        :disabled="!category.value.enabled"
                    >
                        {{ category.value.label }}
                    </Step>
                </StepList>
                <StepPanels>
                    <StepPanel
                        v-for="(category, index) in visibleCategories"
                        :key="`category-step-panel-${index}`"
                        :value="String(index + 1)"
                        v-slot="{ activateCallback }"
                    >
                        <div :class="styles.categorization.panel">
                            <DispatchRenderer
                                :schema="layout.schema"
                                :uischema="category.value.uischema"
                                :path="layout.path"
                                :enabled="layout.enabled"
                                :renderers="layout.renderers"
                                :cells="layout.cells"
                            />
                        </div>
                        <footer :class="styles.categorization.stepperFooter">
                            <div class="flex justify-end mt-8">
                                <ButtonGroup>
                                    <Button 
                                        icon="pi pi-angle-left" 
                                        severity="secondary"
                                        outlined
                                        :disabled="index === 0 || !visibleCategories[index - 1]?.value?.enabled"
                                        @click="activateCallback(String(index))"
                                        aria-label="Back"
                                    />
                                    <Button 
                                        icon="pi pi-angle-right" 
                                        severity="secondary"
                                        outlined
                                        :disabled="index + 1 >= visibleCategories.length || !visibleCategories[index + 1]?.value?.enabled"
                                        @click="activateCallback(String(index + 2))"
                                        aria-label="Next"
                                    />
                                </ButtonGroup>
                            </div>
                        </footer>
                    </StepPanel>
                </StepPanels>
            </Stepper>
        </div>

        <!-- Tabs (default) variant -->
        <Tabs v-else-if="visibleCategories.length > 0" v-model:value="selected">
            <TabList :class="styles.categorization.category">
                <Tab
                    v-for="(category, index) in visibleCategories"
                    :key="`category-${index}`"
                    :value="index"
                    :disabled="!category.value.enabled"
                >
                    {{ category.value.label }}
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel
                    v-for="(category, index) in visibleCategories"
                    :key="`category-panel-${index}`"
                    :value="index"
                >
                    <div :class="styles.categorization.panel">
                        <DispatchRenderer
                            :schema="layout.schema"
                            :uischema="category.value.uischema"
                            :path="layout.path"
                            :enabled="layout.enabled"
                            :renderers="layout.renderers"
                            :cells="layout.cells"
                        />
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import type { JsonFormsRendererRegistryEntry, Layout } from "@jsonforms/core"
import {
    and,
    categorizationHasCategory,
    isCategorization,
    rankWith,
} from "@jsonforms/core"
import {
    DispatchRenderer,
    rendererProps,
    useJsonFormsCategorization,
    type RendererProps,
} from "@jsonforms/vue"
import { usePrimeVueLayout } from "../util"
import type { CategorizationOptions } from "../util"
import Accordion from "primevue/accordion"
import AccordionPanel from "primevue/accordionpanel"
import AccordionHeader from "primevue/accordionheader"
import AccordionContent from "primevue/accordioncontent"
import Stepper from "primevue/stepper"
import StepList from "primevue/steplist"
import StepPanels from "primevue/steppanels"
import Step from "primevue/step"
import StepPanel from "primevue/steppanel"
import Button from "primevue/button"
import ButtonGroup from "primevue/buttongroup"
import Tabs from "primevue/tabs"
import TabList from "primevue/tablist"
import Tab from "primevue/tab"
import TabPanels from "primevue/tabpanels"
import TabPanel from "primevue/tabpanel"

const layoutRenderer = defineComponent({
    name: "CategorizationRenderer",
    components: {
        DispatchRenderer,
        Accordion,
        AccordionPanel,
        AccordionHeader,
        AccordionContent,
        Stepper,
        StepList,
        StepPanels,
        Step,
        StepPanel,
        Button,
        ButtonGroup,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel,
    },
    props: {
        ...rendererProps<Layout>(),
    },
    setup(props: RendererProps<Layout>) {
        return usePrimeVueLayout<
            ReturnType<typeof useJsonFormsCategorization>,
            CategorizationOptions
        >(useJsonFormsCategorization(props))
    },
    data() {
        return {
      selected: 0,
        }
    },
    computed: {
        visibleCategories() {
            return this.categories.filter((c: any) => c.value.visible)
        },
        stepperValue: {
            get(): string {
                    return String(this.selected + 1)
            },
            set(v: string) {
                    const num = Number(v)
                    if (!Number.isNaN(num)) this.selected = Math.max(0, num - 1)
            },
        },
    },
})

export default layoutRenderer
export const entry: JsonFormsRendererRegistryEntry = {
    renderer: layoutRenderer,
    tester: rankWith(2, and(isCategorization, categorizationHasCategory)),
}
</script>
