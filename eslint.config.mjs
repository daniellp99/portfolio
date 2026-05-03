import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

import clientServerBoundary from "./eslint-plugins/client-server-boundary.mjs";

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
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "**/*.test.ts",
      "src/lib/server/content-load.ts",
      "src/lib/content/owner.ts",
      "src/lib/content/projects.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/content/owner",
              message:
                "Import owner content only through @/lib/server/content-load (or tests).",
            },
            {
              name: "@/lib/content/projects",
              message:
                "Import project content only through @/lib/server/content-load (or tests).",
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
