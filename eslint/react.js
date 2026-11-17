// React layer. Add after base(): [...base({...}), ...react()].
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { errorsOnly } from "./errors-only.js";

export const reactFiles = ["**/*.{tsx,jsx}"];

const effectMessage =
  "Effects are banned: they cause extra renders, stale state and race conditions. " +
  "Derive values during render (useMemo if slow), act in event handlers, fetch through the data layer, " +
  "and reset state with a `key`. See https://react.dev/learn/you-might-not-need-an-effect. " +
  "Only syncing with an external system (a subscription, a DOM API, a timer) justifies one; " +
  "then suppress it with `-- <which external system>` as the reason.";

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

        // Ban useEffect and useLayoutEffect, imported or as React.useEffect.
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "react",
                importNames: ["useEffect", "useLayoutEffect"],
                message: effectMessage,
              },
            ],
          },
        ],
        "no-restricted-syntax": [
          "error",
          {
            selector:
              "MemberExpression[object.name='React'][property.name=/^use(Layout)?Effect$/]",
            message: effectMessage,
          },
        ],
      },
    }),
  );
}

export default react;
