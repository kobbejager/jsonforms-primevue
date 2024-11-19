<script setup>

/*
    imports
*/

    import { reactive } from "vue"
    import { JsonForms } from "@jsonforms/vue"
    import { primeVueRenderers } from "@/renderers"

    import Tabs from 'primevue/tabs';
    import TabList from 'primevue/tablist';
    import Tab from 'primevue/tab';
    import TabPanels from 'primevue/tabpanels';
    import TabPanel from 'primevue/tabpanel';

/* 
    props
*/

    const props = defineProps(['example', 'key'])
    // note: key is used to force remount the component (and jsonforms/ajv)

/*
    jsonforms parts
*/

    const renderers = [
        ...primeVueRenderers,
    ]

    const state = reactive({
        renderers: Object.freeze(renderers),    // freeze the renderers for performance gains
        data: props.example.data || {},
    })

    const onChange = (event) => {
        state.data = event.data
    }

</script>

<template>

    <div class="w-full h-screen">
        <Tabs value="form">
            <TabList>
                <Tab value="form">Form</Tab>
                <Tab value="schema">JSON Schema</Tab>
                <Tab value="ui">UI Schema</Tab>
                <Tab value="i18n">i18n Schema</Tab>
                <Tab value="data">Data</Tab>
            </TabList>

            <TabPanels>
                <TabPanel value="form">
                    <JsonForms 
                        :data="state.data" 
                        :renderers="state.renderers" 
                        :schema="props.example.schema" 
                        :uischema="props.example.uiSchema" 
                        @change="onChange" 
                    />
                </TabPanel>

                <TabPanel value="schema">
                    <div 
                        class="card font-mono text-sm"
                    >
                        <pre>{{ props.example.schema }}</pre>
                    </div>
                </TabPanel>

                <TabPanel value="ui">
                    <div 
                        v-if="props.example.uiSchema"
                        class="card font-mono text-sm"
                    >
                        <pre>{{ props.example.uiSchema }}</pre>
                    </div>
                    <div 
                        v-else 
                        class="italic"
                    >
                        Auto generated UI schema
                    </div>
                </TabPanel>

                <TabPanel value="i18n">
                    <div 
                        v-if="props.example.i18nSchema"
                        class="card font-mono text-sm"
                    >
                        <pre>{{ props.example.i18nSchema }}</pre>
                    </div>
                    <div
                        v-else
                        class="italic"
                    >
                        No i18n schema
                    </div>
                </TabPanel>

                <TabPanel value="data">
                    <div 
                        class="card font-mono text-sm"
                    >
                        <pre>{{ state.data }}</pre>
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>

</template>

<style scoped>
.card {
    background: #fff;
    border: 1px solid var(--p-surface-200);
    border-radius: 10px;
    padding: 1rem;
}
</style>