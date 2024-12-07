<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { classes, Styles } from '../styles';

import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import Fieldset from 'primevue/fieldset';

const listItem = defineComponent({
    name: 'ArrayListElement',
    components: {
        Button,
        ButtonGroup,
        Fieldset,
    },
    props: {
        initiallyExpanded: {
            required: false,
            type: Boolean,
            default: true,
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
            expanded: this.initiallyExpanded,
        };
    },
    computed: {
        contentClasses(): string {
            return classes`${this.styles.arrayList.itemContent} ${this.expanded && this.styles.arrayList.itemExpanded
                }`;
        },
    },
    methods: {
        expandClicked(): void {
            this.expanded = !this.expanded;
        },
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
    <Fieldset 
        :class="styles.arrayList.item"
    >
        <template #legend>
            <div :class="styles.arrayList.itemLabel" @click="expandClicked">
                {{ label }}&nbsp;&nbsp;
                <span v-if="expanded" class="pi pi-eye"></span>
                <span v-else class="pi pi-eye-slash"></span>
            </div>
        </template>
        <div v-if="expanded" :class="this.styles.arrayList.itemContent">
            <slot></slot>
        </div>
        <div :class="styles.arrayList.itemToolbar + (expanded ? ' ' + styles.arrayList.itemToolbarExpanded : '')">
            <div class="grow"></div>
            <ButtonGroup>
                <Button 
                    :disabled="!moveUpEnabled" 
                    :class="styles.arrayList.itemMoveUp" 
                    type="button"
                    icon="pi pi-sort-up-fill"
                    severity="secondary" 
                    outlined
                    @click="moveUpClicked"
                />
                <Button 
                    :disabled="!moveDownEnabled" 
                    :class="styles.arrayList.itemMoveDown" 
                    type="button"
                    icon="pi pi-sort-down-fill"
                    severity="secondary" 
                    outlined
                    @click="moveDownClicked"
                />
            </ButtonGroup>
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
    </Fieldset>
</template>