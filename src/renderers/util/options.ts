export interface BaseOptions {
    showUnfocusedDescription?: boolean;
    hideRequiredAsterisk?: boolean;
    focus?: boolean;
    placeholder?: string;
    showAllErrors?: boolean;
    showErrorsOnTouched?: boolean;
    /**
     * If true, arrays are allowed to exist as empty arrays. If false (default),
     * when an array becomes empty via user actions, the array property is unset
     * (removed) from its parent object, provided the property is not required.
     */
    allowEmptyArrays?: boolean;
}


export interface OneOfOptions extends BaseOptions {
    allowNotApplicable?: boolean;
    notApplicableLabel?: string;
    radio?: boolean;
    selectButton?: boolean;
    horizontal?: boolean;
}

export interface AnyOfOptions extends BaseOptions {
    allowEmpty?: boolean;
    accordion?: boolean;
}

export interface EnumArrayOptions extends BaseOptions {
    variant?: 'checkbox' | 'toggleswitch' | 'selectbutton' | 'multiselect';
    horizontal?: boolean;
    enumValues?: any[];
    enumLabels?: string[];
}

export interface ArrayListOptions extends BaseOptions {
    restrict?: boolean;
    sortable?: boolean;
    childLabelProp?: string;
}

export interface StringArrayOptions extends BaseOptions {
    chips?: boolean;
    compactStringArray?: boolean;
    uniqueItems?: boolean;
}

export interface EnumControlOptions extends BaseOptions {
    selectButton?: boolean;
    radio?: boolean;
    horizontal?: boolean;
    enumValues?: any[];
    enumLabels?: string[];
    allowNotApplicable?: boolean;
    notApplicableLabel?: string;
}

export interface LabelOptions extends BaseOptions {
    description?: string;
    scope?: string;
}

export interface GroupOptions extends BaseOptions {
    description?: string;
    scope?: string;
    noSpacing?: boolean;
}

export interface LayoutOptions extends BaseOptions {}

export interface CategorizationOptions extends BaseOptions {
    variant?: 'tabs' | 'stepper' | 'accordion';
    showNavButtons?: boolean;
}

export interface StringControlOptions extends BaseOptions {
    password?: boolean;
    toggleMask?: boolean;
    inputMask?: string;
}

export interface StringSelectControlOptions extends BaseOptions {
    enumValues?: any[];
    enumLabels?: string[];
}

export interface StringExamplesOptions extends BaseOptions {
    examples?: any[];
    suggestions?: any[];
}

export interface AllOfOptions extends BaseOptions {
    /** If true, render as Tabs instead of flat list. */
    tabs?: boolean;
    /** If true, render as Accordion instead of flat list. */
    accordion?: boolean;
    /** If true, allow the parent object to remain empty ({}). Defaults to false. */
    allowEmpty?: boolean;
}
