import type { JsonFormsRendererRegistryEntry } from "@jsonforms/core"
import { defineComponent, h } from "vue"
import SfcComponent, { entry as sfcEntry } from "./AllOfRenderer.vue"

const Wrapped = defineComponent({
    name: "AllOfRenderer",
    render() {
        // @ts-ignore
        return h(SfcComponent, this.$props, this.$slots)
    },
})

export default Wrapped
export const entry: JsonFormsRendererRegistryEntry = {
    ...sfcEntry,
    renderer: Wrapped,
}


