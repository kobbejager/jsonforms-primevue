<script setup>

/* 
    imports
*/

    import Menu from 'primevue/menu';

/* 
    props and emits
*/

    const props = defineProps(['items']);
    const emits = defineEmits(["selectedItem"]);

</script>

<template>
    <div >
        <Menu :model="items">
            <template #item="{ item, props }">
                <a 
                    class="flex items-center" 
                    v-bind="props.action" 
                    @click="$emit('selectedItem', item)"
                >
                    <span>{{ item.label }}</span>
                </a>
            </template>
        </Menu>
    </div>
</template>