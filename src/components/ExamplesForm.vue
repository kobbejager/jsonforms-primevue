<script setup>

/*
    imports
*/

    import { reactive } from "vue"
    import { JsonForms } from "@jsonforms/vue"
    import { primeVueRenderers } from "@/renderers"

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
        <div>
            <JsonForms 
                :data="state.data" 
                :renderers="state.renderers" 
                :schema="props.example.schema" 
                :uischema="props.example.uiSchema" 
                @change="onChange" 
            />
        </div>

        <h2 class="py-6 text-2xl font-bold text-center">
            Form data
        </h2>

        <pre>{{ props.example.schema }}</pre>
        <pre>{{ state.data }}</pre>
    </div>

</template>

<style></style>