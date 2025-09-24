<script setup>

/* 
    imports
*/

    import Menu from 'primevue/menu';
    import { computed } from 'vue';

/* 
    props and emits
*/

    const props = defineProps(['items']);
    const emits = defineEmits(["selectedItem"]);

    const groups = computed(() => {
        const categoryToItems = new Map();
        (props.items || []).forEach((item) => {
            const category = item?.category || item?.label || 'Other';
            if (!categoryToItems.has(category)) {
                categoryToItems.set(category, []);
            }
            categoryToItems.get(category).push(item);
        });
        return Array.from(categoryToItems.entries()).map(([category, items]) => ({ category, items }));
    });

</script>

<template>
    <div >
        <div 
            v-for="group in groups" 
            :key="group.category" 
            class="mb-6"
        >
            <h3 class="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                {{ group.category }}
            </h3>
            <Menu :model="group.items">
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
    </div>
</template>