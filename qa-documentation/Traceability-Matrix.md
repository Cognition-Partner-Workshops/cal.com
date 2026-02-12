# Cal.com Requirements Traceability Matrix

**Version:** 1.0  
**Date:** February 12, 2026  
**Author:** QA Engineering Team  
**Purpose:** Links Business Requirements (BRD) to Unit Tests for full traceability

---

## 1. Overview

This traceability matrix maps each Business Requirement from the BRD to the corresponding unit tests, ensuring complete coverage and enabling impact analysis when requirements change.

| Summary | Count |
|---------|-------|
| BRD Requirements Traced | 11 modules |
| Total Unit Tests Mapped | 73 new + existing tests |
| Coverage Gaps Identified | See Section 4 |

---

## 2. Traceability Matrix

### 2.1 Authentication Module (BRD-AUTH)

| Req ID | Requirement Description | Test File | Test ID / Description | Test Type | Status |
|--------|------------------------|-----------|----------------------|-----------|--------|
| BRD-AUTH-001 | System shall validate email format | `packages/lib/emailSchema.test.ts` | emailRegex > should match valid email addresses | Positive | PASS |
| BRD-AUTH-001 | System shall validate email format | `packages/lib/emailSchema.test.ts` | emailRegex > should reject invalid email addresses | Negative | PASS |
| BRD-AUTH-001 | System shall validate email format | `packages/lib/emailSchema.test.ts` | emailRegex > should reject emails starting with a dot | Negative | PASS |
| BRD-AUTH-001 | System shall validate email format | `packages/lib/emailSchema.test.ts` | emailRegex > should reject emails with consecutive dots | Edge | PASS |
| BRD-AUTH-002 | System shall enforce email length limits (RFC 5321) | `packages/lib/emailSchema.test.ts` | emailSchema (zod) > should reject emails exceeding max length | Boundary | PASS |
| BRD-AUTH-002 | System shall enforce email length limits (RFC 5321) | `packages/lib/emailSchema.test.ts` | emailSchema (zod) > should accept valid emails | Positive | PASS |
| BRD-AUTH-002 | System shall enforce email length limits (RFC 5321) | `packages/lib/emailSchema.test.ts` | emailSchema (zod) > should reject invalid emails | Negative | PASS |
| BRD-AUTH-003 | System shall validate domain format | `packages/lib/emailSchema.test.ts` | domainRegex > should match valid domains | Positive | PASS |
| BRD-AUTH-003 | System shall validate domain format | `packages/lib/emailSchema.test.ts` | domainRegex > should reject invalid domains | Negative | PASS |
| BRD-AUTH-004 | System shall normalize emails with plus addressing | `packages/lib/extract-base-email.test.ts` | should return the base email without plus addressing | Positive | PASS |
| BRD-AUTH-004 | System shall normalize emails with plus addressing | `packages/lib/extract-base-email.test.ts` | should return the same email if no plus addressing is used | Positive | PASS |
| BRD-AUTH-004 | System shall normalize emails with plus addressing | `packages/lib/extract-base-email.test.ts` | should handle multiple plus signs | Edge | PASS |
| BRD-AUTH-004 | System shall normalize emails with plus addressing | `packages/lib/extract-base-email.test.ts` | should handle empty local part before plus | Edge | PASS |
| BRD-AUTH-004 | System shall normalize emails with plus addressing | `packages/lib/extract-base-email.test.ts` | should handle emails with subdomains | Positive | PASS |
| BRD-AUTH-005 | System shall support SMS-based authentication via phone numbers | `packages/lib/contructEmailFromPhoneNumber.test.ts` | should construct email from phone number with country code | Positive | PASS |
| BRD-AUTH-005 | System shall support SMS-based authentication via phone numbers | `packages/lib/contructEmailFromPhoneNumber.test.ts` | should construct email from phone number without plus sign | Positive | PASS |
| BRD-AUTH-005 | System shall support SMS-based authentication via phone numbers | `packages/lib/contructEmailFromPhoneNumber.test.ts` | should remove multiple plus signs | Edge | PASS |
| BRD-AUTH-005 | System shall support SMS-based authentication via phone numbers | `packages/lib/contructEmailFromPhoneNumber.test.ts` | should handle international phone numbers | Positive | PASS |

