//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"
import reactHooks from "eslint-plugin-react-hooks"

export default [
  ...tanstackConfig,
  reactHooks.configs.flat["recommended-latest"] ??
    reactHooks.configs["recommended-latest"],
  {
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "import/consistent-type-specifier-style": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
  {
    // Carried over from the Next.js app as is: defensive checks against
    // loosely typed CMS data and lookups, and effect patterns (localStorage
    // reads on mount, imperative body scroll lock) that predate the React
    // Compiler lint rules. Rewrite them before turning these back on.
    files: [
      "src/components/BackButton.tsx",
      "src/components/ProjectMediaGallery.tsx",
      "src/components/life-calendar/life-calendar.tsx",
      "src/components/projects/projects-client.tsx",
    ],
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
  {
    // Generated or vendored: the Base UI primitives are kept as shipped.
    ignores: [
      "eslint.config.js",
      ".prettierrc",
      "src/routeTree.gen.ts",
      "src/components/ui/**",
      "worker-configuration.d.ts",
      "studio/**",
      "dist/**",
      "public/**",
    ],
  },
]
