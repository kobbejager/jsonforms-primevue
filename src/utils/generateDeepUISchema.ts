/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import type {
  JsonSchema,
  ControlElement,
  LabelElement,
  Layout,
  UISchemaElement
} from '@jsonforms/core';
import { isGroup, isLayout, createControlElement, Resolve } from '@jsonforms/core';

/**
 * Creates a new ILayout.
 * @param layoutType The type of the laoyut
 * @returns the new ILayout
 */
const createLayout = (layoutType: string): Layout => ({
  type: layoutType,
  elements: []
});

// use createControlElement from @jsonforms/core

/**
 * Wraps the given {@code uiSchema} in a Layout if there is none already.
 * @param uischema The ui schema to wrap in a layout.
 * @param layoutType The type of the layout to create.
 * @returns the wrapped uiSchema.
 */
// removed: wrapInLayoutIfNecessary – available via @jsonforms/core default generators

/**
 * Adds the given {@code labelName} to the {@code layout} if it exists
 * @param layout
 *      The layout which is to receive the label
 * @param labelName
 *      The name of the schema
 */
const addLabel = (layout: Layout, labelName: string) => {
  if (!isEmpty(labelName)) {
    const fixedLabel = startCase(labelName);
    if (isGroup(layout)) {
      layout.label = fixedLabel;
    } else {
      // add label with name
      const label: LabelElement = {
        type: 'Label',
        text: fixedLabel
      };
      layout.elements.push(label);
    }
  }
};

/**
 * Returns whether the given {@code jsonSchema} is a combinator ({@code oneOf}, {@code anyOf}, {@code allOf}) at the root level
 * @param jsonSchema
 *      the schema to check
 */
const isCombinator = (jsonSchema: JsonSchema): boolean => {
  return (
    !isEmpty(jsonSchema) &&
    (!isEmpty(jsonSchema.oneOf) ||
      !isEmpty(jsonSchema.anyOf) ||
      !isEmpty(jsonSchema.allOf))
  );
};

// minimal type derivation sufficient for deep UISchema generation
const deriveTypes = (jsonSchema: JsonSchema): string[] => {
  if (!jsonSchema) {
    return [];
  }
  const { type, properties, additionalProperties, items, enum: enumValues, const: constValue } = jsonSchema as any;

  if (Array.isArray(type)) {
    return type as string[];
  }
  if (typeof type === 'string') {
    return [type];
  }
  if (!type) {
    if (!isEmpty(properties) || additionalProperties !== undefined) {
      return ['object'];
    }
    if (items !== undefined) {
      return ['array'];
    }
    if (enumValues !== undefined) {
      // fallback; enum without explicit type is typically strings
      return ['string'];
    }
    if (constValue !== undefined) {
      const t = typeof constValue;
      return [t === 'object' && constValue !== null ? 'object' : (t as string)];
    }
  }
  return [];
};

export const generateDeepUISchema = (
  jsonSchema: JsonSchema,
  schemaElements?: UISchemaElement[],
  currentRef: string = '#',
  schemaName: string = '',
  layoutType: string = 'VerticalLayout',
  rootSchema: JsonSchema = jsonSchema
): UISchemaElement => {
  const isEntryCall = !schemaElements;
  const outElements: UISchemaElement[] = schemaElements ?? [];
  if (!isEmpty(jsonSchema) && jsonSchema.$ref !== undefined) {
    return generateDeepUISchema(
      Resolve.schema(rootSchema, (jsonSchema as any).$ref, rootSchema) as JsonSchema,
      outElements,
      currentRef,
      schemaName,
      layoutType,
      rootSchema
    );
  }

  if (isCombinator(jsonSchema)) {
    const controlObject: ControlElement = createControlElement(currentRef);
    outElements.push(controlObject);
    return isEntryCall && !isLayout(controlObject)
      ? createLayout(layoutType) && (() => {
          const layout = createLayout(layoutType);
          (layout.elements as any).push(controlObject);
          return layout;
        })()
      : controlObject;
  }

  const types = deriveTypes(jsonSchema);
  if (types.length === 0) {
    return null;
  }

  if (types.length > 1) {
    const controlObject: ControlElement = createControlElement(currentRef);
    outElements.push(controlObject);
    return isEntryCall && !isLayout(controlObject)
      ? createLayout(layoutType) && (() => {
          const layout = createLayout(layoutType);
          (layout.elements as any).push(controlObject);
          return layout;
        })()
      : controlObject;
  }

  if (types[0] === 'object') {

    const layout: Layout = createLayout(layoutType);
    outElements.push(layout);

    if (jsonSchema.properties && Object.keys(jsonSchema.properties).length > 1) {
      addLabel(layout, schemaName);
    }

    if (!isEmpty(jsonSchema.properties)) {
      // traverse properties
      const nextRef: string = currentRef + '/properties';
      Object.keys(jsonSchema.properties).map(propName => {
        let value = jsonSchema.properties[propName];
        const ref = `${nextRef}/${propName}`;
        if (value.$ref !== undefined) {
          value = Resolve.schema(rootSchema, value.$ref, rootSchema) as JsonSchema;
        }
        generateDeepUISchema(
          value,
          layout.elements,
          ref,
          propName,
          layoutType,
          rootSchema
        );
      });
    }

    return layout;
  }
  if (types[0] === 'array') {
    const layout: Layout = createLayout('Control');
    delete layout.elements;
    // @ts-ignore
    layout.scope = currentRef;

    outElements.push(layout);

    const ref = '#';
    const propName = '';

    if (!Array.isArray(jsonSchema.items)) {
      const value = jsonSchema.items;
      const inArrayUiSchema =  generateDeepUISchema(
        value,
        [],
        ref,
        propName,
        layoutType,
        rootSchema
      );
      if (inArrayUiSchema) {
        layout.options = {
          detail: inArrayUiSchema
        };
      }
    }
    return layout;
  }

  switch (types[0]) {
    case 'object': // object items will be handled by the object control itself
    /* falls through */
    case 'array': // array items will be handled by the array control itself
    /* falls through */
    case 'string':
    /* falls through */
    case 'number':
    /* falls through */
    case 'integer':
    /* falls through */
    case 'boolean':
      const controlObject: ControlElement = createControlElement(currentRef);
      outElements.push(controlObject);

      return isEntryCall && !isLayout(controlObject)
        ? createLayout(layoutType) && (() => {
            const layout = createLayout(layoutType);
            (layout.elements as any).push(controlObject);
            return layout;
          })()
        : controlObject;
    default:
      throw new Error('Unknown type: ' + JSON.stringify(jsonSchema));
  }
};
