import { useStyles } from '../styles';
import type { BaseOptions } from './options';
import { computed, ref } from 'vue';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import {
    composePaths,
    findUISchema,
    getFirstPrimitiveProp,
    Resolve,
} from '@jsonforms/core';

/**
 * Adds styles, isFocused, appliedOptions and onChange
 */
export const usePrimeVueControl = <
    I extends { control: any; handleChange: any },
    TOptions extends BaseOptions = BaseOptions
>(
    input: I,
    adaptTarget
) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.control.value.config),
            cloneDeep(input.control.value.uischema.options)
        ) as TOptions
    );

    const isFocused = ref(false);
    const isTouched = ref(false);
    const markTouched = () => {
        isTouched.value = true;
    };
    const onChange = (target: any) => {
        input.handleChange(input.control.value.path, adaptTarget(target));
    };

    const showErrors = computed(() => {
        const config = input.control.value.config;
        const errors = input.control.value.errors;
        const hasErrors = Array.isArray(errors) ? errors.length > 0 : !!errors;
        if (!hasErrors) return false;
        // Core modes
        if (config?.validationMode === 'NoValidation') return false;
        if (config?.validationMode === 'ValidateAndShow') return true;
        // Custom flags
        const showAlways = !!appliedOptions.value?.showAllErrors;
        const showOnTouched = !!appliedOptions.value?.showErrorsOnTouched;
        if (showAlways) return true;
        if (showOnTouched) return isTouched.value;
        // Default: ValidateAndHide behavior
        return false;
    });

    const controlWrapper = computed(() => {
        const { id, description, errors, label, visible, required } =
            input.control.value;
        return { id, description, errors: showErrors.value ? errors : '', label, visible, required };
    });

    return {
        ...input,
        styles: useStyles(input.control.value.uischema),
        isFocused,
        appliedOptions,
        controlWrapper,
        onChange,
        showErrors,
        markTouched,
    };
};

/**
 * Adds styles and appliedOptions
 */
export const usePrimeVueLayout = <I extends { layout: any }, TOptions extends BaseOptions = BaseOptions>(input: I) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.layout.value.config),
            cloneDeep(input.layout.value.uischema.options)
        ) as TOptions
    );
    return {
        ...input,
        styles: useStyles(input.layout.value.uischema),
        appliedOptions,
    };
};

/**
 * Adds styles and appliedOptions
 */
export const usePrimeVueLabel = <I extends { label: any }, TOptions extends BaseOptions = BaseOptions>(input: I) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.label.value.config),
            cloneDeep(input.label.value.uischema.options)
        ) as TOptions
    );
    return {
        ...input,
        styles: useStyles(input.label.value.uischema),
        appliedOptions,
    };
};

/**
 * Adds styles, appliedOptions and childUiSchema
 */
export const usePrimeVueArrayControl = <I extends { control: any }, TOptions extends BaseOptions = BaseOptions>(
    input: I
) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.control.value.config),
            cloneDeep(input.control.value.uischema.options)
        ) as TOptions
    );

    const isTouched = ref(false);
    const markTouched = () => {
        isTouched.value = true;
    };
    const showErrors = computed(() => {
        const config = input.control.value.config;
        const errors = input.control.value.errors;
        const hasErrors = Array.isArray(errors) ? errors.length > 0 : !!errors;
        if (!hasErrors) return false;
        if (config?.validationMode === 'NoValidation') return false;
        if (config?.validationMode === 'ValidateAndShow') return true;
        const showAlways = !!appliedOptions.value?.showAllErrors;
        const showOnTouched = !!appliedOptions.value?.showErrorsOnTouched;
        if (showAlways) return true;
        if (showOnTouched) return isTouched.value;
        return false;
    });

    const childUiSchema = computed(() =>
        findUISchema(
            input.control.value.uischemas,
            input.control.value.schema,
            input.control.value.uischema.scope,
            input.control.value.path,
            undefined,
            input.control.value.uischema,
            input.control.value.rootSchema
        )
    );

    const childLabelForIndex = (index: number) => {
        const childLabelProp =
            input.control.value.uischema.options?.childLabelProp ??
            input.control.value.schema.title ??
            'Item';
        if (childLabelProp) {
            return `${childLabelProp} ${index + 1}`;
        }
        return "Item";
    };
    return {
        ...input,
        styles: useStyles(input.control.value.uischema),
        appliedOptions,
        showErrors,
        markTouched,
        childUiSchema,
        childLabelForIndex,
    };
};
