# frontmatter-js — todo

## Priority: drop UMD, ship native ESM

The current build uses webpack with `libraryTarget: 'umd'`. UMD was a compatibility shim
from an era before native ES modules existed in browsers and bundlers. It creates a serious
interop hazard with modern ESM-first tools like esbuild:

**What breaks**: webpack's UMD output calls `e.r(exports)` which sets `__esModule: true`
on `module.exports`. When esbuild imports this with its `isNodeMode=1` CJS interop, it
wraps `module.exports` as the ESM default — so consumers get the exports *object*, not the
function. The actual parser ends up at `import_frontmatter_js.default.default` instead of
`import_frontmatter_js.default`. Symptom: `fm.default is not a function` at runtime, with
no TypeScript error (types said it was fine, runtime disagreed).

**Workaround in reuben.report (2026-04-24)**: esbuild alias pointing directly at the ESM
source file, bypassing the dist bundle entirely.

### Migration path

The source is already native ESM (`import`/`export`). The build and package.json are the
only things that need updating. Recommended approach: drop webpack, ship native ESM, add
TypeScript, publish types in-package.

**1. Replace webpack build with tsc**

```sh
npm install --save-dev typescript
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "allowJs": true,
    "declaration": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "skipLibCheck": true,
    "strict": true,
    "target": "ESNext"
  },
  "include": ["*.js"]
}
```

Run `npx tsc` — generates `dist/frontmatter.js`, `dist/frontmatter_parser.js`,
`dist/validation.js`, and `.d.ts` files for each. No bundling needed for a pure logic library.

**2. Update package.json**

```json
{
  "type": "module",
  "main": "dist/frontmatter.js",
  "types": "dist/frontmatter.d.ts",
  "exports": {
    ".": {
      "import": "./dist/frontmatter.js",
      "types": "./dist/frontmatter.d.ts"
    }
  },
  "files": ["dist/"],
  "scripts": {
    "build": "tsc",
    "test": "node --experimental-vm-modules node_modules/.bin/jest"
  }
}
```

**3. Optional: rewrite source in TypeScript**

~150 LOC total across three files. Types are already written in `dist/frontmatter.d.ts`.
Converting to `.ts` source is a short afternoon and eliminates the `allowJs` workaround.

**4. Publish**

```sh
npm run build
npm version minor   # breaking: consumers using the UMD dist directly will need to update
npm publish
```

After publishing, reuben.report (and any other consumer) can remove the esbuild alias
and import normally: `import fm from 'frontmatter-js'`.
