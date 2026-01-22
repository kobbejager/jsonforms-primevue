<script setup>

/* 
    imports
*/

    import 'primeicons/primeicons.css';

    import { ref } from 'vue';

    import { examples } from '@/examples'
    import Navigation from '@/components/Navigation.vue';
    import ExampleForm from '@/components/ExamplesForm.vue';


/*
    navigation
*/

    const items = ref(examples);
    const selected = ref(examples[0])
    const key = ref(0)

    const selectItem = (item) => {
        key.value++
        selected.value = item
    };

</script>

<template>
    <main class="container mx-auto">
        <h1 class="text-4xl text-black dark:text-white font-bold text-center my-12">
            {{ selected.label }}
        </h1>
        <div class="flex gap-10">
            <Navigation 
                :items="items" 
                @selectedItem="selectItem"
            />
            <ExampleForm
                :key="key"
                :example="selected.example"
            />
        </div>
    </main>

</template>

<style></style>