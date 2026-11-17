// React layer. Add after base(): [...base({...}), ...react()].
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { errorsOnly } from "./errors-only.js";

export const reactFiles = ["**/*.{tsx,jsx}"];

const effectMessage =
  "Effects are banned: they cause extra renders, stale state and race conditions. " +
  "Derive values during render (useMemo if slow), act in event handlers (keyboard input included), " +
  "fetch through the data layer, reset state with a `key`, and animate with CSS or declarative props. " +
  "See https://react.dev/learn/you-might-not-need-an-effect. " +
  "Do not suppress this rule yourself. If an effect really is the only correct route, " +
  "stop and ask the user, explaining why each alternative fails.";

/**
 * @param {object} [options]
 * @param {string[]} [options.files] Files that hold React code. Defaults to all .tsx and .jsx files.
 */
export function react({ files = reactFiles } = {}) {
  return errorsOnly([
    ...defineConfig({
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
    ...defineConfig({
      // Every file, not just React files: custom hooks live in .ts files too.
      name: "lint-config/react/no-effects",
      rules: {
        // Ban useEffect and useLayoutEffect at each call. Syntax selectors rather than
        // no-restricted-imports, which would also flag `import * as React from "react"`.
        "no-restricted-syntax": [
          "error",
          {
            selector: "CallExpression[callee.name=/^use(Layout)?Effect$/]",
            message: effectMessage,
          },
          {
            selector:
              "CallExpression > MemberExpression.callee[property.name=/^use(Layout)?Effect$/]",
            message: effectMessage,
          },
          {
            // A renamed import would dodge the call check.
            selector:
              "ImportDeclaration[source.value='react'] > ImportSpecifier[imported.name=/^use(Layout)?Effect$/][local.name!=/^use(Layout)?Effect$/]",
            message: effectMessage,
          },
        ],
      },
    }),
  ]);
}

export default react;
