<template>
    <div
        v-if="control.visible"
        @focusout="markTouched"
    >
        <dispatch-renderer
            :visible="control.visible"
            :enabled="control.enabled"
            :schema="control.schema"
            :uischema="detailUiSchema"
            :path="control.path"
            :renderers="control.renderers"
            :cells="control.cells"
        />
        <div
            v-if="showErrors && control.errors"
            :class="styles.control.error"
        >
            <i class="pi pi-exclamation-triangle" style="font-size: 0.75rem"></i> {{ control.errors }}
        </div>
    </div>
</template>

<script lang="ts">
import {
    JsonFormsRendererRegistryEntry,
    rankWith,
    ControlElement,
    Generate,
    GroupLayout,
    UISchemaElement,
    findUISchema,
    isObjectControl,
} from '@jsonforms/core'
import { defineComponent } from 'vue'
import {
    DispatchRenderer,
    rendererProps,
    RendererProps,
    useJsonFormsControlWithDetail,
} from '@jsonforms/vue'
import { usePrimeVueControl } from '../util'
import { isEmpty } from 'lodash'

const controlRenderer = defineComponent({
    name: 'ObjectRenderer',
    components: {
        DispatchRenderer,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        const control = usePrimeVueControl(useJsonFormsControlWithDetail(props))
        return {
            ...control,
            input: control,
        }
    },
    computed: {
        detailUiSchema(): UISchemaElement {
            const uiSchemaGenerator = () => {
                const uiSchema = Generate.uiSchema(
                    this.control.schema,
                    'Group',
                    undefined,
                    this.control.rootSchema
                )
                if (isEmpty(this.control.path)) {
                    uiSchema.type = 'VerticalLayout'
                    // Ensure root-level layout can resolve schema description
                    ;(uiSchema as GroupLayout).options = {
                        ...(uiSchema as GroupLayout).options,
                        scope: this.control.uischema.scope,
                    }
                } else {
                    ;(uiSchema as GroupLayout).label = this.control.label
                    // Ensure group can resolve schema description by scope
                    ;(uiSchema as GroupLayout).options = {
                        ...(uiSchema as GroupLayout).options,
                        scope: this.control.uischema.scope,
                    }
                }
                return uiSchema
            }

            const result = findUISchema(
                this.control.uischemas,
                this.control.schema,
                this.control.uischema.scope,
                this.control.path,
                uiSchemaGenerator,
                this.control.uischema,
                this.control.rootSchema
            )

            return result
        },
    },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(2, isObjectControl),
}
</script>
