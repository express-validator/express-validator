---
name: upgrade-validator
description: Upgrades the npm `validator` dependency and syncs express-validator chain types, implementations, options, and `declarations/validator.d.ts` with validator.js releases. Use when the user says "upgrade validator", asks to bump the validator package, or is manually upgrading validatorjs/validator.js.
---

# upgrade-validator

## Before you start

- Record the **previous** `validator` version from `package.json` (and confirm after upgrade from `package.json` / lockfile).
- The **source of truth** for what changed is [validatorjs/validator.js](https://github.com/validatorjs/validator.js). Use a tag range compare (e.g. `v<old>...v<new>`) to see commits and the diff between versions.

## 1. Upgrade the package

From the repo root, install the latest `validator` and persist it to `package.json`:

```bash
npm install validator@latest
```

## 2. Map upstream changes to this codebase

For each **new** validator, sanitizer, or option type introduced between the old and new version (use the GitHub compare / changelog, not only commit titles):

### New _validator_ (check API)

- **`src/chain/validators.ts`**: under `// validator's validators`, add the new method signature **in alphabetical order** with the rest. Follow existing JSDoc style for adjacent methods.
- **`src/chain/validators-impl.ts`**: under `// Standard validators`, add the implementation **in alphabetical order**, delegating with `addStandardValidation(validator.<name>, ...)` the same way sibling methods do. If upstream uses custom logic (see e.g. `isAlpha`, `toArray`-style), match the existing pattern in that file.

### New _sanitizer_

- **`src/chain/sanitizers.ts`**: under `// validator's sanitizers`, add the method **in alphabetical order**.
- **`src/chain/sanitizers-impl.ts`**: under `// Standard sanitizers`, add the implementation **in alphabetical order** (`addStandardSanitization` vs `customSanitizer` as appropriate).

### New _options_ / types

- **`src/options.ts`**: add or extend types **only when** the new value is:
  - **enum-like** (e.g. a new locale, a new UUID version constant), or
  - an **object** (e.g. `{ min, max }`, or other structured options).
- **Skip** `options.ts` for parameters that are only a plain `string` or `number` with no new shared option shape—use inline types on the chain method if needed, consistent with nearby code.

### Everything else

- Upstream **internal** or **non–type-surface** changes that do not add or change validator/sanitizer **signatures** need **no** express-validator edits beyond the version bump and declaration sync (if any).

## 3. Declarations

- Update **`declarations/validator.d.ts`**: new `export function` entries must stay **in alphabetical order** and match the installed `validator` call signatures. Reuse `import('../src/options').<Type>` for option types the same way existing declarations do.

## 4. Verify

From the repo root:

```bash
npm test
npm run lint
npm run docs:regenerate-api
```

Fix any failures before finishing.

## Quick reference — section markers

| File                           | Section comment             |
| ------------------------------ | --------------------------- |
| `src/chain/validators.ts`      | `// validator's validators` |
| `src/chain/validators-impl.ts` | `// Standard validators`    |
| `src/chain/sanitizers.ts`      | `// validator's sanitizers` |
| `src/chain/sanitizers-impl.ts` | `// Standard sanitizers`    |
