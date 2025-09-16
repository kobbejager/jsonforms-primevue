<script setup>

/*
    imports
*/

    import { reactive, ref, watch } from "vue"
    import { JsonForms } from "@jsonforms/vue"
    import { primeVueRenderers } from "@/renderers"

    import Textarea from 'primevue/textarea';
    import Button from 'primevue/button';
    import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

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

/*
    live schema editing
*/

    const formKey = ref(0)
    const liveSchema = ref(JSON.parse(JSON.stringify(props.example.schema || {})))
    const editedSchemaText = ref(JSON.stringify(liveSchema.value, null, 2))
    const schemaError = ref('')

    const applySchema = () => {
        schemaError.value = ''
        try {
            const parsed = JSON.parse(editedSchemaText.value)
            if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
                schemaError.value = 'Schema must be a JSON object'
                return
            }
            liveSchema.value = parsed
            formKey.value++
        } catch (e) {
            schemaError.value = `Invalid JSON: ${e.message}`
        }
    }

    const resetSchema = () => {
        schemaError.value = ''
        liveSchema.value = JSON.parse(JSON.stringify(props.example.schema || {}))
        editedSchemaText.value = JSON.stringify(liveSchema.value, null, 2)
        formKey.value++
    }

    // When the example changes (component may be remounted already), initialize editor state
    watch(
        () => props.example,
        () => {
            liveSchema.value = JSON.parse(JSON.stringify(props.example.schema || {}))
            editedSchemaText.value = JSON.stringify(liveSchema.value, null, 2)
            schemaError.value = ''
            formKey.value = 0
        }
    )

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
                        :key="formKey"
                        :data="state.data" 
                        :renderers="state.renderers" 
                        :schema="liveSchema" 
                        :uischema="props.example.uiSchema" 
                        @change="onChange" 
                    />
                </TabPanel>

                <TabPanel value="schema">
                    <div 
                        class="card"
                    >
                        <div class="flex flex-col gap-3">
                            <VueMonacoEditor
                                v-model:value="editedSchemaText"
                                language="json"
                                theme="vs"
                                :options="{ automaticLayout: true, minimap: { enabled: false }, formatOnPaste: true, formatOnType: true }"
                                className="w-full h-[480px]"
                            />
                            <div class="flex gap-2">
                                <Button 
                                    label="Apply schema" 
                                    icon="pi pi-check" 
                                    @click="applySchema" 
                                />
                                <Button 
                                    label="Reset to example" 
                                    icon="pi pi-refresh" 
                                    severity="secondary" 
                                    @click="resetSchema" 
                                />
                            </div>
                            <div 
                                v-if="schemaError" 
                                class="text-red-600 text-sm"
                            >
                                {{ schemaError }}
                            </div>
                        </div>
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