### 2.2 Event Types Module (BRD-EVT)

| Req ID | Requirement Description | Test File | Test ID / Description | Test Type | Status |
|--------|------------------------|-----------|----------------------|-----------|--------|
| BRD-EVT-001 | System shall support configurable event durations (minutes, hours, days) | `packages/lib/convertToNewDurationType.test.ts` | minutes conversions > should return same value for minutes to minutes | Positive | PASS |
| BRD-EVT-001 | System shall support configurable event durations | `packages/lib/convertToNewDurationType.test.ts` | minutes conversions > should convert minutes to hours | Positive | PASS |
| BRD-EVT-001 | System shall support configurable event durations | `packages/lib/convertToNewDurationType.test.ts` | minutes conversions > should convert minutes to days | Positive | PASS |
| BRD-EVT-001 | System shall support configurable event durations | `packages/lib/convertToNewDurationType.test.ts` | hours conversions > should convert hours to minutes | Positive | PASS |
| BRD-EVT-001 | System shall support configurable event durations | `packages/lib/convertToNewDurationType.test.ts` | hours conversions > should return same value for hours to hours | Positive | PASS |
| BRD-EVT-001 | System shall support configurable event durations | `packages/lib/convertToNewDurationType.test.ts` | hours conversions > should convert hours to days | Positive | PASS |
| BRD-EVT-001 | System shall support configurable event durations | `packages/lib/convertToNewDurationType.test.ts` | days conversions > should convert days to minutes | Positive | PASS |
| BRD-EVT-001 | System shall support configurable event durations | `packages/lib/convertToNewDurationType.test.ts` | days conversions > should convert days to hours | Positive | PASS |
| BRD-EVT-001 | System shall support configurable event durations | `packages/lib/convertToNewDurationType.test.ts` | days conversions > should return same value for days to days | Positive | PASS |
| BRD-EVT-002 | System shall correctly round fractional durations | `packages/lib/convertToNewDurationType.test.ts` | ceiling behavior > should ceil fractional results | Boundary | PASS |
| BRD-EVT-003 | System shall auto-detect duration type from value | `packages/lib/findDurationType.test.ts` | should return 'days' for values divisible by 1440 | Positive | PASS |
| BRD-EVT-003 | System shall auto-detect duration type from value | `packages/lib/findDurationType.test.ts` | should return 'hours' for values divisible by 60 but not 1440 | Positive | PASS |
| BRD-EVT-003 | System shall auto-detect duration type from value | `packages/lib/findDurationType.test.ts` | should return 'minutes' for values not divisible by 60 | Positive | PASS |
| BRD-EVT-003 | System shall auto-detect duration type from value | `packages/lib/findDurationType.test.ts` | should return 'days' for zero (divisible by all) | Boundary | PASS |
| BRD-EVT-004 | System shall provide predefined buffer times for events | `packages/features/eventtypes/lib/getDefinedBufferTimes.test.ts` | should return an array of predefined buffer times | Positive | PASS |
| BRD-EVT-004 | System shall provide predefined buffer times for events | `packages/features/eventtypes/lib/getDefinedBufferTimes.test.ts` | should contain all expected buffer time values | Positive | PASS |
| BRD-EVT-004 | System shall provide predefined buffer times for events | `packages/features/eventtypes/lib/getDefinedBufferTimes.test.ts` | should return buffer times in ascending order | Positive | PASS |
| BRD-EVT-004 | System shall provide predefined buffer times for events | `packages/features/eventtypes/lib/getDefinedBufferTimes.test.ts` | should include common meeting buffer durations | Positive | PASS |
| BRD-EVT-004 | System shall provide predefined buffer times for events | `packages/features/eventtypes/lib/getDefinedBufferTimes.test.ts` | should have maximum buffer time of 120 minutes | Boundary | PASS |
| BRD-EVT-004 | System shall provide predefined buffer times for events | `packages/features/eventtypes/lib/getDefinedBufferTimes.test.ts` | should have minimum buffer time of 5 minutes | Boundary | PASS |
| BRD-EVT-004 | System shall provide predefined buffer times for events | `packages/features/eventtypes/lib/getDefinedBufferTimes.test.ts` | should return all positive numbers | Positive | PASS |

