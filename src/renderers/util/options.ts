export interface Options {
    showUnfocusedDescription?: boolean;
    hideRequiredAsterisk?: boolean;
    focus?: boolean;
    step?: number;
    // Unified control variant (preferred)
    variant?: 'checkbox' | 'toggleswitch' | 'selectbutton' | 'multiselect';
}
