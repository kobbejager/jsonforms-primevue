<script lang="ts">

import 'primeicons/primeicons.css'

import { defineComponent } from "vue"
import { JsonForms, type JsonFormsChangeEvent } from "@jsonforms/vue"
import { vanillaRenderers } from "@jsonforms/vue-vanilla"


const renderers = [
    ...vanillaRenderers,
    // here you can add custom renderers
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
            type: "integer",
            description: "Days until recurrence"
        },
    },
};

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
};

export default defineComponent({
    name: "App",
    components: {
        JsonForms,
    },
    data() {
        return {
            // freeze renderers for performance gains
            renderers: Object.freeze(renderers),
            data: {
                name: "Send email to Adrian",
                description: "Confirm if you have passed the subject\nHereby ...",
                done: true,
                recurrence: "Daily",
                rating: 3,
            },
            schema,
            uischema,
        };
    },
    methods: {
        onChange(event: JsonFormsChangeEvent) {
            this.data = event.data;
        },
    }
});
</script>

<template>
    <div class="flex flex-col h-screen">
        <main class="container m-4 xl:mx-64">

            <img alt="Vue logo" src="./assets/logo.svg" width="75" height="75" />
            <h1>JSON Forms Vue 3</h1>

            <!-- jsonforms example -->

            <div>
                <json-forms :data="data" :renderers="renderers" :schema="schema" :uischema="uischema" @change="onChange" />
            </div>

            <!-- primevue example -->

            <h2 class="py-6 text-2xl font-bold text-center">
                Services
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

            <div class="bg-surface-100 dark:bg-surface-900 flex items-center justify-center p-10">
                <section class="bg-white dark:bg-gray-800 p-10 rounded-xl flex flex-col gap-8 max-w-3xl">
                    <h1 class="text-4xl text-black dark:text-white font-bold text-center">Tailwind CSS + PrimeVue</h1>
                    <Panel header="Default Preset">
                        <p>First panel component uses the global pass through preset from Lara.</p>
                    </Panel>

                    <Panel
                        header="Custom Header"
                        :pt="{
                            header: 'p-5 flex items-center justify-between border border-indigo-300 bg-indigo-500 text-indigo-50 rounded-tl-lg rounded-tr-lg dark:bg-indigo-900 dark:border-indigo-900/40 dark:text-white/80',
                        }"
                    >
                        <p>Second panel overrides the header section with custom a custom style.</p>
                    </Panel>

                    <Panel
                        header="Custom Design"
                        :ptOptions="{ mergeSections: false }"
                        :pt="{
                            header: 'flex items-center justify-center p-5 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 rounded-tl-2xl rounded-tr-2xl text-white',
                            title: 'leading-none font-bold uppercase text-2xl',
                            content:
                                'bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 px-5 pb-8 pt-3 text-white text-center rounded-bl-2xl rounded-br-2xl text-xl',
                        }"
                    >
                        <p>
                            Third panel ignores the default preset with
                            <b>mergeSections: false</b> and applies a custom style to all elements of the panel instead.
                        </p>
                    </Panel>
                </section>
            </div>
        </main>
    </div>

</template>

<style></style>