### 2.3 Availability Management Module (BRD-AVL)

| Req ID | Requirement Description | Test File | Test ID / Description | Test Type | Status |
|--------|------------------------|-----------|----------------------|-----------|--------|
| BRD-AVL-001 | System shall define a standard work week schedule | `packages/lib/availability.test.ts` | DEFAULT_SCHEDULE > should have 7 days (Sunday-Saturday) | Positive | PASS |
| BRD-AVL-001 | System shall define a standard work week schedule | `packages/lib/availability.test.ts` | DEFAULT_SCHEDULE > should have empty arrays for Sunday and Saturday | Positive | PASS |
| BRD-AVL-001 | System shall define a standard work week schedule | `packages/lib/availability.test.ts` | DEFAULT_SCHEDULE > should have working hours for Monday-Friday | Positive | PASS |
| BRD-AVL-002 | System shall correctly define time constants | `packages/lib/availability.test.ts` | constants > should define MINUTES_IN_DAY as 1440 | Positive | PASS |
| BRD-AVL-002 | System shall correctly define time constants | `packages/lib/availability.test.ts` | constants > should define MINUTES_DAY_END as 1439 | Positive | PASS |
| BRD-AVL-002 | System shall correctly define time constants | `packages/lib/availability.test.ts` | constants > should define MINUTES_DAY_START as 0 | Positive | PASS |
| BRD-AVL-003 | System shall convert schedules to availability entries | `packages/lib/availability.test.ts` | getAvailabilityFromSchedule > should return empty array for empty schedule | Edge | PASS |
| BRD-AVL-003 | System shall convert schedules to availability entries | `packages/lib/availability.test.ts` | getAvailabilityFromSchedule > should merge days with same time ranges | Positive | PASS |
| BRD-AVL-003 | System shall convert schedules to availability entries | `packages/lib/availability.test.ts` | getAvailabilityFromSchedule > should keep separate entries for different time ranges | Positive | PASS |
| BRD-AVL-003 | System shall convert schedules to availability entries | `packages/lib/availability.test.ts` | getAvailabilityFromSchedule > should handle schedule with only weekend availability | Edge | PASS |
| BRD-AVL-003 | System shall convert schedules to availability entries | `packages/lib/availability.test.ts` | getAvailabilityFromSchedule > should handle single day availability | Positive | PASS |

### 2.4 Booking Flow Module (BRD-BKG)

| Req ID | Requirement Description | Test File | Test ID / Description | Test Type | Status |
|--------|------------------------|-----------|----------------------|-----------|--------|
| BRD-BKG-001 | System shall support custom reply-to email for bookings | `packages/lib/getReplyToEmail.qa.test.ts` | should return customReplyToEmail when set | Positive | PASS |
| BRD-BKG-001 | System shall support custom reply-to email for bookings | `packages/lib/getReplyToEmail.qa.test.ts` | should return organizer email when customReplyToEmail is null | Positive | PASS |
| BRD-BKG-001 | System shall support custom reply-to email for bookings | `packages/lib/getReplyToEmail.qa.test.ts` | should return organizer email when customReplyToEmail is undefined | Edge | PASS |
| BRD-BKG-001 | System shall support custom reply-to email for bookings | `packages/lib/getReplyToEmail.qa.test.ts` | should return organizer email when customReplyToEmail is empty string | Edge | PASS |
| BRD-BKG-002 | System shall allow excluding organizer email from reply-to | `packages/lib/getReplyToEmail.qa.test.ts` | should return null when excludeOrganizerEmail is true and no custom reply | Negative | PASS |
| BRD-BKG-002 | System shall allow excluding organizer email from reply-to | `packages/lib/getReplyToEmail.qa.test.ts` | should return customReplyToEmail even when excludeOrganizerEmail is true | Edge | PASS |

