<script setup>

import 'primeicons/primeicons.css'

import { reactive } from "vue"
import { JsonForms } from "@jsonforms/vue"
import { primeVueRenderers } from "./renderers"


const renderers = [
    ...primeVueRenderers,
    // here you can add custom renderers
    //customRenderer,
]

const schema = {
    type: "object",
    required: ["string_field"],
    properties: {
        string_field: {
            title: "String field",
            description: "A required text field between 1 and 10 characters",
            type: "string",
            minLength: 1,
            maxLength: 10
        },
        string_field_with_default: {
            title: "String field with default value",
            description: "An optional text field with a default value",
            type: "string",
            default: "Default value"
        },
        string_field_with_examples: {
            title: "String field with examples",
            description: "An optional text field with examples defined in the schema",
            type: "string",
            examples: ["Example 1", "Example 2", "Example 3"],
        },
        string_field_with_suggestions: {
            title: "String field with suggestions",
            description: "An optional text field with examples defined in the schema",
            type: "string"
        },
        textarea_field1: {
            title: "Textarea field 1",
            description: "An optional text field defined as textarea in the schema",
            type: "string",
            format: "textarea"
        },
        textarea_field2: {
            title: "Textarea field 2",
            description: "An optional text field defined as textarea in the uischema",
            type: "string",
        },
        textarea_field_with_default: {
            title: "Textarea field with default value",
            description: "An optional text field with a default value  in the schema",
            type: "string",
            format: "textarea",
            default: "Default value"
        },
        number_field: {
            title: "Number field",
            description: "A number field restricted to values between 0 and 1",
            type: "number",
            minimum: 0,
            maximum: 1
        },
        integer_field: {
            title: "Integer field",
            description: "An integer field restricted to values between 0 and 100",
            type: "integer",
            minimum: 0,
            maximum: 100
        },
        integer_field_with_default: {
            title: "Integer field with default value",
            description: "An integer field with a default value",
            type: "integer",
            default: 10
        },
        boolean_field: {
            title: "Boolean field",
            description: "A boolean field, rendered as a checkbox",
            type: "boolean"
        },
        boolean_field_with_default: {
            title: "Boolean field with default value",
            description: "A boolean field, rendered as a checkbox, with a default value",
            type: "boolean",
            default: true
        },
        date_field: {
            title: "Date field",
            description: "A date field",
            type: "string",
            format: "date",
        },
        time_field: {
            title: "Time field",
            description: "A time field",
            type: "string",
            format: "time",
        },
        date_time_field: {
            title: "Date-time field",
            description: "A date time field",
            type: "string",
            format: "date-time",
        },
        enum_field: {
            title: "Enum field",
            description: "An enum field",
            type: "string",
            enum: ["Option 1", "Option 2", "Option 3"]
        },
        enum_field_with_default: {
            title: "Enum field with default value",
            description: "An enum field with a default value",
            type: "string",
            enum: ["Option 1", "Option 2", "Option 3"],
            default: "Option 1"
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
                    scope: "#/properties/string_field",
                },
                {
                    type: "Control", 
                    scope: "#/properties/string_field_with_default" 
                },
                { 
                    type: "Control", 
                    scope: "#/properties/string_field_with_examples" 
                },
                { 
                    type: "Control", 
                    scope: "#/properties/string_field_with_suggestions",
                    options: {
                        suggestion: [
                            "Suggestion 1",
                            "Suggestion 2",
                            "Suggestion 3"
                        ]
                    }
                },
                {
                    type: "Control",
                    scope: "#/properties/textarea_field1",
                },
                {
                    type: "Control",
                    scope: "#/properties/textarea_field2",
                    options: {
                        multi: true,
                    }
                },
                { 
                    type: "Control", 
                    scope: "#/properties/textarea_field_with_default"
                }
            ],
        },
        {
            type: "VerticalLayout",
            elements: [
                { 
                    type: "Control", 
                    scope: "#/properties/number_field"
                },
                { 
                    type: "Control", 
                    scope: "#/properties/integer_field"
                },
                { 
                    type: "Control", 
                    scope: "#/properties/integer_field_with_default"
                },
                { 
                    type: "Control", 
                    scope: "#/properties/boolean_field"
                },
                {
                    type: "Control", 
                    scope: "#/properties/boolean_field_with_default"
                }
            ],
        },
        {
            type: "VerticalLayout",
            elements: [
                { 
                    type: "Control", 
                    scope: "#/properties/date_field"
                },
                { 
                    type: "Control", 
                    scope: "#/properties/date_time_field"
                },
                { 
                    type: "Control", 
                    scope: "#/properties/time_field"
                },
            ],
        },
        {
            type: "VerticalLayout",
            elements: [
                { 
                    type: "Control", 
                    scope: "#/properties/enum_field"
                },
                { 
                    type: "Control", 
                    scope: "#/properties/enum_field_with_default"
                }
            ],
        }
    ],
}

const defaultData = {}

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
            <h1 class="text-4xl text-black dark:text-white font-bold text-center">PrimeVue + JsonForms</h1>

            <div>
                <json-forms :data="state.data" :renderers="state.renderers" :schema="schema" :uischema="uischema" @change="onChange" />
            </div>

            <h2 class="py-6 text-2xl font-bold text-center">
                Form data
            </h2>
            
            <pre>{{ state.data }}</pre>

        </main>
    </div>

</template>

<style></style>