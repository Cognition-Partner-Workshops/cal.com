# Cal.com Lint Error Documentation

## Compile-Time Errors Found

### Error Summary
- **Total Errors Found**: 2 errors (lint/suspicious/noTsIgnore)
- **Location**: `packages/lib/__mocks__/constants.ts`
- **Error Type**: Unsafe use of `@ts-ignore` directive

### Error Details

The linter found 3 instances of `@ts-ignore` that should be replaced with `@ts-expect-error`:

#### Error 1: Line 37
```
__mocks__/constants.ts:37:8 lint/suspicious/noTsIgnore  FIXABLE

  ! Unsafe use of the @ts-ignore directive found in this comment.
  
    35 │   enableTeamBilling: () => {
    36 │     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  > 37 │     // @ts-ignore
       │        ^^^^^^^^^^
    38 │     mockedConstants.IS_TEAM_BILLING_ENABLED = true;
    39 │   },
```

#### Error 2: Line 42
```
__mocks__/constants.ts:42:8 lint/suspicious/noTsIgnore  FIXABLE

  ! Unsafe use of the @ts-ignore directive found in this comment.
  
    40 │   setWebsiteUrl: (url: string) => {
    41 │     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  > 42 │     // @ts-ignore
       │        ^^^^^^^^^^
    43 │     mockedConstants.WEBSITE_URL = url;
    44 │   },
```

#### Error 3: Line 48
```
__mocks__/constants.ts:48:10 lint/suspicious/noTsIgnore  FIXABLE

  ! Unsafe use of the @ts-ignore directive found in this comment.
  
    46 │     Object.entries(envVariables).forEach(([key, value]) => {
    47 │       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  > 48 │       // @ts-ignore
       │          ^^^^^^^^^^
    49 │       mockedConstants[key] = value;
    50 │     });
```

### Why This Is An Error

The `@ts-ignore` directive suppresses any kind of TypeScript error, including errors that might be fixed by upstream libraries or the compiler itself. This can hide legitimate issues.

The recommended fix is to use `@ts-expect-error` instead, which:
1. Only suppresses expected errors
2. Will report an error if the underlying issue is fixed (helping keep code clean)
3. Is more explicit about the intent

### Lint Output Before Fix
```
Found 2 errors.
Found 1378 warnings.
Found 21 infos.
lint ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  × Some errors were emitted while running checks.
```

---

## Resolution

### Fix Applied
Changed all 3 instances of `// @ts-ignore` to `// @ts-expect-error` in `packages/lib/__mocks__/constants.ts`:

- Line 37: `// @ts-ignore` → `// @ts-expect-error`
- Line 42: `// @ts-ignore` → `// @ts-expect-error`
- Line 48: `// @ts-ignore` → `// @ts-expect-error`

### Lint Output After Fix
```
noTsIgnore errors: 0 (all fixed)
Found 1375 warnings.
Found 21 infos.
```

The `lint/suspicious/noTsIgnore` errors have been completely resolved. The remaining warnings are style suggestions (missing return types, ternary operators, etc.) that are not blocking errors.

### Code Changes

**File: `packages/lib/__mocks__/constants.ts`**

Before:
```typescript
enableTeamBilling: () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mockedConstants.IS_TEAM_BILLING_ENABLED = true;
},
```

After:
```typescript
enableTeamBilling: () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  mockedConstants.IS_TEAM_BILLING_ENABLED = true;
},
```

Similar changes were made at lines 42 and 48.
