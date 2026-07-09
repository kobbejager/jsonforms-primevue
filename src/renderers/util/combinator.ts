import type { CombinatorSubSchemaRenderInfo, UISchemaElement } from '@jsonforms/core';

/**
 * Applies branch-specific UI schema overrides to combinator render infos.
 * Array indices correspond to the original combinator schema array index.
 * Missing, null, or undefined entries fall back to the generated UI schema.
 */
export function applyBranchUiSchemas(
    renderInfos: CombinatorSubSchemaRenderInfo[],
    branchUiSchemas?: (UISchemaElement | null | undefined)[]
): CombinatorSubSchemaRenderInfo[] {
    if (!branchUiSchemas?.length) {
        return renderInfos;
    }

    return renderInfos.map((info, index) => {
        const override = branchUiSchemas[index];
        if (override == null) {
            return info;
        }
        return { ...info, uischema: override };
    });
}
