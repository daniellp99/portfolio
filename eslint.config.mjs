import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import reactCompiler from "eslint-plugin-react-compiler";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";

import clientServerBoundary from "./eslint-plugins/client-server-boundary.mjs";

const contentImportMessage =
  "Import project content only through feature *-queries.ts (or tests).";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  reactYouMightNotNeedAnEffect.configs.strict,
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { "react-compiler": reactCompiler },
    rules: { "react-compiler/react-compiler": "error" },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "**/*.test.ts",
      "src/components/**",
      "src/features/**/**-queries.ts",
      "src/features/owner/owner-schemas.ts",
      "src/lib/content/projects.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/content/projects",
              message: contentImportMessage,
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/components/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/**", "**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/content/projects",
              message: contentImportMessage,
            },
          ],
          patterns: [
            {
              group: ["@/features/*/*-queries", "@/features/*/*-queries/*"],
              message:
                "Import feature queries only from feature server components, pages, or layouts.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/components/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/content/projects",
              message: contentImportMessage,
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts"],
    plugins: { boundary: clientServerBoundary },
    rules: {
      "boundary/no-server-value-imports-in-use-client": "error",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/control-has-associated-label": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/img-redundant-alt": "warn",
      "jsx-a11y/no-redundant-roles": "warn",
    },
  },
];

export default eslintConfig;
