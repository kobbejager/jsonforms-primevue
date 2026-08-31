import type { CombinatorSubSchemaRenderInfo, UISchemaElement } from '@jsonforms/core';
import type { CombinatorBranchUiSchemas } from './options';

export type IndexedCombinatorRenderInfo = CombinatorSubSchemaRenderInfo & {
    index: number;
};

/**
 * Applies branch-specific UI schema overrides to combinator render infos.
 * Array indices correspond to the original combinator schema array index.
 *
 * - Missing, `null`, or `undefined` entries keep the generated UI schema.
 * - `false` hides the branch by clearing `uischema` (callers should filter it out).
 * - An object replaces `uischema`. A string `label` on that object becomes the
 *   combinator option title; schema titles are left unchanged when `label` is absent.
 */
export function applyBranchUiSchemas(
    renderInfos: CombinatorSubSchemaRenderInfo[],
    branchUiSchemas?: CombinatorBranchUiSchemas
): CombinatorSubSchemaRenderInfo[] {
    if (!branchUiSchemas?.length) {
        return renderInfos;
    }

    return renderInfos.map((info, index) => {
        const override = branchUiSchemas[index];
        if (override == null) {
            return info;
        }
        if (override === false) {
            return { ...info, uischema: undefined as unknown as UISchemaElement };
        }
        const next: CombinatorSubSchemaRenderInfo = { ...info, uischema: override };
        if (typeof override.label === 'string') {
            next.label = override.label;
        }
        return next;
    });
}

/**
 * Applies branch UI schema overrides, records each info's original combinator
 * index, and drops hidden branches.
 */
export function visibleCombinatorRenderInfos(
    renderInfos: CombinatorSubSchemaRenderInfo[],
    branchUiSchemas?: CombinatorBranchUiSchemas
): IndexedCombinatorRenderInfo[] {
    return applyBranchUiSchemas(renderInfos, branchUiSchemas)
        .map((info, index) => ({ ...info, index }))
        .filter((info) => info.uischema);
}
