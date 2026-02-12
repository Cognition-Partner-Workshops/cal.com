# Cal.com Unit Test Coverage Report

**Version:** 1.0  
**Date:** February 12, 2026  
**Author:** QA Engineering Team  
**Test Framework:** Vitest v4.0.16

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Files** | 498 (491 passed, 7 skipped) |
| **Total Unit Tests** | 4,781 (4,703 passed, 66 skipped, 12 todo) |
| **New Tests Added (This Cycle)** | 73 tests across 10 new test files |
| **Pass Rate** | 100% (of executed tests) |
| **Test Execution Time** | ~186 seconds |
| **Pre-existing Errors** | 1 (Salesforce GraphQL unhandled rejection - not related to new tests) |

---

## 2. New Unit Tests Created

### 2.1 Summary by Module

| # | Test File | Module | Tests | Status |
|---|-----------|--------|-------|--------|
| 1 | `packages/lib/extract-base-email.test.ts` | Authentication / Email | 5 | PASS |
| 2 | `packages/lib/defaultAvatarImage.test.ts` | User Profile / Avatar | 7 | PASS |
| 3 | `packages/lib/contructEmailFromPhoneNumber.test.ts` | Authentication / SMS | 4 | PASS |
| 4 | `packages/lib/convertToNewDurationType.test.ts` | Event Types / Duration | 10 | PASS |
| 5 | `packages/lib/findDurationType.test.ts` | Event Types / Duration | 4 | PASS |
| 6 | `packages/lib/csvUtils.test.ts` | Utility / Data Export | 10 | PASS |
| 7 | `packages/lib/emailSchema.test.ts` | Authentication / Validation | 8 | PASS |
| 8 | `packages/lib/availability.test.ts` | Availability Management | 11 | PASS |
| 9 | `packages/lib/getReplyToEmail.qa.test.ts` | Booking / Email Notification | 6 | PASS |
| 10 | `packages/features/eventtypes/lib/getDefinedBufferTimes.test.ts` | Event Types / Buffer Times | 7 | PASS |
| | **Total** | | **73** | **ALL PASS** |

### 2.2 Tests by Type

| Test Type | Count | Percentage |
|-----------|-------|------------|
| Positive (Happy Path) | 42 | 57.5% |
| Negative (Invalid Input) | 12 | 16.4% |
| Edge Case | 14 | 19.2% |
| Boundary Validation | 5 | 6.9% |
| **Total** | **73** | **100%** |

---

## 3. Coverage by BRD Module

### 3.1 Authentication Module (BRD-AUTH)

| Area | Test Coverage | Tests |
|------|--------------|-------|
| Email extraction (plus addressing) | Covered | 5 tests |
| Email validation (regex, schema) | Covered | 8 tests |
| Phone-to-email construction (SMS) | Covered | 4 tests |
| **Subtotal** | | **17 tests** |

**Covered Functions:**
- `extractBaseEmail()` - Plus-addressing email normalization
- `emailRegex` / `domainRegex` / `emailSchema` - Email and domain validation
- `contructEmailFromPhoneNumber()` - SMS phone number to email mapping

### 3.2 Event Types Module (BRD-EVT)

| Area | Test Coverage | Tests |
|------|--------------|-------|
| Duration type conversion | Covered | 10 tests |
| Duration type detection | Covered | 4 tests |
| Buffer time configuration | Covered | 7 tests |
| **Subtotal** | | **21 tests** |

**Covered Functions:**
- `convertToNewDurationType()` - Minutes/hours/days conversion with ceiling
- `findDurationType()` - Auto-detect duration unit from minute value
- `getDefinedBufferTimes()` - Pre/post event buffer time options

### 3.3 Availability Management Module (BRD-AVL)

| Area | Test Coverage | Tests |
|------|--------------|-------|
| Default schedule structure | Covered | 3 tests |
| Schedule-to-availability conversion | Covered | 5 tests |
| Availability constants | Covered | 3 tests |
| **Subtotal** | | **11 tests** |

**Covered Functions:**
- `DEFAULT_SCHEDULE` - 7-day default work week (Mon-Fri 9-5)
- `getAvailabilityFromSchedule()` - Convert schedule to availability entries
- `MINUTES_IN_DAY`, `MINUTES_DAY_END`, `MINUTES_DAY_START` - Time constants

### 3.4 Booking Flow Module (BRD-BKG)

