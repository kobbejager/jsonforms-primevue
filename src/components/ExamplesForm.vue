<script setup>

/*
    imports
*/

    import { ref, reactive } from "vue"
    import { JsonForms } from "@jsonforms/vue"
    import { primeVueRenderers } from "@/renderers"
import { input } from "@/examples/strings";

/* 
    props
*/

    const props = defineProps(['input'])

/*
    jsonforms parts
*/

    const renderers = [
        ...primeVueRenderers,
    ]

    const state = reactive({
        renderers: Object.freeze(renderers),    // freeze the renderers for performance gains
        data: input.data || {},
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
                    :schema="props.input.schema" 
                    :uischema="props.input.uiSchema" 
                    @change="onChange" 
                />
            </div>

            <h2 class="py-6 text-2xl font-bold text-center">
                Form data
            </h2>

            <pre>{{ props.input.schema }}</pre>
            <pre>{{ state.data }}</pre>


    </div>

</template>

<style></style>