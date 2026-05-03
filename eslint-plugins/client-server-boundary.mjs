/**
 * @fileoverview Forbid value imports from @/lib/server/* in modules that start with the "use client" directive.
 * @see CONTEXT.md — props-only data from Server Components; server actions live outside @/lib/server.
 */

/** @param {string | undefined} source */
function isServerLibImport(source) {
  if (!source) return false;
  return source === "@/lib/server" || source.startsWith("@/lib/server/");
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
            "Disallow value imports from @/lib/server in use client modules.",
        },
        schema: [],
        messages: {
          noValueImport:
            'Do not import values from "{{source}}" in a "use client" module. Load data in a Server Component and pass props, or use a server action outside @/lib/server (e.g. @/lib/actions/*). `import type` is allowed.',
        },
      },
      create(context) {
        let client = false;

        return {
          Program(node) {
            client = hasUseClientDirective(node.body);
          },
          ImportDeclaration(node) {
            if (!client || !isServerLibImport(node.source.value)) return;
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
            if (typeof v !== "string" || !isServerLibImport(v)) return;
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
