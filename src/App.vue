<script setup>

import 'primeicons/primeicons.css'

import { reactive } from "vue"
import { JsonForms } from "@jsonforms/vue"
import { primeVueRenderers } from "./renderers"


//import { entry as customRenderer } from './renderers/StringControlRenderer2.vue'

const renderers = [
    ...primeVueRenderers,
    // here you can add custom renderers
    //customRenderer,
]

const schema = {
    properties: {
        name: {
            type: "string",
            minLength: 1,
            description: "The task's name"
        },
        description: {
            title: "Long Description",
            type: "string",
        },
        done: {
            type: "boolean",
        },
        dueDate: {
            type: "string",
            format: "date",
            description: "The task's due date"
        },
        rating: {
            type: "integer",
            maximum: 5,
        },
        recurrence: {
            type: "string",
            enum: ["Never", "Daily", "Weekly", "Monthly"]
        },
        recurrenceInterval: {
            type: "number",
            description: "Days until recurrence"
        },
    },
}

const uischema = {
    type: "HorizontalLayout",
    elements: [
        {
            type: "VerticalLayout",
            elements: [
                {
                    type: "Control",
                    scope: "#/properties/name",
                },
                {
                    type: "Control",
                    scope: "#/properties/description",
                    options: {
                        multi: true,
                    }
                },
                {
                    type: "Control",
                    scope: "#/properties/done",
                },
            ],
        },
        {
            type: "VerticalLayout",
            elements: [
                {
                    type: "Control",
                    scope: "#/properties/dueDate",
                },
                {
                    type: "Control",
                    scope: "#/properties/rating",
                },
                {
                    type: "Control",
                    scope: "#/properties/recurrence",
                },
                {
                    type: "Control",
                    scope: "#/properties/recurrenceInterval",
                },
            ],
        },
    ],
}

const defaultData = {
    name: "Send email to Adrian",
    description: "Confirm if you have passed the subject\nHereby ...",
    done: true,
    recurrence: "Daily",
    rating: 3,
}

const state = reactive({
    renderers: Object.freeze(renderers),    // freeze the renderers for performance gains
    data: defaultData,
    //schema: schema,       // apparently not required to be reactive
    //uischema: uischema,   // apparently not required to be reactive
})

const onChange = (event) => {
    state.data = event.data
}
</script>

<template>
    <div class="flex flex-col h-screen">
        <main class="container w-full m-12">

            <h1 class="text-4xl text-black dark:text-white font-bold text-center">Tailwind CSS + PrimeVue</h1>

            <!-- jsonforms example -->

            <div>
                <json-forms :data="state.data" :renderers="state.renderers" :schema="schema" :uischema="uischema" @change="onChange" />
            </div>

            <pre>{{ state.data }}</pre>

            <!-- primevue example -->

            <h2 class="py-6 text-2xl font-bold text-center">
                Some PrimeVue/ Tailwind CSS tests
            </h2>
            
            <Button icon="pi pi-home" aria-label="Save" class="mr-2" />
            <Button label="Profile" icon="pi pi-user" class="mr-2"/>
            <Button label="Save" icon="pi pi-check" iconPos="right" class="mr-2" />
            <Button label="Search" icon="pi pi-search" iconPos="top" class="mr-2" />
            <Button label="Update" icon="pi pi-refresh" iconPos="bottom" />

            <InputGroup class="my-2">
                <Button label="Save" icon="pi pi-check" severity="success"/>
                <Button label="Delete" icon="pi pi-trash" severity="danger" />
                <Button label="Cancel" icon="pi pi-times" />
            </InputGroup>

            <Button label="Primary" outlined class="mr-2" />
            <Button label="Danger" severity="danger" outlined />

            <InputNumber 
                inputId="integeronly"
                showButtons 
                d_modelValue="123"
                fluid
                class="p-2" 
            />
        </main>
    </div>

</template>

<style></style>