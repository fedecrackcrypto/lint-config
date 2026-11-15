// Agents ignore warnings, so the baseline has none: every "warn" (or 1) in a
// preset becomes "error". Rules that are off stay off.

function toError(entry) {
  if (entry === "warn" || entry === 1) return "error";
  if (Array.isArray(entry) && (entry[0] === "warn" || entry[0] === 1)) {
    return ["error", ...entry.slice(1)];
  }
  return entry;
}

/** @param {import("eslint").Linter.Config[]} configs */
export function errorsOnly(configs) {
  return configs.map((config) =>
    config.rules
      ? {
          ...config,
          rules: Object.fromEntries(
            Object.entries(config.rules).map(([rule, entry]) => [
              rule,
              toError(entry),
            ]),
          ),
        }
      : config,
  );
}
