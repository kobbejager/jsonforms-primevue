import { useStyles } from '../styles';
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
    I extends { control: any; handleChange: any }
>(
    input: I,
    adaptTarget
) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.control.value.config),
            cloneDeep(input.control.value.uischema.options)
        )
    );

    const isFocused = ref(false);
    const onChange = (target: any) => {
        input.handleChange(input.control.value.path, adaptTarget(target));
    };

    const controlWrapper = computed(() => {
        const { id, description, errors, label, visible, required } =
            input.control.value;
        return { id, description, errors, label, visible, required };
    });

    return {
        ...input,
        styles: useStyles(input.control.value.uischema),
        isFocused,
        appliedOptions,
        controlWrapper,
        onChange,
    };
};

/**
 * Adds styles and appliedOptions
 */
export const usePrimeVueLayout = <I extends { layout: any }>(input: I) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.layout.value.config),
            cloneDeep(input.layout.value.uischema.options)
        )
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
export const usePrimeVueLabel = <I extends { label: any }>(input: I) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.label.value.config),
            cloneDeep(input.label.value.uischema.options)
        )
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
export const usePrimeVueArrayControl = <I extends { control: any }>(
    input: I
) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.control.value.config),
            cloneDeep(input.control.value.uischema.options)
        )
    );

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
        childUiSchema,
        childLabelForIndex,
    };
};
