export interface BaseOptions {
    showUnfocusedDescription?: boolean;
    hideRequiredAsterisk?: boolean;
    focus?: boolean;
    placeholder?: string;
    showAllErrors?: boolean;
    showErrorsOnTouched?: boolean;
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
}

export interface LabelOptions extends BaseOptions {
    description?: string;
    scope?: string;
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
