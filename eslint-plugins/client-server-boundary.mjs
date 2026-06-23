/**
 * @fileoverview Forbid value imports from server-only query modules in "use client" files.
 * @see CONTEXT.md — props-only data from Server Components; server actions live in feature action files.
 */

/** @param {string | undefined} source */
function isServerQueryImport(source) {
  if (!source) return false;
  if (source === "@/lib/server" || source.startsWith("@/lib/server/")) {
    return true;
  }
  return /^@\/features\/[^/]+\/[^/]+-queries(?:\/|$)/.test(source);
}

/** @param {import('eslint').AST.Node} node */
function isTypeOnlyImportDeclaration(node) {
  if (node.importKind === "type") return true;
  return node.specifiers.every(
    (s) =>
      s.type === "ImportSpecifier" &&
      /** @type {{ importKind?: string }} */ (s).importKind === "type",
  );
}

/** @param {import('eslint').AST.Node[]} body */
function hasUseClientDirective(body) {
  for (const stmt of body) {
    if (stmt.type === "ImportDeclaration") {
      return false;
    }
    if (
      stmt.type === "ExpressionStatement" &&
      stmt.expression.type === "Literal" &&
      typeof stmt.expression.value === "string"
    ) {
      const v = stmt.expression.value;
      if (v === "use client") return true;
      if (v === "use server" || v === "use strict") continue;
    }
    return false;
  }
  return false;
}

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  meta: { name: "client-server-boundary", version: "0.0.0" },
  rules: {
    "no-server-value-imports-in-use-client": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow value imports from feature query modules in use client modules.",
        },
        schema: [],
        messages: {
          noValueImport:
            'Do not import values from "{{source}}" in a "use client" module. Load data in a Server Component and pass props, or use a server action from a feature actions file. `import type` is allowed.',
        },
      },
      create(context) {
        let client = false;

        return {
          Program(node) {
            client = hasUseClientDirective(node.body);
          },
          ImportDeclaration(node) {
            if (!client || !isServerQueryImport(node.source.value)) return;
            if (isTypeOnlyImportDeclaration(node)) return;
            context.report({
              node,
              messageId: "noValueImport",
              data: { source: String(node.source.value) },
            });
          },
          ImportExpression(node) {
            if (!client || node.source.type !== "Literal") return;
            const v = node.source.value;
            if (typeof v !== "string" || !isServerQueryImport(v)) return;
            context.report({
              node,
              messageId: "noValueImport",
              data: { source: v },
            });
          },
        };
      },
    },
  },
};

export default plugin;
