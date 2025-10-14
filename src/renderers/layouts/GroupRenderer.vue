<template>
    <div v-if="layout.visible" :class="styles.group.root">
        <label v-if="layout.label" :class="styles.control.label">
            {{ layout.label }}
        </label>
        <div v-if="groupDescription" :class="styles.control.description">
            {{ groupDescription }}
        </div>
        <Fieldset class="no-legend-gap">
            <div :class="[styles.group.content, styles.group.contentTop]">
                <div
                    v-for="(element, index) in layout.uischema.elements"
                    :key="`${layout.path}-${index}`"
                    :class="styles.group.item"
                >
                    <dispatch-renderer
                        :schema="layout.schema"
                        :uischema="element"
                        :path="layout.path"
                        :enabled="layout.enabled"
                        :renderers="layout.renderers"
                        :cells="layout.cells"
                    />
                </div>
            </div>
        </Fieldset>
    </div>
</template>

<script lang="ts">
import {
    JsonFormsRendererRegistryEntry,
    Layout,
    rankWith,
    and,
    isLayout,
    uiTypeIs,
} from '@jsonforms/core'
import { defineComponent, computed } from 'vue'
import {
    DispatchRenderer,
    rendererProps,
    useJsonFormsLayout,
    RendererProps,
} from '@jsonforms/vue'
import { usePrimeVueLayout } from '../util'
import type { GroupOptions } from '../util'
import { Resolve } from '@jsonforms/core'
import Fieldset from 'primevue/fieldset'

const layoutRenderer = defineComponent({
    name: 'GroupRenderer',
    components: {
        DispatchRenderer,
        Fieldset,
    },
    props: {
        ...rendererProps<Layout>(),
    },
    setup(props: RendererProps<Layout>) {
        const base = useJsonFormsLayout(props)
        const model = usePrimeVueLayout<typeof base, GroupOptions>(base)
        const groupDescription = computed(() => {
            const uiDesc = (model as any).appliedOptions?.value?.description
            if (uiDesc) return uiDesc
            const schemaDesc = (base as any).layout?.value?.schema?.description
            if (schemaDesc) return schemaDesc
            let scope =
                (model as any).appliedOptions?.value?.scope ||
                (base as any).layout?.value?.uischema?.scope
            // Derive parent object scope from first child control if scope not provided
            if (!scope) {
                const elements = ((base as any).layout?.value?.uischema?.elements ??
                    []) as any[]
                const firstWithScope = elements.find(
                    (e) => typeof e?.scope === 'string' && e.scope.startsWith('#/')
                )
                if (firstWithScope) {
                    const parts = (firstWithScope.scope as string).split('/')
                    if (parts.length >= 3) {
                        scope = parts.slice(0, parts.length - 2).join('/') || '#'
                    }
                }
            }
            if (scope) {
                const baseSchema = (props as any).rootSchema ?? (props as any).schema
                const resolved = Resolve.schema(baseSchema, scope, baseSchema)
                return resolved?.description
            }
            return undefined
        })
        return { ...model, groupDescription }
    },
})

export default layoutRenderer

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: layoutRenderer,
    tester: rankWith(2, and(isLayout, uiTypeIs('Group'))),
}
</script>


<style scoped>
/* Remove Fieldset legend gap when we render label above the Fieldset */
:deep(.no-legend-gap > .p-fieldset-legend) {
    display: none;
}
</style>
