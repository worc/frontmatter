# frontmatter-js — todo

## 2.0: native ESM + TypeScript (code done 2026-10-30, not yet published)

Done in the working tree, uncommitted:

- Source rewritten in TypeScript under `src/`, built with `tsc` (TypeScript 7) to `dist/` with `.d.ts` + maps. `dist/` is now gitignored and built by `prepublishOnly`, instead of being committed.
- `package.json`: `"type": "module"`, `exports` with types, `files` = `dist/` + `src/` (tests excluded).
- webpack, babel, jest and the old eslint 6 config are removed. `jest.config.ts` (from the ts-jest attempt) is dead and can go (`.eslintrc.js` is recoverable from git if the style rules are wanted under a modern eslint later).
- Tests on the native Node runner (`node:test` + `node:assert/strict`), with Node running the `.ts` source directly by type stripping. Dev deps are just `typescript` + `@types/node`. (vitest and ts-jest were both tried on 2026-10-30 and dropped: vitest drags in all of vite, ts-jest drags in the `isolatedModules`/`verbatimModuleSyntax` config tangle.) Two `validation` tests had a misplaced paren (`expect(() => fn(x).toThrow())`) and asserted nothing; fixed.
- `tsconfig.json` (typecheck everything, no emit) + `tsconfig.build.json` (emit `dist/`, no tests). The emitted `.d.ts` keeps `./frontmatter_parser.ts` specifiers (tsc doesn't rewrite declarations); verified consumers still resolve the types under both `bundler` and `nodenext`.
- Bug fixes, with tests: a `---` horizontal rule in the body no longer truncates the body; a missing closing delimiter throws a real error; CRLF is normalized.
- Verified: `npm pack` tarball bundled through esbuild 0.28 imports as a plain function (no alias); all 12 real files (recipes + reuben.report) parse identically to 1.0.3.

### to publish (human)

1. Review, commit. `dist/` is gitignored now but its old files are still tracked: `git rm -r --cached dist` as part of this commit.
2. `npm version major`: runs tests, bumps to 2.0.0, commits, tags, and `postversion` pushes. Needs a clean tree.
3. `npm publish`: `prepublishOnly` re-runs tests and builds `dist/`. (npm 2FA will ask for an OTP.)

### after publish (agent)

- reuben.report: drop the `alias` from both esbuild scripts, `frontmatter-js` → `^2.0.0`.
- recipes: use `^2.0.0` from the start of the esbuild conversion.

## later, maybe

- `anyPreviousLineStartsList` only checks whether *any* earlier line ends in a colon, so a stray `- item` after a key-value pair that follows a list is accepted (see the todo in `src/validation.ts`).
- Lint: a modern flat-config eslint + typescript-eslint carrying over the old style rules, if it's wanted.
