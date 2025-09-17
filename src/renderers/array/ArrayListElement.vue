<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Styles } from '../styles';

import Button from 'primevue/button';
import Fieldset from 'primevue/fieldset';

const listItem = defineComponent({
    name: 'ArrayListElement',
    components: {
        Button,
        Fieldset,
    },
    props: {
        initiallyExpanded: {
            required: false,
            type: Boolean,
            default: true,
        },
        sortable: {
            required: false,
            type: Boolean,
            default: false,
        },
        label: {
            required: false,
            type: String,
            default: '',
        },
        moveUpEnabled: {
            required: false,
            type: Boolean,
            default: true,
        },
        moveDownEnabled: {
            required: false,
            type: Boolean,
            default: true,
        },
        moveUp: {
            required: false,
            type: Function,
            default: undefined,
        },
        moveDown: {
            required: false,
            type: Function,
            default: undefined,
        },
        deleteEnabled: {
            required: false,
            type: Boolean,
            default: true,
        },
        delete: {
            required: false,
            type: Function,
            default: undefined,
        },
        styles: {
            required: true,
            type: Object as PropType<Styles>,
        },
    },
    data() {
        return {
            collapsed: !this.initiallyExpanded,
        };
    },
    computed: {},
    methods: {
        moveUpClicked(event: Event): void {
            event.stopPropagation();
            this.moveUp?.();
        },
        moveDownClicked(event: Event): void {
            event.stopPropagation();
            this.moveDown?.();
        },
        deleteClicked(event: Event): void {
            event.stopPropagation();
            this.delete?.();
        },
    },
});

export default listItem;
</script>

<template>
    <div class="flex items-stretch w-full gap-2">
        <Fieldset 
            :class="styles.arrayList.item + ' grow self-stretch'"
            :legend="label"
            toggleable
            v-model:collapsed="collapsed"
        >
            <div :class="this.styles.arrayList.itemContent">
                <slot></slot>
            </div>
        </Fieldset>
        <div :class="styles.arrayList.itemToolbar + ' self-stretch flex flex-col justify-end gap-2'">
            <Button 
                v-if="sortable && !collapsed"
                :disabled="!moveUpEnabled"
                :class="styles.arrayList.itemMoveUp" 
                type="button"
                icon="pi pi-sort-up-fill"
                severity="secondary" 
                outlined
                @click="moveUpClicked"
            />
            <Button 
                v-if="sortable && !collapsed"
                :disabled="!moveDownEnabled"
                :class="styles.arrayList.itemMoveDown" 
                type="button"
                icon="pi pi-sort-down-fill"
                severity="secondary" 
                outlined
                @click="moveDownClicked"
            />
            <Button 
                :disabled="!deleteEnabled" 
                :class="styles.arrayList.itemDelete" 
                type="button"
                icon="pi pi-times"
                severity="secondary" 
                outlined
                @click="deleteClicked">
            </Button>
        </div>
    </div>
</template>