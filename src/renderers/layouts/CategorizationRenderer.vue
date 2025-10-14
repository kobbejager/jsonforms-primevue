<template>
    <div :class="styles.categorization.root">
        <Tabs v-if="visibleCategories.length > 0" v-model:value="selected">
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
import type { LayoutOptions } from "../util"
import Tabs from "primevue/tabs"
import TabList from "primevue/tablist"
import Tab from "primevue/tab"
import TabPanels from "primevue/tabpanels"
import TabPanel from "primevue/tabpanel"

const layoutRenderer = defineComponent({
    name: "CategorizationRenderer",
    components: {
        DispatchRenderer,
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
            LayoutOptions
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
    },
})

export default layoutRenderer
export const entry: JsonFormsRendererRegistryEntry = {
    renderer: layoutRenderer,
    tester: rankWith(2, and(isCategorization, categorizationHasCategory)),
}
</script>
