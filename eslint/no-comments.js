// Bans comments. Tool directives (lint, format, coverage, bundler hints) are code, not prose,
// and stay allowed, as do JSDoc type annotations in plain JS files, which have no other syntax.

const DIRECTIVES = [
  /^eslint(-disable|-enable|-disable-line|-disable-next-line|-env)?(\s|$)/,
  /^globals?\s/,
  /^exported\s/,
  /^prettier-ignore/,
  /^@ts-/,
  /^(c8|v8|istanbul) ignore/,
  /^[#@]__(PURE|NO_SIDE_EFFECTS)__/,
  /^@vite-ignore/,
  /^(webpack|turbopack)[A-Z]\w*\s*:/,
  /^\/\s*<reference\s/,
  /^\/\s*<amd-module\s/,
];

const JSDOC_TYPE_TAG =
  /@(type|typedef|param|returns?|satisfies|template|import|callback)\b/;
const PLAIN_JS = /\.[cm]?js$/;

function isAllowed(comment, filename) {
  const text = comment.value.trim();
  if (DIRECTIVES.some((pattern) => pattern.test(text))) return true;
  return (
    comment.type === "Block" &&
    comment.value.startsWith("*") &&
    PLAIN_JS.test(filename) &&
    JSDOC_TYPE_TAG.test(comment.value)
  );
}

export const noComments = {
  meta: {
    type: "suggestion",
    docs: { description: "Ban comments; say it in names, types and tests." },
    schema: [],
    messages: {
      comment:
        "Comments are banned. Say it in a name, a type or a test. A reason that can't live in code goes in the commit message or an ADR. Tool directives (eslint-disable, prettier-ignore, bundler hints) are allowed.",
    },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (comment.type === "Shebang") continue;
          if (isAllowed(comment, context.filename)) continue;
          context.report({ loc: comment.loc, messageId: "comment" });
        }
      },
    };
  },
};

export const plugin = {
  meta: { name: "lint-config" },
  rules: { "no-comments": noComments },
};
