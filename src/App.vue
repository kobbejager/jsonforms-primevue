<script setup>

/* 
    imports
*/

    import 'primeicons/primeicons.css';

    import { ref } from 'vue';

    import Button from 'primevue/button';

    import { examples } from '@/examples'
    import Navigation from '@/components/Navigation.vue';
    import ExampleForm from '@/components/ExamplesForm.vue';
    import AboutView from '@/components/AboutView.vue';
    import LicenceView from '@/components/LicenceView.vue';


/*
    top-level views
*/

    const view = ref('examples')

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

/*
    build metadata
*/

    const appVersion = __APP_VERSION__
    const buildDate = __BUILD_DATE__

</script>

<template>
    <div class="min-h-screen flex flex-col">
        <header class="border-b border-surface-200 bg-surface-0">
            <div class="container mx-auto flex items-center gap-4 px-4 py-3">
                <span class="text-lg font-bold text-surface-900 shrink-0">
                    jsonforms-primevue
                </span>
                <nav class="flex items-center gap-1 px-4">
                    <Button
                        label="About"
                        :text="view !== 'about'"
                        :severity="view === 'about' ? undefined : 'secondary'"
                        size="small"
                        @click="view = 'about'"
                    />
                    <Button
                        label="Examples"
                        :text="view !== 'examples'"
                        :severity="view === 'examples' ? undefined : 'secondary'"
                        size="small"
                        @click="view = 'examples'"
                    />
                    <Button
                        label="Licence"
                        :text="view !== 'licence'"
                        :severity="view === 'licence' ? undefined : 'secondary'"
                        size="small"
                        @click="view = 'licence'"
                    />
                </nav>
                <div class="ml-auto">
                    <Button
                        as="a"
                        href="https://github.com/kobbejager/jsonforms-primevue"
                        target="_blank"
                        rel="noopener noreferrer"
                        icon="pi pi-github"
                        text
                        rounded
                        severity="secondary"
                        aria-label="GitHub repository"
                    />
                </div>
            </div>
        </header>

        <main class="container mx-auto px-4 py-8 flex-1">
            <AboutView v-if="view === 'about'" />
            <LicenceView v-else-if="view === 'licence'" />
            <div v-else>
                <div class="flex gap-10">
                    <Navigation 
                        :items="items" 
                        @selectedItem="selectItem"
                    />
                    <div class="flex-1 min-w-0">
                        <h1 class="text-3xl text-black dark:text-white font-bold mb-6">
                            Examples - {{ selected.label }}
                        </h1>
                        <ExampleForm
                            :key="key"
                            :example="selected.example"
                        />
                    </div>
                </div>
            </div>
        </main>

        <footer class="border-t border-surface-200 bg-surface-0 mt-auto">
            <div class="container mx-auto px-4 py-4 text-sm text-surface-600 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <span> Source on <a
                    href="https://github.com/kobbejager/jsonforms-primevue"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="underline hover:text-surface-900"
                >GitHub</a></span>
                <span>Version {{ appVersion }} · Built {{ buildDate }}</span>
                <span>
                    Documentation licensed under
                    <a
                        href="https://creativecommons.org/publicdomain/zero/1.0/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="underline hover:text-surface-900"
                    >CC0 1.0</a>
                </span>
            </div>
        </footer>
    </div>
</template>

<style></style>