### 2.5 Organizations & Teams Module (BRD-ORG)

| Req ID | Requirement Description | Test File | Test ID / Description | Test Type | Status |
|--------|------------------------|-----------|----------------------|-----------|--------|
| BRD-ORG-001 | System shall generate placeholder avatars for users/teams | `packages/lib/defaultAvatarImage.test.ts` | should return the avatar URL if provided | Positive | PASS |
| BRD-ORG-001 | System shall generate placeholder avatars for users/teams | `packages/lib/defaultAvatarImage.test.ts` | should return placeholder URL when avatar is null | Positive | PASS |
| BRD-ORG-001 | System shall generate placeholder avatars for users/teams | `packages/lib/defaultAvatarImage.test.ts` | should return placeholder URL when avatar is undefined | Positive | PASS |
| BRD-ORG-001 | System shall generate placeholder avatars for users/teams | `packages/lib/defaultAvatarImage.test.ts` | should handle null name with placeholder | Edge | PASS |
| BRD-ORG-001 | System shall generate placeholder avatars for users/teams | `packages/lib/defaultAvatarImage.test.ts` | should handle undefined name with placeholder | Edge | PASS |
| BRD-ORG-001 | System shall generate placeholder avatars for users/teams | `packages/lib/defaultAvatarImage.test.ts` | should encode special characters in name | Edge | PASS |
| BRD-ORG-001 | System shall generate placeholder avatars for users/teams | `packages/lib/defaultAvatarImage.test.ts` | should return avatar URL even if it is an empty string | Edge | PASS |

### 2.6 Embed & API Module (BRD-API)

| Req ID | Requirement Description | Test File | Test ID / Description | Test Type | Status |
|--------|------------------------|-----------|----------------------|-----------|--------|
| BRD-API-001 | System shall export data in CSV format | `packages/lib/csvUtils.test.ts` | sanitizeValue > should return plain values unchanged | Positive | PASS |
| BRD-API-001 | System shall export data in CSV format | `packages/lib/csvUtils.test.ts` | sanitizeValue > should wrap values with commas in quotes | Positive | PASS |
| BRD-API-001 | System shall export data in CSV format | `packages/lib/csvUtils.test.ts` | sanitizeValue > should wrap values with newlines in quotes | Positive | PASS |
| BRD-API-001 | System shall export data in CSV format | `packages/lib/csvUtils.test.ts` | sanitizeValue > should double-escape quotes and wrap in quotes | Positive | PASS |
| BRD-API-001 | System shall export data in CSV format | `packages/lib/csvUtils.test.ts` | sanitizeValue > should handle empty string | Edge | PASS |
| BRD-API-002 | System shall convert structured data to CSV | `packages/lib/csvUtils.test.ts` | objectsToCsv > should convert array of objects to CSV string | Positive | PASS |
| BRD-API-002 | System shall convert structured data to CSV | `packages/lib/csvUtils.test.ts` | objectsToCsv > should return empty string for empty array | Edge | PASS |
| BRD-API-002 | System shall convert structured data to CSV | `packages/lib/csvUtils.test.ts` | objectsToCsv > should handle values with special characters | Edge | PASS |
| BRD-API-002 | System shall convert structured data to CSV | `packages/lib/csvUtils.test.ts` | objectsToCsv > should handle single row | Positive | PASS |
| BRD-API-002 | System shall convert structured data to CSV | `packages/lib/csvUtils.test.ts` | objectsToCsv > should handle undefined values | Edge | PASS |

---

