// React layer. Add after base(): [...base({...}), ...react()].
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { errorsOnly } from "./errors-only.js";

export const reactFiles = ["**/*.{tsx,jsx}"];

/**
 * @param {object} [options]
 * @param {string[]} [options.files] Files that hold React code. Defaults to all .tsx and .jsx files.
 */
export function react({ files = reactFiles } = {}) {
  return errorsOnly(
    defineConfig({
      name: "lint-config/react",
      files,
      extends: [
        eslintReact.configs["strict-type-checked"],
        reactHooks.configs.flat.recommended,
      ],
      languageOptions: {
        globals: { ...globals.browser },
      },
      rules: {
        // eslint-plugin-react-hooks (React's own plugin) owns the hooks rules;
        // turn off @eslint-react's copies so each problem is reported once.
        "@eslint-react/rules-of-hooks": "off",
        "@eslint-react/exhaustive-deps": "off",
        "@eslint-react/purity": "off",
        "@eslint-react/set-state-in-effect": "off",
      },
    }),
  );
}

export default react;
