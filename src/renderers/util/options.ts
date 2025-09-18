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
}

export interface ArrayListOptions extends BaseOptions {
    restrict?: boolean;
    sortable?: boolean;
    childLabelProp?: string;
}

export interface EnumControlOptions extends BaseOptions {
    selectButton?: boolean;
    radio?: boolean;
    horizontal?: boolean;
    enumValues?: any[];
}

export interface LabelOptions extends BaseOptions {
    description?: string;
    scope?: string;
}
