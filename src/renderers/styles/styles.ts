import { UISchemaElement } from "@jsonforms/core"
import { inject } from "vue"
import merge from "lodash/merge"
import { defaultStyles } from "./defaultStyles"

const createEmptyStyles = (): Styles => ({
    control: {},
    verticalLayout: {},
    horizontalLayout: {},
    group: {},
    arrayList: {},
    dialog: {},
    oneOf: {},
    anyOf: {},
    allOf: {},
    categorization: {},
})

export interface Styles {
    control: {
        root?: string
        wrapper?: string
        label?: string
        description?: string
        error?: string
        input?: string
        textarea?: string
        select?: string
        option?: string
        asterisk?: string
        required?: string
    }
    dialog: {
        root?: string
        title?: string
        body?: string
        actions?: string
        buttonPrimary?: string
        buttonSecondary?: string
    }
    verticalLayout: {
        root?: string
        item?: string
    }
    horizontalLayout: {
        root?: string
        item?: string
    }
    group: {
        root?: string
        content?: string
        contentTop?: string
        item?: string
    }
    arrayList: {
        root?: string
        legend?: string
        addButton?: string
        label?: string
        itemWrapper?: string
        noData?: string
        item?: string
        itemToolbar?: string
        itemToolbarExpanded?: string
        itemLabel?: string
        itemContent?: string
        itemMoveUp?: string
        itemMoveDown?: string
        itemDelete?: string
    }
    oneOf: {
        root?: string
        content?: string
        top?: string
        selector?: string
        radioHorizontal?: string
        radioVertical?: string
    }
    anyOf: {
        root?: string
        top?: string
        panel?: string
    }
    allOf: {
        root?: string
        content?: string
        top?: string
        panel?: string
        list?: string
    }
    categorization: {
        root?: string
        category?: string
        selected?: string
        panel?: string
        stepper?: string
        stepperBadge?: string
        stepperLine?: string
        stepperFooter?: string
        stepperButtonBack?: string
        stepperButtonNext?: string
    }
}

export const useStyles = (element?: UISchemaElement) => {
    const userStyles = inject("styles", defaultStyles)
    if (!element?.options?.styles) {
        return userStyles
    }
    const styles = createEmptyStyles()
    if (userStyles) {
        merge(styles, userStyles)
    } else {
        merge(styles, defaultStyles)
    }
    if (element?.options?.styles) {
        merge(styles, element.options.styles)
    }
    return styles
}
