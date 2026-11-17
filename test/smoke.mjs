// Smoke test: lint the fixture and check that each preset loads and that the
// rules agents most often break are reported. Run with `pnpm test`.
import { ESLint } from "eslint";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const fixture = path.join(import.meta.dirname, "fixture");
const eslint = new ESLint({ cwd: fixture });
const results = await eslint.lintFiles(["src"]);

const byFile = new Map(
  results.map((r) => [
    path.relative(fixture, r.filePath).replaceAll("\\", "/"),
    r.messages.map((m) => m.ruleId ?? `fatal: ${m.message}`),
  ]),
);

function expectRules(file, rules) {
  const found = byFile.get(file);
  assert.ok(found, `${file} was not linted`);
  for (const rule of rules) {
    assert.ok(
      found.includes(rule),
      `${file}: expected ${rule}, got ${JSON.stringify(found)}`,
    );
  }
}

assert.deepEqual(byFile.get("src/clean.ts"), [], "src/clean.ts must be clean");
assert.deepEqual(
  byFile.get("src/scripts/report.ts"),
  [],
  "scripts may use console",
);
expectRules("src/escape-hatches.ts", [
  "@typescript-eslint/no-explicit-any",
  "@typescript-eslint/ban-ts-comment",
  "@typescript-eslint/no-non-null-assertion",
  "no-console",
]);
expectRules("src/floating.ts", ["@typescript-eslint/no-floating-promises"]);
expectRules("src/suppressed.ts", [
  "@eslint-community/eslint-comments/require-description",
]);
expectRules("src/math.test.ts", [
  "vitest/no-focused-tests",
  "vitest/expect-expect",
]);
expectRules("src/Widget.tsx", ["react-hooks/rules-of-hooks"]);
assert.deepEqual(
  byFile.get("src/Effects.tsx"),
  ["no-restricted-syntax", "no-restricted-syntax", "no-restricted-syntax"],
  "useEffect, useLayoutEffect and React.useEffect must each be reported",
);
assert.deepEqual(
  byFile.get("src/use-ticker.ts"),
  ["no-restricted-syntax"],
  "effects in .ts hooks must be reported too",
);
assert.deepEqual(
  byFile.get("src/Renamed.tsx"),
  ["no-restricted-syntax"],
  "a renamed effect import must be reported",
);
assert.deepEqual(
  byFile.get("src/Namespace.tsx"),
  [],
  "a namespace import of react is allowed when no effect is used",
);

for (const r of results) {
  for (const m of r.messages) {
    assert.notEqual(
      m.severity,
      1,
      `${r.filePath}: ${m.ruleId} is a warning; every rule must be an error`,
    );
    assert.ok(!m.fatal, `${r.filePath}: parse error: ${m.message}`);
  }
}

// The other presets must load.
await import("../eslint/next.js");
await import("../prettier.js");
await import("../knip.js");
const require = createRequire(import.meta.url);
const depcruise = require("../depcruise/index.cjs");
assert.ok(depcruise.forbidden.length > 0);
JSON.parse(
  await readFile(new URL("../tsconfig/strict.json", import.meta.url), "utf8"),
);

console.log(`smoke: ok (${results.length} fixture files)`);
