<script setup>

/*
    imports
*/

    import { reactive, ref, watch, computed } from "vue"
    import { JsonForms } from "@jsonforms/vue"
    import { primeVueRenderers } from "@/renderers"
    import { generateDefaultUISchema } from '@jsonforms/core'
    import isEqual from 'lodash/isEqual'

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

    // JSON schema button visibility helpers
    const parsedEditedSchema = computed(() => {
        try {
            if (!editedSchemaText.value || editedSchemaText.value.trim() === '') {
                return undefined
            }
            const parsed = JSON.parse(editedSchemaText.value)
            if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
                return undefined
            }
            return parsed
        } catch {
            return undefined
        }
    })

    const isApplySchemaVisible = computed(() => {
        const parsed = parsedEditedSchema.value
        if (!parsed) return false
        return !isEqual(parsed, liveSchema.value)
    })

    const isResetSchemaVisible = computed(() => {
        return !isEqual(liveSchema.value, props.example.schema || {})
    })

    // When the example changes (component may be remounted already), initialize editor state
    watch(
        () => props.example,
        () => {
            liveSchema.value = JSON.parse(JSON.stringify(props.example.schema || {}))
            editedSchemaText.value = JSON.stringify(liveSchema.value, null, 2)
            schemaError.value = ''
            formKey.value = 0
            // reset UI schema editor state on example change
            liveUiSchema.value = props.example.uiSchema ? JSON.parse(JSON.stringify(props.example.uiSchema)) : null
            editedUiSchemaText.value = props.example.uiSchema ? JSON.stringify(liveUiSchema.value, null, 2) : ''
            uiSchemaError.value = ''
        }
    )

/*
    UI schema editing
*/

    const liveUiSchema = ref(props.example.uiSchema ? JSON.parse(JSON.stringify(props.example.uiSchema)) : null)
    const editedUiSchemaText = ref(liveUiSchema.value ? JSON.stringify(liveUiSchema.value, null, 2) : '')
    const uiSchemaError = ref('')

    const generateUiSchema = () => {
        uiSchemaError.value = ''
        try {
            const ui = generateDefaultUISchema(liveSchema.value)
            liveUiSchema.value = ui
            editedUiSchemaText.value = JSON.stringify(ui, null, 2)
            formKey.value++
        } catch (e) {
            uiSchemaError.value = `Failed to generate UI schema: ${e.message}`
        }
    }

    const applyUiSchema = () => {
        uiSchemaError.value = ''
        try {
            if (!editedUiSchemaText.value || editedUiSchemaText.value.trim() === '') {
                // treat empty as removing override
                liveUiSchema.value = null
                formKey.value++
                return
            }
            const parsed = JSON.parse(editedUiSchemaText.value)
            if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
                uiSchemaError.value = 'UI Schema must be a JSON object'
                return
            }
            liveUiSchema.value = parsed
            formKey.value++
        } catch (e) {
            uiSchemaError.value = `Invalid JSON: ${e.message}`
        }
    }

    const resetUiSchema = () => {
        uiSchemaError.value = ''
        liveUiSchema.value = props.example.uiSchema ? JSON.parse(JSON.stringify(props.example.uiSchema)) : null
        editedUiSchemaText.value = liveUiSchema.value ? JSON.stringify(liveUiSchema.value, null, 2) : ''
        formKey.value++
    }

    const removeUiSchemaOverride = () => {
        uiSchemaError.value = ''
        liveUiSchema.value = null
        editedUiSchemaText.value = ''
        formKey.value++
    }

    // UI schema button visibility helpers
    const parsedEditedUiSchema = computed(() => {
        try {
            if (!editedUiSchemaText.value || editedUiSchemaText.value.trim() === '') {
                return undefined
            }
            const parsed = JSON.parse(editedUiSchemaText.value)
            if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
                return undefined
            }
            return parsed
        } catch {
            return undefined
        }
    })

    const isApplyUiVisible = computed(() => {
        const parsed = parsedEditedUiSchema.value
        if (!parsed) return false
        return !isEqual(parsed, liveUiSchema.value)
    })

    const isResetUiVisible = computed(() => {
        if (!props.example.uiSchema) return false
        if (liveUiSchema.value === null) return true
        return !isEqual(liveUiSchema.value, props.example.uiSchema)
    })

    const isRemoveOverrideVisible = computed(() => liveUiSchema.value !== null)

    const isGenerateUiVisible = computed(() => {
        return liveUiSchema.value === null || !editedUiSchemaText.value || editedUiSchemaText.value.trim() === ''
    })

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
                        :uischema="liveUiSchema || undefined" 
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
                                    v-if="isApplySchemaVisible"
                                    label="Apply schema" 
                                    icon="pi pi-check" 
                                    @click="applySchema" 
                                />
                                <Button 
                                    v-if="isResetSchemaVisible"
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
                    <div class="card">
                        <div class="flex flex-col gap-3">
                            <VueMonacoEditor
                                v-model:value="editedUiSchemaText"
                                language="json"
                                theme="vs"
                                :options="{ automaticLayout: true, minimap: { enabled: false }, formatOnPaste: true, formatOnType: true }"
                                className="w-full h-[360px]"
                            />
                            <div class="flex flex-wrap items-center gap-2">
                                <Button 
                                    v-if="isGenerateUiVisible"
                                    label="Generate from JSON Schema" 
                                    icon="pi pi-sparkles" 
                                    severity="secondary" 
                                    @click="generateUiSchema" 
                                />
                                <Button 
                                    v-if="isApplyUiVisible"
                                    label="Apply schema" 
                                    icon="pi pi-check" 
                                    @click="applyUiSchema" 
                                />
                                <Button 
                                    v-if="isResetUiVisible"
                                    label="Reset to example" 
                                    icon="pi pi-refresh" 
                                    severity="secondary" 
                                    @click="resetUiSchema" 
                                />
                                <Button 
                                    v-if="isRemoveOverrideVisible"
                                    label="Remove override" 
                                    icon="pi pi-times" 
                                    severity="danger" 
                                    @click="removeUiSchemaOverride" 
                                />
                            </div>
                            <div 
                                v-if="uiSchemaError" 
                                class="text-red-600 text-sm"
                            >
                                {{ uiSchemaError }}
                            </div>
                        </div>
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