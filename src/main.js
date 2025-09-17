import './style.css'

import { createApp } from "vue";

import PrimeVue from "primevue/config";
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { loader } from '@guolao/vue-monaco-editor'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import App from './App.vue';


const app = createApp(App);

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{lime.50}',
            100: '{lime.100}',
            200: '{lime.200}',
            300: '{lime.300}',
            400: '{lime.400}',
            500: '{lime.500}',
            600: '{lime.600}',
            700: '{lime.700}',
            800: '{lime.800}',
            900: '{lime.900}',
            950: '{lime.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                }
            }
        }
    }
});



app.use(PrimeVue, { 
    theme: {
        preset: MyPreset,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark',
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
    }
});

// Configure Monaco workers for Vite
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

loader.config({ monaco })

app.mount('#app');