# frontmatter-js

A very small frontmatter parser: flat `key: value` pairs and one level of `- item` lists, nothing else. No YAML engine, no dependencies.

```js
import frontmatter from 'frontmatter-js'

const { frontmatter: meta, body } = frontmatter({ content: markdownString })
```

```markdown
---
title: tom kha gai
tags:
  - soup
  - thai
---

# tom kha gai
```

gives `{ frontmatter: { title: 'tom kha gai', tags: ['soup', 'thai'] }, body: '# tom kha gai' }`.

## rules

- Content must open with a line of exactly `---`; the next `---` line closes the frontmatter. Any later `---` (a markdown horizontal rule) stays in the body.
- `key: value` splits on the **first** colon, so values can contain colons. Keys and values are trimmed.
- A line ending in a colon starts a list, and the next line must be a `- item`. That means a single-line value can't end with a colon: `alt: a photo of:` is read as the start of a list and throws.
- Indentation doesn't matter. Blank lines are ignored.
- A repeated key overwrites the earlier one.
- Malformed lines throw an `Error` explaining the expected shape.
- CRLF line endings are fine.

## 2.0

- Native ESM with bundled TypeScript types (`FrontmatterResult`, `Frontmatter`). The UMD/webpack build is gone, which fixes esbuild's CJS interop handing you `{ default: fn }` instead of `fn`. CommonJS `require()` of the package is no longer supported.
- A `---` horizontal rule in the body no longer truncates the body.
- A missing closing `---` throws a clear error instead of a `TypeError`.
- CRLF line endings are normalized.

## dev

No test framework and no transpiler in the loop: the source is TypeScript that Node runs directly by stripping types, and the tests use `node:test` + `node:assert/strict`. Needs a Node with type stripping on by default (verified on 22.23; `.nvmrc` pins 24.22.1). The only dev dependencies are `typescript` and `@types/node`.

- `npm test`, `npm run test:watch`, `npm run test:coverage`: `node --test` over `src/**/*.test.ts`
- `npm run typecheck`: `tsc` against `tsconfig.json` (tests included, no emit)
- `npm run build`: `tsc -p tsconfig.build.json` → `dist/` (`.js` + `.d.ts` + maps, tests excluded)
- `prepublishOnly` runs all three.

House rules that keep the source strippable, all enforced by `tsconfig.json`:

- Relative imports name the real file: `import x from './validation.ts'`. tsc rewrites them to `.js` on build (`rewriteRelativeImportExtensions`).
- Type-only imports say so: `import type { Frontmatter } from ...` (`verbatimModuleSyntax`).
- Erasable syntax only: no `enum`, `namespace`, or constructor parameter properties (`erasableSyntaxOnly`). Use `as const` objects and union types instead.