## 3. Existing Test Coverage (Pre-existing Tests Mapped to BRD)

The following existing tests in the repository also provide coverage for BRD requirements:

| BRD Module | Existing Test File | Tests | Coverage Area |
|------------|-------------------|-------|---------------|
| BRD-AUTH | `packages/lib/slugify.test.ts` | 8+ | URL slug generation for user profiles |
| BRD-AUTH | `packages/lib/getValidRhfFieldName.test.ts` | 10+ | Form field validation |
| BRD-EVT | `packages/features/eventtypes/lib/eventNaming.test.ts` | 30+ | Event name templating and validation |
| BRD-EVT | `packages/features/eventtypes/lib/checkForEmptyAssignment.test.ts` | 5 | Team event assignment validation |
| BRD-BKG | `packages/lib/getReplyToEmail.test.ts` | 2 | Reply-to email (base tests) |
| BRD-BKG | `packages/features/bookings/lib/handleNewBooking/test/buildDryRunBooking.test.ts` | 1+ | Dry run booking builder |
| BRD-AVL | `packages/lib/weekstart.test.ts` | 3 | Week start day sorting |
| BRD-AVL | `packages/features/eventtypes/lib/isCurrentlyAvailable.test.ts` | 10+ | Real-time availability check |
| BRD-AUTH | `packages/lib/crypto.test.ts` | 5+ | Symmetric encryption/decryption |
| BRD-AUTH | `packages/lib/text.test.ts` | 6+ | Text truncation utilities |
| BRD-API | `packages/embeds/embed-react/test/packaged/api.test.ts` | 1+ | Embed API availability |
| BRD-ORG | `packages/features/ee/organizations/lib/getTeamUrlSync.test.ts` | 2+ | Organization URL generation |
| BRD-BKG | `packages/lib/CalEventParser.test.ts` | 5+ | Calendar event parsing |
| BRD-API | `packages/lib/checkRateLimitAndThrowError.test.ts` | 3+ | API rate limiting |

---

## 4. Coverage Gap Analysis

| BRD Module | Gap Description | Priority | Recommendation |
|------------|----------------|----------|----------------|
| BRD-VID (Video Conferencing) | No unit tests for Daily.co/Zoom/Meet integration logic | Medium | Add mock-based tests for video provider selection |
| BRD-PAY (Payments) | No unit tests for Stripe payment flow utilities | Medium | Add tests for payment amount calculation and currency handling |
| BRD-WFL (Workflows) | Limited unit tests for workflow trigger/action logic | Medium | Add tests for notification scheduling and reminder logic |
| BRD-RTG (Routing Forms) | Limited unit tests for form routing logic | Low | Add tests for routing condition evaluation |
| BRD-CAL (Calendar Integration) | No unit tests for calendar sync utilities | Medium | Add tests for calendar event creation/update helpers |

---

## 5. Requirement Coverage Summary

| BRD Module | Requirements Covered | New Tests | Existing Tests | Total Coverage |
|------------|---------------------|-----------|----------------|----------------|
| Authentication (BRD-AUTH) | 5 | 17 | 30+ | High |
| Event Types (BRD-EVT) | 4 | 21 | 35+ | High |
| Availability (BRD-AVL) | 3 | 11 | 13+ | High |
| Booking Flow (BRD-BKG) | 2 | 6 | 8+ | Medium |
| Organizations (BRD-ORG) | 1 | 7 | 2+ | Medium |
| Embed & API (BRD-API) | 2 | 10 | 4+ | Medium |
| Video Conferencing (BRD-VID) | 0 | 0 | 0 | Gap |
| Payments (BRD-PAY) | 0 | 0 | 0 | Gap |
| Workflows (BRD-WFL) | 0 | 0 | Limited | Gap |
| Routing Forms (BRD-RTG) | 0 | 0 | Limited | Gap |
| Calendar Integration (BRD-CAL) | 0 | 0 | 0 | Gap |
| **Total** | **17** | **73** | **90+** | |
