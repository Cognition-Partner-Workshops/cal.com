# Common Linting Mistakes in cal.com

This document records common linting errors and mistakes encountered during development, based on the project's linting configuration using Biome.

## Overview

The cal.com project uses Biome for linting TypeScript/JavaScript files. The lint configuration is defined in `biome.json` and runs via `yarn lint-staged` on staged files.

## Common Mistakes and How to Avoid Them

### 1. Unused Imports

**Issue**: Importing modules or types that are not used in the file.

**Example**:
```typescript
// Bad
import { useState, useEffect } from "react"; // useEffect not used

// Good
import { useState } from "react";
```

**Fix**: Remove unused imports or use them in your code.

### 2. Missing Type Annotations

**Issue**: Using `any` type or missing explicit type annotations.

**Example**:
```typescript
// Bad
const handleData = (data: any) => { ... }

// Good
interface DataType {
  id: string;
  name: string;
}
const handleData = (data: DataType) => { ... }
```

**Fix**: Define proper interfaces/types instead of using `any`.

### 3. Inconsistent Quote Style

**Issue**: Mixing single and double quotes inconsistently.

**Example**:
```typescript
// Bad
const name = "John";
const city = 'New York';

// Good (project uses double quotes)
const name = "John";
const city = "New York";
```

**Fix**: Use double quotes consistently as per project configuration.

### 4. Missing Semicolons

**Issue**: Inconsistent use of semicolons at the end of statements.

**Fix**: Follow the project's semicolon convention (the project uses semicolons).

### 5. Improper Import Order

**Issue**: Imports not organized in the expected order.

**Expected Order**:
1. External packages (react, next, etc.)
2. Internal packages (@calcom/*)
3. Relative imports (./*, ../*)

**Fix**: Organize imports in the correct order.

### 6. Console Statements

**Issue**: Leaving `console.log` statements in production code.

**Example**:
```typescript
// Bad
console.log("Debug:", data);

// Good
// Remove console.log or use proper logging utilities
```

**Fix**: Remove console statements before committing.

### 7. Unused Variables

**Issue**: Declaring variables that are never used.

**Example**:
```typescript
// Bad
const unusedVar = "test";
return <div>Hello</div>;

// Good
return <div>Hello</div>;
```

**Fix**: Remove unused variables or prefix with underscore if intentionally unused (`_unusedVar`).

### 8. Deprecated API Usage

**Issue**: Using deprecated Node.js or library APIs.

**Common Example**: The `punycode` module deprecation warning.

**Fix**: Use recommended alternatives as suggested in deprecation warnings.

## Running Lint Checks

To run lint checks locally:

```bash
# Run lint on staged files
yarn lint-staged

# Run Biome lint on specific files
yarn biome lint --error-on-warnings <file-path>
```

## Pre-commit Hooks

The project uses pre-commit hooks via Husky and lint-staged. Lint checks run automatically when you commit changes. If lint fails, the commit will be blocked until issues are fixed.

## Best Practices

1. Run `yarn lint-staged` before committing to catch issues early
2. Configure your IDE to show Biome warnings in real-time
3. Use TypeScript strict mode to catch type-related issues
4. Review the Biome configuration in `biome.json` for project-specific rules