| Area | Test Coverage | Tests |
|------|--------------|-------|
| Reply-to email logic | Covered | 6 tests |
| **Subtotal** | | **6 tests** |

**Covered Functions:**
- `getReplyToEmail()` - Custom reply-to email with organizer fallback and exclusion

### 3.5 User Profile / Organizations Module (BRD-ORG)

| Area | Test Coverage | Tests |
|------|--------------|-------|
| Placeholder avatar generation | Covered | 7 tests |
| **Subtotal** | | **7 tests** |

**Covered Functions:**
- `getPlaceholderAvatar()` - Avatar URL with ui-avatars.com fallback

### 3.6 Utility / Data Export Module (BRD-API)

| Area | Test Coverage | Tests |
|------|--------------|-------|
| CSV sanitization | Covered | 5 tests |
| Object-to-CSV conversion | Covered | 5 tests |
| **Subtotal** | | **10 tests** |

**Covered Functions:**
- `sanitizeValue()` - CSV injection prevention (quotes, commas, newlines)
- `objectsToCsv()` - Structured data to CSV string conversion

---

## 4. Full Test Suite Summary (All Existing + New)

### 4.1 Test Files by Package

| Package | Test Files | Status |
|---------|-----------|--------|
| `packages/lib` | 50+ | Pass |
| `packages/features` | 60+ | Pass |
| `packages/app-store` | 80+ | Pass |
| `packages/trpc` | 20+ | Pass (some skipped) |
| `packages/ui` | 10+ | Pass (some skipped) |
| `packages/prisma` | 30+ | Pass |
| `apps/web` | 70+ | Pass |
| `packages/embeds` | 5+ | Pass |
| Other packages | 30+ | Pass |
| **Total** | **498** | **491 passed, 7 skipped** |

### 4.2 Test Execution Details

```
Test Framework: Vitest v4.0.16
Environment: Node.js (TZ=UTC)
Test Files:  491 passed | 7 skipped (498)
Tests:       4,703 passed | 66 skipped | 12 todo (4,781)
Duration:    186.29s (transform 68.04s, setup 78.56s, import 692.45s, tests 126.32s)
```

### 4.3 Skipped Tests (Pre-existing)

The following test files are skipped due to pending implementation or environment dependencies:
- `packages/ui/components/button/button.test.tsx` (UI component tests - skipped)
- `packages/trpc/server/routers/viewer/bookings/confirm.handler.test.ts` (skipped)
- `packages/trpc/server/routers/viewer/bookings/editLocation.handler.test.ts` (skipped)
- `packages/trpc/server/routers/viewer/teams/listMembers.test.ts` (skipped)
- `packages/trpc/server/routers/viewer/organizations/bulkDeleteUsers.test.ts` (skipped)
- `packages/features/crmManager/crmManager.test.ts` (skipped)
- `packages/features/bookings/lib/handleNewBooking/test/managed-event-type-booking.test.ts` (skipped)

---

## 5. Linting Results

| Check | Result |
|-------|--------|
| **Tool** | Biome (via lint-staged) |
| **Files Checked** | 10 new test files |
| **Errors** | 0 |
| **Warnings** | 0 (after fixes) |

### 5.1 Lint Issues Fixed During Development

| File | Issue | Fix Applied |
|------|-------|-------------|
| `emailSchema.test.ts` | `style/useTemplate` - String concatenation instead of template literal | Changed to template literal |
| `csvUtils.test.ts` | `suspicious/noExplicitAny` - Used `any` type | Changed to `unknown` type |

### 5.2 Common Lint Patterns to Watch

Based on the linting history, the following patterns commonly trigger warnings:
1. **String concatenation** - Always use template literals instead of `+` operator
2. **`any` type usage** - Use `unknown` or specific types instead of `any`
3. **Unused imports** - Ensure all imported modules are referenced in tests

---

## 6. Recommendations

1. **Increase coverage for skipped test files** - 7 test files are currently skipped and should be enabled when dependencies are available
2. **Add integration tests** - Current unit tests cover utility functions; integration tests would cover API endpoints and database operations
3. **Address pre-existing unhandled error** - The Salesforce GraphQL unhandled rejection should be investigated
4. **Expand event naming tests** - The existing `eventNaming.test.ts` (552 lines) provides good patterns for further test expansion
5. **Add mutation tests** - Consider adding mutation testing to verify test effectiveness
