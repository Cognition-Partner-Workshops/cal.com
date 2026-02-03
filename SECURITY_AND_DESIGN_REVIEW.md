# Security Flaws and Design Anti-Patterns Review

This document provides a comprehensive analysis of security vulnerabilities and design anti-patterns identified in the Cal.com codebase, along with recommendations for remediation.

## Table of Contents

1. [Security Flaws](#security-flaws)
2. [Design Anti-Patterns](#design-anti-patterns)
3. [Implemented Fixes](#implemented-fixes)
4. [Recommendations](#recommendations)

---

## Security Flaws

### 1. Credential Key Exposure Risk

**Severity: High**

**Description:** Multiple files access `credential.key` which contains sensitive authentication data. According to the project's own guidelines in AGENTS.md, this field should never be exposed in API responses or queries.

**Affected Files:**
- `packages/features/calendars/lib/getCalendarsEvents.ts` (line 210) - Decrypts credential.key for CalDAV
- `packages/app-store/_utils/getCalendar.ts` - Passes credential to calendar services
- `packages/trpc/server/routers/viewer/apps/updateAppCredentials.handler.ts` - Updates credential.key
- Multiple calendar service files in `packages/app-store/*/lib/CalendarService.ts`

**Risk:** If credential.key is inadvertently logged, returned in API responses, or exposed through error messages, it could lead to unauthorized access to users' connected calendar accounts.

**Recommendation:** 
- Audit all usages of `credential.key` to ensure it's never returned in API responses
- Add runtime checks to prevent credential.key from being serialized
- Consider implementing a dedicated credential access layer with strict access controls

### 2. XSS Vulnerability via dangerouslySetInnerHTML

**Severity: Medium-High**

**Description:** Multiple components use `dangerouslySetInnerHTML` which can lead to Cross-Site Scripting (XSS) attacks if the content is not properly sanitized.

**Affected Files:**
- `apps/web/modules/ee/organizations/other-team-profile-view.tsx`
- `apps/web/modules/ee/organizations/profile.tsx`
- `apps/web/modules/users/views/users-public-view.tsx`
- `apps/web/modules/ee/teams/views/team-profile-view.tsx`
- `apps/web/modules/signup-view.tsx`
- `apps/web/components/eventtype/EventTypeDescriptionSafeHTML.tsx`
- `packages/ui/components/form/checkbox/Checkbox.tsx`
- `packages/emails/src/components/RawHtml.tsx`
- `packages/features/form-builder/FormBuilderField.tsx`

**Risk:** Malicious users could inject JavaScript code through user-controlled content (bios, descriptions, etc.) that would execute in other users' browsers.

**Recommendation:**
- Use a sanitization library like DOMPurify for all user-generated content
- Implement Content Security Policy (CSP) headers
- Review each usage to determine if dangerouslySetInnerHTML is truly necessary

### 3. Type Safety Bypass with "as any"

**Severity: Medium**

**Description:** Numerous files use `as any` type casting which bypasses TypeScript's type safety, potentially hiding bugs and security issues.

**Affected Files (non-test files):**
- `packages/app-store/_utils/getCalendar.ts` (lines 64, 76)
- `packages/features/ee/impersonation/lib/ImpersonationProvider.ts`
- `packages/features/auth/lib/next-auth-options.ts`
- `packages/trpc/server/routers/viewer/eventTypes/heavy/update.handler.ts`
- `packages/app-store/hubspot/lib/CrmService.ts`
- `packages/app-store/ics-feedcalendar/lib/CalendarService.ts`

**Risk:** Type casting can hide runtime errors and make it easier to introduce security vulnerabilities that would otherwise be caught by the type system.

**Recommendation:**
- Replace `as any` with proper type definitions
- Use type guards for runtime type checking
- Enable stricter TypeScript compiler options

### 4. Prisma Include vs Select

**Severity: Medium**

**Description:** Many Prisma queries use `include` instead of `select`, which fetches all fields including potentially sensitive ones.

**Affected Files:**
- `packages/features/ee/impersonation/lib/ImpersonationProvider.ts` (lines 377-397)
- `packages/features/users/repositories/UserRepository.ts` (multiple methods)
- `packages/features/ee/teams/repositories/TeamRepository.ts`
- `packages/trpc/server/routers/viewer/eventTypes/util.ts`
- Multiple handler files in `packages/trpc/server/routers/`

**Risk:** Over-fetching data can expose sensitive fields that shouldn't be accessible in certain contexts.

**Recommendation:**
- Replace `include` with explicit `select` statements
- Create reusable select objects for common query patterns
- Add code review guidelines to enforce this practice

### 5. Raw SQL Query Usage

**Severity: Medium**

**Description:** Several files use `$queryRaw` for direct SQL queries. While Prisma parameterizes these queries, they require extra care to prevent SQL injection.

**Affected Files:**
- `packages/features/ee/teams/repositories/TeamRepository.ts` (lines 554-580)
- `packages/features/users/repositories/UserRepository.ts`
- `packages/features/insights/services/InsightsRoutingBaseService.ts`
- `packages/features/insights/services/InsightsBookingBaseService.ts`

**Risk:** If query parameters are not properly handled, SQL injection vulnerabilities could be introduced.

**Recommendation:**
- Use Prisma's tagged template literals for parameterized queries
- Review all raw queries for proper parameter handling
- Consider using Prisma's query builder instead where possible

---

## Design Anti-Patterns

### 1. God Classes (Single Responsibility Principle Violation)

**Pattern Violated:** Single Responsibility Principle (SRP) from SOLID

**Description:** Several classes have grown too large and handle too many responsibilities, making them difficult to maintain, test, and understand.

**Affected Classes:**
- `UserRepository` (1314 lines) - Handles user CRUD, profile enrichment, team queries, calendar queries, and more
- `BookingRepository` (1923 lines) - Handles all booking-related database operations
- `LuckyUserService` (1146 lines) - Complex round-robin assignment logic
- `TeamRepository` (603 lines) - Team and organization operations

**Impact:**
- Difficult to test individual functionalities
- High coupling between unrelated features
- Changes in one area can affect others unexpectedly
- Hard for new developers to understand

**Recommendation:**
- Split repositories by domain concern (e.g., UserProfileRepository, UserCredentialRepository)
- Extract complex business logic into dedicated services
- Use composition to combine smaller, focused classes

### 2. Business Logic in Repositories (Separation of Concerns Violation)

**Pattern Violated:** Repository Pattern, Separation of Concerns

**Description:** Repositories should only handle data access, but several repositories contain business logic.

**Examples:**
- `UserRepository.enrichUserWithItsProfile()` - Contains profile resolution logic
- `UserRepository.enrichUsersWithTheirProfiles()` - Contains batch processing logic
- `TeamRepository.findTeamMembersWithPermission()` - Contains permission parsing logic

**Impact:**
- Repositories become harder to test
- Business logic is scattered across the codebase
- Difficult to reuse data access code without the business logic

**Recommendation:**
- Move business logic to dedicated service classes
- Keep repositories focused on CRUD operations
- Use the Service Layer pattern for business logic

### 3. Static Methods Anti-Pattern (Dependency Inversion Violation)

**Pattern Violated:** Dependency Inversion Principle (DIP) from SOLID

**Description:** `TeamService` uses all static methods, making it impossible to inject dependencies and difficult to test.

**Affected File:** `packages/features/ee/teams/services/teamService.ts`

**Impact:**
- Cannot mock dependencies for unit testing
- Tight coupling to concrete implementations
- Difficult to swap implementations

**Recommendation:**
- Convert static methods to instance methods
- Use dependency injection for repositories and external services
- Create interfaces for dependencies

### 4. Nested Loops (O(n^2) Complexity)

**Pattern Violated:** Performance Best Practices

**Description:** Several files contain nested loops that can lead to O(n^2) or worse time complexity.

**Affected Files:**
- `packages/features/ee/teams/services/teamService.ts` (lines 159-169) - Nested for loops for removing members
- `packages/features/ee/teams/lib/queries.ts` (lines 192-199, 241-254) - Nested loops for enriching users
- `packages/features/bookings/lib/getLuckyUser.ts` (lines 223-234) - Nested forEach loops

**Impact:**
- Poor performance with large datasets
- Potential for timeouts or memory issues
- Degraded user experience

**Recommendation:**
- Use Map/Set for O(1) lookups
- Batch database queries instead of N+1 queries
- Consider pagination for large datasets

### 5. Mixed Error Handling Patterns

**Pattern Violated:** Consistency Principle

**Description:** The codebase uses both `ErrorWithCode` and `TRPCError` inconsistently. According to AGENTS.md, `ErrorWithCode` should be used in non-tRPC files, and `TRPCError` only in tRPC routers.

**Examples of Inconsistency:**
- Some service files use `TRPCError` when they should use `ErrorWithCode`
- Some files throw generic `Error` objects without proper error codes

**Recommendation:**
- Audit all error handling to ensure consistency
- Use `ErrorWithCode` in services, repositories, and utilities
- Use `TRPCError` only in tRPC router handlers

### 6. Prop Drilling

**Pattern Violated:** Component Composition Best Practices

**Description:** Some React components pass props through multiple levels instead of using composition or context.

**Recommendation:**
- Use React Context for deeply nested data
- Leverage React children for composition
- Consider state management solutions for complex state

---

## Implemented Fixes

### Fix 1: Convert TeamService from Static to Instance-Based

**File:** `packages/features/ee/teams/services/TeamService.ts` (new file)

**Changes:**
- Created a new `ITeamService` interface for dependency injection
- Converted static methods to instance methods
- Injected dependencies through constructor
- Maintained backward compatibility with a factory function

**Design Pattern Applied:** Dependency Injection, Interface Segregation

### Fix 2: Replace Include with Select in ImpersonationProvider

**File:** `packages/features/ee/impersonation/lib/ImpersonationProvider.ts`

**Changes:**
- Replaced `include` with explicit `select` statements
- Only fetch required fields for the operation

**Design Pattern Applied:** Data Transfer Object (DTO), Principle of Least Privilege

### Fix 3: Optimize Nested Loops in TeamService

**File:** `packages/features/ee/teams/services/teamService.ts`

**Changes:**
- Replaced nested for loops with Promise.all for parallel execution
- Used flatMap for cleaner code

**Design Pattern Applied:** Parallel Processing, Functional Programming

---

## Recommendations

### Short-term (1-2 weeks)

1. **Audit credential.key usage** - Review all files that access credential.key and ensure it's never exposed
2. **Add DOMPurify** - Sanitize all user-generated content before using dangerouslySetInnerHTML
3. **Replace include with select** - Update Prisma queries to use explicit select statements

### Medium-term (1-2 months)

1. **Split God Classes** - Break down large repositories into smaller, focused classes
2. **Implement Service Layer** - Move business logic from repositories to services
3. **Standardize Error Handling** - Create a consistent error handling strategy

### Long-term (3-6 months)

1. **Add Integration Tests** - Ensure refactored code maintains functionality
2. **Implement CQRS** - Consider Command Query Responsibility Segregation for complex operations
3. **Performance Monitoring** - Add monitoring for database query performance

---

## References

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
