// Next.js layer. It includes the React layer, so use it instead of react():
// [...base({...}), ...next()].
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";
import { errorsOnly } from "./errors-only.js";
import { react } from "./react.js";

/**
 * @param {object} [options]
 * @param {string[]} [options.files] Files that hold React code. Defaults to all .tsx and .jsx files.
 */
export function next(options = {}) {
  return errorsOnly(
    defineConfig(...react(options), {
      name: "lint-config/next",
      files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
      extends: [nextPlugin.configs["core-web-vitals"]],
    }),
  );
}

export default next;
