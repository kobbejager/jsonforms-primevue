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

export interface IntegerControlOptions extends BaseOptions {
    /** Variant to use: 'inputnumber' (default) or 'slider'. */
    variant?: 'inputnumber' | 'slider';
    /** If true, shows increment/decrement buttons. Defaults to true. */
    showButtons?: boolean;
    /** Step value for increment/decrement. Must be an integer >= 1. Defaults to 1. */
    step?: number;
    /** Minimum value allowed. Required when variant is 'slider'. */
    min?: number;
    /** Maximum value allowed. Required when variant is 'slider'. */
    max?: number;
    /** Prefix string to display before the number. */
    prefix?: string;
    /** Suffix string to display after the number. */
    suffix?: string;
}

export interface NumberControlOptions extends BaseOptions {
    /** Variant to use: 'inputnumber' (default) or 'slider'. */
    variant?: 'inputnumber' | 'slider';
    /** If true, shows increment/decrement buttons. Defaults to true. */
    showButtons?: boolean;
    /** Step value for increment/decrement. Must be > 0. Defaults to 0.1. */
    step?: number;
    /** Minimum value allowed. Required when variant is 'slider'. */
    min?: number;
    /** Maximum value allowed. Required when variant is 'slider'. */
    max?: number;
    /** Prefix string to display before the number. */
    prefix?: string;
    /** Suffix string to display after the number. */
    suffix?: string;
    /** Locale string for number formatting (e.g., 'en-US', 'de-DE'). */
    locale?: string;
    /** Currency code (e.g., 'USD', 'EUR'). When set, automatically enables currency mode. */
    currency?: string;
    /** Minimum number of fraction digits to display. */
    minFractionDigits?: number;
    /** Maximum number of fraction digits to display. */
    maxFractionDigits?: number;
}
