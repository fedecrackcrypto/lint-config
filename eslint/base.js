// The baseline ESLint config. Every rule is an error: agents ignore warnings.
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import { errorsOnly } from "./errors-only.js";

export const defaultIgnores = [
  "**/node_modules/",
  "**/dist/",
  "**/build/",
  "**/coverage/",
  "**/.next/",
  "**/*.d.ts",
];

export const testFiles = [
  "**/*.{test,spec}.{ts,tsx,js,mjs,cjs}",
  "**/{test,tests,__tests__}/**/*.{ts,tsx,js,mjs,cjs}",
];

/**
 * @param {object} options
 * @param {string} options.tsconfigRootDir Pass `import.meta.dirname` from the repo's eslint.config.js.
 * @param {string[]} [options.ignores] Extra global ignores for this repo.
 */
export function base({ tsconfigRootDir, ignores = [] }) {
  if (!tsconfigRootDir) {
    throw new Error(
      "lint-config: base() needs tsconfigRootDir (use import.meta.dirname)",
    );
  }

  return errorsOnly(
    defineConfig(
      globalIgnores([...defaultIgnores, ...ignores]),

      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,

      {
        name: "lint-config/base",
        languageOptions: {
          globals: { ...globals.node },
          parserOptions: {
            projectService: true,
            tsconfigRootDir,
          },
        },
        linterOptions: {
          reportUnusedDisableDirectives: "error",
          reportUnusedInlineConfigs: "error",
        },
        rules: {
          // Escape hatches an agent reaches for instead of fixing the problem.
          "@typescript-eslint/no-explicit-any": "error",
          "@typescript-eslint/no-non-null-assertion": "error",
          "@typescript-eslint/ban-ts-comment": [
            "error",
            {
              "ts-check": false,
              "ts-expect-error": true,
              "ts-ignore": true,
              "ts-nocheck": true,
            },
          ],
          "no-console": "error",
          "no-empty": ["error", { allowEmptyCatch: false }],

          // Correctness rules that pay for themselves with agent-written code.
          eqeqeq: ["error", "always"],
          "@typescript-eslint/switch-exhaustiveness-check": "error",
          "@typescript-eslint/consistent-type-imports": "error",
          "@typescript-eslint/no-import-type-side-effects": "error",
        },
      },

      // Every suppression must say why, and must name its rules.
      comments.recommended,
      {
        name: "lint-config/eslint-comments",
        rules: {
          "@eslint-community/eslint-comments/require-description": "error",
          "@eslint-community/eslint-comments/no-unlimited-disable": "error",
          "@eslint-community/eslint-comments/disable-enable-pair": "error",
        },
      },

      // Plain JS files (config files, scripts) are not in a tsconfig.
      {
        name: "lint-config/plain-js",
        files: ["**/*.{js,mjs,cjs}"],
        extends: [tseslint.configs.disableTypeChecked],
      },

      {
        name: "lint-config/tests",
        files: testFiles,
        plugins: { vitest },
        rules: {
          ...vitest.configs.recommended.rules,
          "vitest/no-focused-tests": "error",
          "vitest/no-disabled-tests": "error",
          "vitest/expect-expect": "error",
          "vitest/no-identical-title": "error",
          "vitest/valid-title": "error",
        },
      },

      // Last: turn off rules that fight Prettier.
      prettier,
    ),
  );
}

export default base;
