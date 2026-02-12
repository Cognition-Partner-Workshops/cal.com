# Comprehensive Test Cases Document
# Cal.com - Open Source Scheduling Platform

**Document Version:** 1.0  
**Date:** February 2026  
**Prepared By:** QA Engineering Team

---

## Table of Contents

1. [Test Case Format](#test-case-format)
2. [Authentication Module Test Cases](#1-authentication-module-test-cases)
3. [Event Types Module Test Cases](#2-event-types-module-test-cases)
4. [Booking Flow Module Test Cases](#3-booking-flow-module-test-cases)
5. [Availability Management Test Cases](#4-availability-management-test-cases)
6. [Calendar Integrations Test Cases](#5-calendar-integrations-test-cases)
7. [Video Conferencing Test Cases](#6-video-conferencing-test-cases)
8. [Workflows & Automations Test Cases](#7-workflows--automations-test-cases)
9. [Organizations & Teams Test Cases](#8-organizations--teams-test-cases)
10. [Payments Module Test Cases](#9-payments-module-test-cases)
11. [Embed & API Test Cases](#10-embed--api-test-cases)
12. [Routing Forms Test Cases](#11-routing-forms-test-cases)

---

## Test Case Format

Each test case follows this standardized format:

| Field | Description |
|-------|-------------|
| Test Case ID | Unique identifier (MODULE-TYPE-XXX) |
| Module/Feature | Feature area being tested |
| Test Scenario | Description of what is being tested |
| Preconditions | Required setup before test execution |
| Test Steps | Step-by-step instructions |
| Expected Results | Expected outcome |
| Test Data | Sample data for testing |
| Priority | High / Medium / Low |
| Test Type | Functional / Regression / Edge / Boundary / Network |

**Test Type Categories:**
- **Positive (P):** Happy path scenarios validating expected behavior
- **Negative (N):** Invalid inputs, unauthorized access, error handling
- **Edge (E):** Boundary conditions, unusual but valid scenarios
- **Boundary (B):** Min/max values, character limits, date ranges
- **Network (NW):** Offline behavior, timeout handling, retry mechanisms
- **Regression (R):** Critical paths for regression testing

---

## Test Case Summary

### Total Test Cases: 105

### Summary by Module

| # | Module | Positive | Negative | Edge | Boundary | Network | Total |
|---|--------|----------|----------|------|----------|---------|-------|
| 1 | Authentication | 5 | 6 | 2 | 2 | 1 | 16 |
| 2 | Event Types | 12 | 2 | 0 | 2 | 0 | 16 |
| 3 | Booking Flow | 13 | 4 | 4 | 0 | 0 | 21 |
| 4 | Availability Management | 7 | 1 | 1 | 0 | 0 | 9 |
| 5 | Calendar Integrations | 3 | 1 | 0 | 0 | 1 | 5 |
| 6 | Video Conferencing | 4 | 0 | 0 | 0 | 0 | 4 |
| 7 | Workflows & Automations | 5 | 1 | 0 | 0 | 0 | 6 |
| 8 | Organizations & Teams | 7 | 2 | 0 | 0 | 0 | 9 |
| 9 | Payments | 8 | 0 | 0 | 0 | 0 | 8 |
| 10 | Embed & API | 6 | 0 | 0 | 0 | 0 | 6 |
| 11 | Routing Forms | 4 | 1 | 0 | 0 | 0 | 5 |
| | **Total** | **74** | **18** | **7** | **4** | **2** | **105** |

### Summary by Test Type

| Test Type | Count | Percentage | Description |
|-----------|-------|------------|-------------|
| Positive (P) | 74 | 70.5% | Happy path scenarios validating expected behavior |
| Negative (N) | 18 | 17.1% | Invalid inputs, unauthorized access, error handling |
| Edge (E) | 7 | 6.7% | Boundary conditions, unusual but valid scenarios |
| Boundary (B) | 4 | 3.8% | Min/max values, character limits, date ranges |
| Network (NW) | 2 | 1.9% | Offline behavior, timeout handling, retry mechanisms |

### Summary by Priority

| Priority | Count | Percentage |
|----------|-------|------------|
| High | 62 | 59.0% |
| Medium | 33 | 31.4% |
| Low | 10 | 9.5% |

---

## 1. Authentication Module Test Cases

### 1.1 User Registration

#### TC-AUTH-P-001: Successful Email Registration
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-001 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify user can successfully register with valid email and password |
| **Preconditions** | User is on the signup page (/signup), email is not already registered |
| **Test Steps** | 1. Navigate to /signup<br>2. Click "Continue with Email" button<br>3. Enter valid username (e.g., "testuser123")<br>4. Enter valid email (e.g., "testuser@example.com")<br>5. Enter valid password meeting requirements (e.g., "Password99!")<br>6. Click "Sign up" button |
| **Expected Results** | 1. User is redirected to email verification page (/auth/verify-email)<br>2. Verification email is sent to user<br>3. User record is created in database with correct username |
| **Test Data** | Username: testuser123, Email: testuser@example.com, Password: Password99! |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-AUTH-P-002: Successful Google OAuth Registration
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-002 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify user can register using Google OAuth |
| **Preconditions** | User is on the signup page, has valid Google account |
| **Test Steps** | 1. Navigate to /signup<br>2. Click "Continue with Google" button<br>3. Complete Google OAuth flow<br>4. Authorize Cal.com access |
| **Expected Results** | 1. User is redirected to /auth/sso/google<br>2. After OAuth completion, user account is created<br>3. User is redirected to getting-started or event-types page |
| **Test Data** | Valid Google account credentials |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-AUTH-P-003: Successful SAML Registration
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-003 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify user can register using SAML SSO |
| **Preconditions** | SAML is configured for organization, user is on signup page |
| **Test Steps** | 1. Navigate to /signup<br>2. Click "Continue with SAML" button<br>3. Enter organization email domain<br>4. Complete SAML authentication flow |
| **Expected Results** | 1. User is redirected to SAML provider<br>2. After authentication, user account is created<br>3. User is associated with organization |
| **Test Data** | Valid SAML-enabled organization email |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-AUTH-N-001: Registration with Existing Username
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-N-001 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify system prevents registration with already taken username |
| **Preconditions** | User "pro" already exists in the system |
| **Test Steps** | 1. Navigate to /signup<br>2. Click "Continue with Email"<br>3. Enter existing username "pro"<br>4. Enter new email "newuser@example.com"<br>5. Enter valid password<br>6. Click "Sign up" button |
| **Expected Results** | 1. Error alert is displayed<br>2. Message shows "Username or email is already taken"<br>3. User is not created |
| **Test Data** | Username: pro (existing), Email: newuser@example.com |
| **Priority** | High |
| **Test Type** | Negative, Regression |

#### TC-AUTH-N-002: Registration with Existing Email
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-N-002 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify system prevents registration with already registered email |
| **Preconditions** | Email "existing@example.com" is already registered |
| **Test Steps** | 1. Navigate to /signup<br>2. Click "Continue with Email"<br>3. Enter new username "newuser"<br>4. Enter existing email "existing@example.com"<br>5. Enter valid password<br>6. Click "Sign up" button |
| **Expected Results** | 1. Error alert is displayed<br>2. Message shows "Username or email is already taken"<br>3. User is not created |
| **Test Data** | Username: newuser, Email: existing@example.com (existing) |
| **Priority** | High |
| **Test Type** | Negative, Regression |

#### TC-AUTH-N-003: Registration with Invalid Password
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-N-003 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify system rejects weak passwords |
| **Preconditions** | User is on signup page |
| **Test Steps** | 1. Navigate to /signup<br>2. Click "Continue with Email"<br>3. Enter valid username<br>4. Enter valid email<br>5. Enter weak password "123"<br>6. Click "Sign up" button |
| **Expected Results** | 1. Validation error is displayed<br>2. Password requirements are shown<br>3. Form submission is prevented |
| **Test Data** | Password: 123 (too weak) |
| **Priority** | High |
| **Test Type** | Negative |

#### TC-AUTH-N-004: Registration with Org Invite Token for Existing User
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-N-004 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify existing user cannot overwrite password via org invite signup |
| **Preconditions** | User exists with original password, org invite token exists for user's email |
| **Test Steps** | 1. Navigate to /signup?token={invite_token}<br>2. Enter different password than original<br>3. Click "Sign up" button |
| **Expected Results** | 1. API returns 409 status (user already exists)<br>2. User is redirected to login page<br>3. Original password is NOT overwritten<br>4. User can still login with original password |
| **Test Data** | Original password: OriginalPass99!, Attacker password: AttackerPass99! |
| **Priority** | High |
| **Test Type** | Negative, Security |

#### TC-AUTH-B-001: Username Minimum Length
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-B-001 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify minimum username length validation |
| **Preconditions** | User is on signup page |
| **Test Steps** | 1. Navigate to /signup<br>2. Click "Continue with Email"<br>3. Enter single character username "a"<br>4. Enter valid email and password<br>5. Attempt to submit |
| **Expected Results** | 1. Validation error for username length<br>2. Form submission prevented |
| **Test Data** | Username: a (1 character) |
| **Priority** | Medium |
| **Test Type** | Boundary |

#### TC-AUTH-B-002: Password Maximum Length
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-B-002 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify password maximum length handling |
| **Preconditions** | User is on signup page |
| **Test Steps** | 1. Navigate to /signup<br>2. Click "Continue with Email"<br>3. Enter valid username and email<br>4. Enter 256+ character password<br>5. Attempt to submit |
| **Expected Results** | 1. System handles long password appropriately<br>2. Either accepts or shows validation error |
| **Test Data** | Password: 256+ character string |
| **Priority** | Low |
| **Test Type** | Boundary |

#### TC-AUTH-E-001: Signup with Query Parameters Prefill
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-E-001 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify signup form prefills from URL query parameters |
| **Preconditions** | None |
| **Test Steps** | 1. Navigate to /signup?username=rick-jones&email=rick-jones@example.com<br>2. Click "Continue with Email"<br>3. Verify form fields |
| **Expected Results** | 1. Username field is prefilled with "rick-jones"<br>2. Email field is prefilled with "rick-jones@example.com" |
| **Test Data** | URL params: username=rick-jones, email=rick-jones@example.com |
| **Priority** | Medium |
| **Test Type** | Edge |

#### TC-AUTH-E-002: Signup with Team Invite Token
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-E-002 |
| **Module/Feature** | Authentication - User Registration |
| **Test Scenario** | Verify signup with team invite token prefills user data |
| **Preconditions** | Valid team invite token exists |
| **Test Steps** | 1. Navigate to /signup?token={valid_token}<br>2. Verify form fields are prefilled<br>3. Complete registration |
| **Expected Results** | 1. Username and email are prefilled from token<br>2. User is created and added to team<br>3. Team membership is established |
| **Test Data** | Valid team invite token |
| **Priority** | Medium |
| **Test Type** | Edge |

### 1.2 User Login

#### TC-AUTH-P-004: Successful Email/Password Login
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-004 |
| **Module/Feature** | Authentication - User Login |
| **Test Scenario** | Verify user can login with valid credentials |
| **Preconditions** | User account exists with known credentials |
| **Test Steps** | 1. Navigate to /auth/login<br>2. Enter valid email<br>3. Enter valid password<br>4. Click "Sign in" button |
| **Expected Results** | 1. User is authenticated<br>2. User is redirected to /event-types<br>3. Dashboard shell is visible |
| **Test Data** | Valid user credentials |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-AUTH-N-005: Login with Non-Existent User
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-N-005 |
| **Module/Feature** | Authentication - User Login |
| **Test Scenario** | Verify appropriate error for non-existent user login |
| **Preconditions** | User "never" does not exist |
| **Test Steps** | 1. Navigate to /auth/login<br>2. Enter non-existent username "never"<br>3. Enter any password<br>4. Click "Sign in" button |
| **Expected Results** | 1. Error message displayed: "Incorrect email or password"<br>2. User remains on login page |
| **Test Data** | Username: never |
| **Priority** | High |
| **Test Type** | Negative, Regression |

#### TC-AUTH-N-006: Login with Incorrect Password
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-N-006 |
| **Module/Feature** | Authentication - User Login |
| **Test Scenario** | Verify appropriate error for incorrect password |
| **Preconditions** | User "pro" exists with known password |
| **Test Steps** | 1. Navigate to /auth/login<br>2. Enter existing username "pro"<br>3. Enter incorrect password "wrong"<br>4. Click "Sign in" button |
| **Expected Results** | 1. Error message displayed: "Incorrect email or password"<br>2. User remains on login page |
| **Test Data** | Username: pro, Password: wrong |
| **Priority** | High |
| **Test Type** | Negative, Regression |

#### TC-AUTH-P-005: Successful Logout
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-005 |
| **Module/Feature** | Authentication - User Logout |
| **Test Scenario** | Verify user can successfully logout |
| **Preconditions** | User is logged in |
| **Test Steps** | 1. Click user dropdown trigger<br>2. Click "Sign out" button<br>3. Click logout confirmation button |
| **Expected Results** | 1. User session is terminated<br>2. User is redirected to login page<br>3. Login form is visible |
| **Test Data** | N/A |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-AUTH-NW-001: Login During Network Timeout
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-NW-001 |
| **Module/Feature** | Authentication - User Login |
| **Test Scenario** | Verify login behavior during network timeout |
| **Preconditions** | User is on login page, network is slow/timing out |
| **Test Steps** | 1. Navigate to /auth/login<br>2. Enter valid credentials<br>3. Simulate network timeout<br>4. Click "Sign in" button |
| **Expected Results** | 1. Loading indicator is shown<br>2. Timeout error is displayed after threshold<br>3. User can retry login |
| **Test Data** | Valid credentials with simulated network delay |
| **Priority** | Medium |
| **Test Type** | Network |

---

## 2. Event Types Module Test Cases

### 2.1 Event Type Management

#### TC-EVT-P-001: Render Event Types Page
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-001 |
| **Module/Feature** | Event Types - Page Rendering |
| **Test Scenario** | Verify event types page renders correctly |
| **Preconditions** | User is logged in |
| **Test Steps** | 1. Navigate to /event-types |
| **Expected Results** | 1. Page loads successfully<br>2. "Event Types" heading is visible<br>3. Event types list is displayed |
| **Test Data** | N/A |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-EVT-P-002: Default Event Types Exist
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-002 |
| **Module/Feature** | Event Types - Default Events |
| **Test Scenario** | Verify new user has default event types |
| **Preconditions** | New user account created |
| **Test Steps** | 1. Login as new user<br>2. Navigate to /event-types<br>3. Count visible event types |
| **Expected Results** | 1. At least 2 event types are visible<br>2. Default event types (15 min, 30 min) exist |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-EVT-P-003: Create New Event Type
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-003 |
| **Module/Feature** | Event Types - Creation |
| **Test Scenario** | Verify user can create new event type |
| **Preconditions** | User is logged in, on event types page |
| **Test Steps** | 1. Click "New Event Type" button<br>2. Enter title "hello abc"<br>3. Complete event type creation<br>4. Navigate back to /event-types |
| **Expected Results** | 1. New event type is created<br>2. Event type "hello abc" is visible in list |
| **Test Data** | Title: hello abc |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-EVT-P-004: New Event Type Appears First
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-004 |
| **Module/Feature** | Event Types - Ordering |
| **Test Scenario** | Verify newly created event type appears first in list |
| **Preconditions** | User has existing event types |
| **Test Steps** | 1. Create new event type with unique title<br>2. Navigate to /event-types<br>3. Check first event type in list |
| **Expected Results** | 1. Newly created event type is first in list<br>2. Title matches the created event |
| **Test Data** | Unique event title |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-EVT-P-005: Duplicate Event Type
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-005 |
| **Module/Feature** | Event Types - Duplication |
| **Test Scenario** | Verify user can duplicate existing event type |
| **Preconditions** | User has at least one event type |
| **Test Steps** | 1. Navigate to /event-types<br>2. Click options menu for first event type<br>3. Click "Duplicate" option<br>4. Verify dialog shows original title and slug<br>5. Click "Continue" |
| **Expected Results** | 1. Duplicate dialog appears<br>2. Title and slug are prefilled from original<br>3. API returns 200 status<br>4. Duplicated event type is created |
| **Test Data** | Existing event type |
| **Priority** | Medium |
| **Test Type** | Positive, Regression |

#### TC-EVT-P-006: Edit Event Type
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-006 |
| **Module/Feature** | Event Types - Editing |
| **Test Scenario** | Verify user can edit existing event type |
| **Preconditions** | User has at least one event type |
| **Test Steps** | 1. Navigate to /event-types<br>2. Click on first event type<br>3. Wait for edit page to load<br>4. Make changes<br>5. Click "Update" button |
| **Expected Results** | 1. Edit page loads with event type URL pattern<br>2. Update API returns success<br>3. Changes are saved |
| **Test Data** | Existing event type |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-EVT-P-007: Enable Recurring Event
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-007 |
| **Module/Feature** | Event Types - Recurring Events |
| **Test Scenario** | Verify recurring event configuration with defaults |
| **Preconditions** | User has created a new event type |
| **Test Steps** | 1. Create new event type<br>2. Click "Recurring" tab<br>3. Verify recurring collapsible is hidden<br>4. Enable recurring event checkbox<br>5. Verify default values |
| **Expected Results** | 1. Recurring collapsible becomes visible<br>2. Default frequency is 1<br>3. Default interval is "week"<br>4. Default occurrences is 12 |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Positive |

### 2.2 Event Type Configuration

#### TC-EVT-P-008: Add Multiple Organizer Locations
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-008 |
| **Module/Feature** | Event Types - Locations |
| **Test Scenario** | Verify multiple organizer address locations can be added |
| **Preconditions** | User is editing an event type |
| **Test Steps** | 1. Open first event type for editing<br>2. Add location "location 1"<br>3. Click "Add location"<br>4. Add location "location 2"<br>5. Click "Add location"<br>6. Add location "location 3"<br>7. Save event type |
| **Expected Results** | 1. All three locations are saved<br>2. Booking page shows location options<br>3. Booker can select any location |
| **Test Data** | Locations: location 1, location 2, location 3 |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-EVT-P-009: Add Attendee Phone Number Location
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-009 |
| **Module/Feature** | Event Types - Locations |
| **Test Scenario** | Verify attendee phone number location works |
| **Preconditions** | User is editing an event type |
| **Test Steps** | 1. Open event type for editing<br>2. Select "Attendee Phone Number" location<br>3. Save event type<br>4. Go to booking page<br>5. Select time slot<br>6. Enter phone number "+19199999999"<br>7. Complete booking |
| **Expected Results** | 1. Booking is successful<br>2. Success page shows phone number<br>3. Phone number appears twice (confirmation) |
| **Test Data** | Phone: +19199999999 |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-EVT-P-010: Add Cal Video Location
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-010 |
| **Module/Feature** | Event Types - Locations |
| **Test Scenario** | Verify Cal Video location can be added and booked |
| **Preconditions** | User is editing an event type |
| **Test Steps** | 1. Open event type for editing<br>2. Click location select<br>3. Select "Cal Video (Default)"<br>4. Save event type<br>5. Go to booking page<br>6. Complete booking |
| **Expected Results** | 1. Booking is successful<br>2. Success page shows "Cal Video" as location<br>3. Video meeting link is generated |
| **Test Data** | N/A |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-EVT-P-011: Add Link Meeting Location
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-011 |
| **Module/Feature** | Event Types - Locations |
| **Test Scenario** | Verify custom link meeting location works |
| **Preconditions** | User is editing an event type |
| **Test Steps** | 1. Open event type for editing<br>2. Select "Link meeting" location<br>3. Enter URL "https://cal.ai/"<br>4. Save event type<br>5. Complete booking |
| **Expected Results** | 1. Booking is successful<br>2. Success page shows link<br>3. Link href matches entered URL |
| **Test Data** | URL: https://cal.ai/ |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-EVT-P-012: Enable Timezone Lock
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-P-012 |
| **Module/Feature** | Event Types - Advanced Settings |
| **Test Scenario** | Verify timezone lock prevents booker timezone change |
| **Preconditions** | User is editing an event type |
| **Test Steps** | 1. Open event type for editing<br>2. Go to Advanced tab<br>3. Enable "Lock timezone" toggle<br>4. Select timezone "New York"<br>5. Save event type<br>6. Go to booking page |
| **Expected Results** | 1. Timezone selector on booking page is disabled<br>2. Timezone shows locked timezone<br>3. Selector has cursor-not-allowed class |
| **Test Data** | Timezone: America/New_York |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-EVT-N-001: Recurring and Seats Mutual Exclusion
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-N-001 |
| **Module/Feature** | Event Types - Configuration Conflicts |
| **Test Scenario** | Verify recurring events and seats cannot be enabled together |
| **Preconditions** | User has created a new event type |
| **Test Steps** | 1. Create new event type<br>2. Go to Advanced tab<br>3. Enable "Offer seats" toggle<br>4. Go to Recurring tab<br>5. Check recurring event checkbox state |
| **Expected Results** | 1. Recurring event checkbox is disabled<br>2. Cannot enable both features simultaneously |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Negative |

#### TC-EVT-N-002: Seats Disabled When Recurring Enabled
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-N-002 |
| **Module/Feature** | Event Types - Configuration Conflicts |
| **Test Scenario** | Verify seats toggle is disabled when recurring is enabled |
| **Preconditions** | User has event type with recurring disabled |
| **Test Steps** | 1. Open event type for editing<br>2. Go to Recurring tab<br>3. Enable recurring event<br>4. Go to Advanced tab<br>5. Check "Offer seats" toggle state |
| **Expected Results** | 1. "Offer seats" toggle is disabled<br>2. Cannot enable seats with recurring active |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Negative |

#### TC-EVT-B-001: Event Title Maximum Length
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-B-001 |
| **Module/Feature** | Event Types - Validation |
| **Test Scenario** | Verify event title maximum length handling |
| **Preconditions** | User is creating new event type |
| **Test Steps** | 1. Click "New Event Type"<br>2. Enter title with 256+ characters<br>3. Attempt to save |
| **Expected Results** | 1. System either truncates or shows validation error<br>2. Event is handled appropriately |
| **Test Data** | Title: 256+ character string |
| **Priority** | Low |
| **Test Type** | Boundary |

#### TC-EVT-B-002: Event Duration Minimum Value
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EVT-B-002 |
| **Module/Feature** | Event Types - Validation |
| **Test Scenario** | Verify minimum event duration |
| **Preconditions** | User is creating new event type |
| **Test Steps** | 1. Create new event type<br>2. Set duration to 0 minutes<br>3. Attempt to save |
| **Expected Results** | 1. Validation error is shown<br>2. Minimum duration is enforced |
| **Test Data** | Duration: 0 |
| **Priority** | Medium |
| **Test Type** | Boundary |

---

## 3. Booking Flow Module Test Cases

### 3.1 Booking Creation

#### TC-BKG-P-001: Book First Available Slot
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-001 |
| **Module/Feature** | Booking Flow - Creation |
| **Test Scenario** | Verify user can book first available time slot |
| **Preconditions** | User has public event type, booker is on booking page |
| **Test Steps** | 1. Navigate to /{username}/{event-slug}<br>2. Click next month<br>3. Select first available day<br>4. Select first available time slot<br>5. Enter name and email<br>6. Click confirm booking |
| **Expected Results** | 1. Success page is displayed<br>2. Booking title shows event name<br>3. Attendee email is displayed<br>4. Attendee name is displayed |
| **Test Data** | Name: Test User, Email: test@example.com |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-BKG-P-002: Book with Multiple Guests
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-002 |
| **Module/Feature** | Booking Flow - Guests |
| **Test Scenario** | Verify booking with additional guests |
| **Preconditions** | User is on booking form after selecting time |
| **Test Steps** | 1. Select time slot<br>2. Fill name "test1234"<br>3. Fill email "test1234@example.com"<br>4. Click "Add guests"<br>5. Add guest "test@gmail.com"<br>6. Click "Add another guest"<br>7. Add guest "test2@gmail.com"<br>8. Confirm booking |
| **Expected Results** | 1. Success page is displayed<br>2. Both guest emails are shown in attendee list |
| **Test Data** | Guests: test@gmail.com, test2@gmail.com |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-BKG-P-003: Book Opt-In Event
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-003 |
| **Module/Feature** | Booking Flow - Confirmation Required |
| **Test Scenario** | Verify booking event that requires confirmation |
| **Preconditions** | Event type has "Requires confirmation" enabled |
| **Test Steps** | 1. Navigate to opt-in event type<br>2. Select time slot<br>3. Complete booking form<br>4. Submit booking |
| **Expected Results** | 1. Success page shows booking is pending<br>2. Booking appears in host's unconfirmed list<br>3. Host can confirm or reject |
| **Test Data** | N/A |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-BKG-P-004: Confirm Opt-In Booking
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-004 |
| **Module/Feature** | Booking Flow - Confirmation |
| **Test Scenario** | Verify host can confirm pending booking |
| **Preconditions** | Pending booking exists for opt-in event |
| **Test Steps** | 1. Login as host<br>2. Navigate to /bookings/unconfirmed<br>3. Click "Confirm" button<br>4. Wait for API response |
| **Expected Results** | 1. Booking is confirmed<br>2. Empty screen shown (no more unconfirmed)<br>3. Booking moves to upcoming list |
| **Test Data** | N/A |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-BKG-N-001: Cannot Book Same Slot Twice
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-N-001 |
| **Module/Feature** | Booking Flow - Double Booking Prevention |
| **Test Scenario** | Verify same time slot cannot be booked twice |
| **Preconditions** | First booking is completed for a time slot |
| **Test Steps** | 1. Complete first booking<br>2. Save booking URL<br>3. Navigate back to same booking URL<br>4. Attempt to book same slot |
| **Expected Results** | 1. Slot is shown as unavailable<br>2. Error message indicates slot is taken<br>3. Second booking is prevented |
| **Test Data** | Same time slot URL |
| **Priority** | High |
| **Test Type** | Negative, Regression |

#### TC-BKG-P-005: Time Slot Reservation During Booking
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-005 |
| **Module/Feature** | Booking Flow - Slot Reservation |
| **Test Scenario** | Verify time slots are reserved when selected |
| **Preconditions** | Two browser sessions on same booking page |
| **Test Steps** | 1. In browser 1, select first available slot (9:00)<br>2. In browser 2, navigate to same event<br>3. Go to same day<br>4. Check first available slot |
| **Expected Results** | 1. Browser 2 shows 9:30 as first available (9:00 reserved)<br>2. Reserved slot is not available to second user |
| **Test Data** | N/A |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-BKG-P-006: Slot Released on Cancel
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-006 |
| **Module/Feature** | Booking Flow - Slot Release |
| **Test Scenario** | Verify slot is released when user clicks back/cancel |
| **Preconditions** | User has selected a time slot |
| **Test Steps** | 1. In browser 1, select time slot<br>2. In browser 2, open same event<br>3. In browser 1, click "Back" button<br>4. In browser 2, check available slots |
| **Expected Results** | 1. Original slot (9:00) is available again<br>2. Browser 2 can book the released slot |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-BKG-E-001: Booking with Special Characters in Username
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-E-001 |
| **Module/Feature** | Booking Flow - Special Characters |
| **Test Scenario** | Verify booking page works with special characters in username |
| **Preconditions** | User with special character username exists (e.g., "ßenny") |
| **Test Steps** | 1. Navigate to /{special-username}<br>2. Verify page loads |
| **Expected Results** | 1. Page does not return 404<br>2. Page does not return 500<br>3. Booking page loads correctly |
| **Test Data** | Username: ßenny |
| **Priority** | Medium |
| **Test Type** | Edge |

#### TC-BKG-E-002: Booking Page Prefill from Session
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-E-002 |
| **Module/Feature** | Booking Flow - Prefill |
| **Test Scenario** | Verify logged-in user's info is prefilled |
| **Preconditions** | User is logged in |
| **Test Steps** | 1. Login as user<br>2. Navigate to another user's booking page<br>3. Select time slot<br>4. Check form fields |
| **Expected Results** | 1. Name field is prefilled with logged-in user's name<br>2. Email field is prefilled with logged-in user's email |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Edge |

#### TC-BKG-E-003: Booking Page Prefill from Query Params
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-E-003 |
| **Module/Feature** | Booking Flow - Prefill |
| **Test Scenario** | Verify form prefill from URL query parameters |
| **Preconditions** | None |
| **Test Steps** | 1. Navigate to booking page with query params<br>2. URL: /{username}/30min?name=Test&email=test@example.com<br>3. Select time slot<br>4. Check form fields |
| **Expected Results** | 1. Name field shows "Test"<br>2. Email field shows "test@example.com" |
| **Test Data** | name=Test, email=test@example.com |
| **Priority** | Medium |
| **Test Type** | Edge |

#### TC-BKG-E-004: Form Values Persist on Back Navigation
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-E-004 |
| **Module/Feature** | Booking Flow - Form Persistence |
| **Test Scenario** | Verify form values persist when navigating back |
| **Preconditions** | User is on booking form |
| **Test Steps** | 1. Select time slot<br>2. Fill name "John Doe"<br>3. Fill email "john@example.com"<br>4. Fill notes "Test notes"<br>5. Click "Back"<br>6. Select same time slot again |
| **Expected Results** | 1. Name field still shows "John Doe"<br>2. Email field still shows "john@example.com"<br>3. Notes field still shows "Test notes" |
| **Test Data** | Name: John Doe, Email: john@example.com, Notes: Test notes |
| **Priority** | Medium |
| **Test Type** | Edge |

### 3.2 Rescheduling

#### TC-BKG-P-007: Reschedule from Bookings List
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-007 |
| **Module/Feature** | Booking Flow - Rescheduling |
| **Test Scenario** | Verify host can reschedule booking from bookings list |
| **Preconditions** | Confirmed booking exists |
| **Test Steps** | 1. Login as host<br>2. Navigate to /bookings/upcoming<br>3. Click booking actions dropdown<br>4. Click "Reschedule"<br>5. Select new time slot<br>6. Confirm reschedule |
| **Expected Results** | 1. Reschedule page loads with rescheduleUid param<br>2. New time can be selected<br>3. Booking is rescheduled successfully |
| **Test Data** | Existing booking |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-BKG-P-008: Reschedule Request from Host
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-008 |
| **Module/Feature** | Booking Flow - Reschedule Request |
| **Test Scenario** | Verify host can send reschedule request to attendee |
| **Preconditions** | Confirmed booking exists |
| **Test Steps** | 1. Login as host<br>2. Navigate to /bookings/upcoming<br>3. Click booking actions dropdown<br>4. Click "Request reschedule"<br>5. Enter reason "I can't longer have it"<br>6. Click "Send request" |
| **Expected Results** | 1. Modal closes<br>2. Booking is marked as rescheduled<br>3. Cancellation reason is saved<br>4. Booking status changes to CANCELLED |
| **Test Data** | Reason: I can't longer have it |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-BKG-P-009: Attendee Reschedule via Link
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-009 |
| **Module/Feature** | Booking Flow - Attendee Reschedule |
| **Test Scenario** | Verify attendee can reschedule using reschedule link |
| **Preconditions** | Booking exists with reschedule link |
| **Test Steps** | 1. Navigate to /reschedule/{booking_uid}<br>2. Select new time slot<br>3. Confirm reschedule |
| **Expected Results** | 1. Reschedule page loads<br>2. New booking is created<br>3. Original booking is cancelled<br>4. Success page shows new booking |
| **Test Data** | Valid booking UID |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-BKG-P-010: Display Former Time When Rescheduling
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-010 |
| **Module/Feature** | Booking Flow - Reschedule UI |
| **Test Scenario** | Verify former time is displayed during reschedule |
| **Preconditions** | Booking marked for reschedule |
| **Test Steps** | 1. Navigate to /reschedule/{booking_uid}<br>2. Select new time slot<br>3. Check for former time display |
| **Expected Results** | 1. Former time element is visible<br>2. Shows original booking time |
| **Test Data** | Rescheduled booking |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-BKG-N-003: Reschedule with Wrong Event Type
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-N-003 |
| **Module/Feature** | Booking Flow - Reschedule Validation |
| **Test Scenario** | Verify redirect when rescheduleUid doesn't match event type |
| **Preconditions** | Booking exists for 30-min event |
| **Test Steps** | 1. Create booking for 30-min event<br>2. Navigate to /{username}/15-min?rescheduleUid={booking_uid}<br>3. Observe redirect |
| **Expected Results** | 1. User is redirected to correct event type<br>2. URL changes to /{username}/30-min |
| **Test Data** | Booking for 30-min, navigate to 15-min |
| **Priority** | Medium |
| **Test Type** | Negative |

#### TC-BKG-N-004: Reschedule Cancelled Booking (Disallowed)
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-N-004 |
| **Module/Feature** | Booking Flow - Cancelled Reschedule |
| **Test Scenario** | Verify cancelled booking cannot be rescheduled by default |
| **Preconditions** | Booking is cancelled, allowReschedulingCancelledBookings is false |
| **Test Steps** | 1. Cancel a booking<br>2. Navigate to /reschedule/{booking_uid} |
| **Expected Results** | 1. URL does not contain rescheduleUid<br>2. Cancelled headline is visible<br>3. Cannot proceed with reschedule |
| **Test Data** | Cancelled booking |
| **Priority** | Medium |
| **Test Type** | Negative |

#### TC-BKG-P-011: Reschedule Cancelled Booking (Allowed)
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-011 |
| **Module/Feature** | Booking Flow - Cancelled Reschedule |
| **Test Scenario** | Verify cancelled booking can be rescheduled when allowed |
| **Preconditions** | Booking is cancelled, allowReschedulingCancelledBookings is true |
| **Test Steps** | 1. Enable allowReschedulingCancelledBookings on event type<br>2. Cancel a booking<br>3. Navigate to /reschedule/{booking_uid}<br>4. Select new time<br>5. Complete booking |
| **Expected Results** | 1. Reschedule page loads<br>2. Can select new time<br>3. New booking is created successfully |
| **Test Data** | Cancelled booking with reschedule allowed |
| **Priority** | Low |
| **Test Type** | Positive |

#### TC-BKG-P-012: Reschedule Paid Booking (Unpaid)
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-012 |
| **Module/Feature** | Booking Flow - Paid Reschedule |
| **Test Scenario** | Verify unpaid rescheduling goes to payment page |
| **Preconditions** | Paid event type, booking exists with paid=false |
| **Test Steps** | 1. Create booking for paid event<br>2. Navigate to /reschedule/{booking_uid}<br>3. Select new time<br>4. Confirm reschedule |
| **Expected Results** | 1. User is redirected to /payment page<br>2. Payment is required before confirmation |
| **Test Data** | Paid event booking |
| **Priority** | Medium |
| **Test Type** | Positive |

### 3.3 Cancellation

#### TC-BKG-P-013: Cancel Booking from List
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-P-013 |
| **Module/Feature** | Booking Flow - Cancellation |
| **Test Scenario** | Verify host can cancel booking and rebook same slot |
| **Preconditions** | Confirmed booking exists |
| **Test Steps** | 1. Book an event<br>2. Login as host<br>3. Navigate to /bookings/upcoming<br>4. Cancel booking with reason<br>5. Navigate back to booking page<br>6. Book same slot again |
| **Expected Results** | 1. Booking is cancelled<br>2. Slot becomes available<br>3. Can book same slot again |
| **Test Data** | Reason: Test reason |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-BKG-N-005: Cannot Reschedule Cancelled Booking
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BKG-N-005 |
| **Module/Feature** | Booking Flow - Cancelled Booking |
| **Test Scenario** | Verify cancelled booking cannot be rescheduled |
| **Preconditions** | Booking has been cancelled |
| **Test Steps** | 1. Cancel a booking<br>2. Navigate to /reschedule/{booking_uid} |
| **Expected Results** | 1. URL does not contain rescheduleUid<br>2. Cancelled headline is visible |
| **Test Data** | Cancelled booking UID |
| **Priority** | Medium |
| **Test Type** | Negative |

---

## 4. Availability Management Test Cases

### 4.1 Schedule Management

#### TC-AVL-P-001: Create New Schedule
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AVL-P-001 |
| **Module/Feature** | Availability - Schedule Creation |
| **Test Scenario** | Verify user can create new availability schedule |
| **Preconditions** | User is logged in, on availability page |
| **Test Steps** | 1. Navigate to /availability<br>2. Click "New Schedule" button<br>3. Enter name "More working hours"<br>4. Click submit |
| **Expected Results** | 1. New schedule is created<br>2. Schedule title shows "More working hours" |
| **Test Data** | Name: More working hours |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-AVL-P-002: Manage Single Schedule
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AVL-P-002 |
| **Module/Feature** | Availability - Schedule Management |
| **Test Scenario** | Verify comprehensive schedule management |
| **Preconditions** | User has at least one schedule |
| **Test Steps** | 1. Click on first schedule<br>2. Change name to "Working Hours test"<br>3. Toggle Sunday on<br>4. Toggle Wednesday off<br>5. Toggle Saturday on<br>6. Add additional time slot to Sunday<br>7. Save changes |
| **Expected Results** | 1. Name is updated<br>2. Day toggles are saved<br>3. Additional time slot is added<br>4. Summary shows updated availability |
| **Test Data** | Various day/time configurations |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-AVL-P-003: Copy Times to Other Days
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AVL-P-003 |
| **Module/Feature** | Availability - Copy Times |
| **Test Scenario** | Verify times can be copied to other days |
| **Preconditions** | Schedule with configured times exists |
| **Test Steps** | 1. Open schedule for editing<br>2. Click copy button on Sunday row<br>3. Check Monday checkbox<br>4. Click "Apply" |
| **Expected Results** | 1. "Copy times to" dialog appears<br>2. Monday receives Sunday's times<br>3. Changes are saved |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-AVL-N-001: Cannot Delete Last Schedule
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AVL-N-001 |
| **Module/Feature** | Availability - Schedule Deletion |
| **Test Scenario** | Verify last schedule cannot be deleted |
| **Preconditions** | User has only one schedule |
| **Test Steps** | 1. Navigate to /availability<br>2. Click schedule options menu<br>3. Click "Delete schedule" |
| **Expected Results** | 1. Error toast is displayed<br>2. Schedule is not deleted<br>3. At least one schedule remains |
| **Test Data** | N/A |
| **Priority** | High |
| **Test Type** | Negative, Regression |

#### TC-AVL-P-004: Delete Non-Last Schedule
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AVL-P-004 |
| **Module/Feature** | Availability - Schedule Deletion |
| **Test Scenario** | Verify schedule can be deleted when multiple exist |
| **Preconditions** | User has at least 2 schedules |
| **Test Steps** | 1. Create second schedule<br>2. Click options menu on second schedule<br>3. Click "Delete schedule"<br>4. Confirm deletion |
| **Expected Results** | 1. Confirmation dialog appears<br>2. Schedule is deleted<br>3. Only one schedule remains |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Positive |

### 4.2 Date Overrides

#### TC-AVL-P-005: Add Date Override - Mark Unavailable
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AVL-P-005 |
| **Module/Feature** | Availability - Date Overrides |
| **Test Scenario** | Verify date can be marked as unavailable |
| **Preconditions** | User is editing a schedule |
| **Test Steps** | 1. Open schedule for editing<br>2. Toggle Sunday and Saturday on<br>3. Click "Add override"<br>4. Go to next month<br>5. Select first available date<br>6. Click "Mark as unavailable"<br>7. Submit override<br>8. Save schedule |
| **Expected Results** | 1. Date override is added to list<br>2. Override count shows 1<br>3. Troubleshooter shows busy time for that date |
| **Test Data** | First available date next month |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-AVL-P-006: Add Multiple Date Overrides
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AVL-P-006 |
| **Module/Feature** | Availability - Date Overrides |
| **Test Scenario** | Verify multiple dates can be selected for override |
| **Preconditions** | User is editing a schedule |
| **Test Steps** | 1. Click "Add override"<br>2. Go to next month<br>3. Select 3 different dates<br>4. Mark as unavailable<br>5. Submit override |
| **Expected Results** | 1. All 3 dates are added as overrides<br>2. Override list shows 3 items |
| **Test Data** | 3 dates in next month |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-AVL-P-007: Delete Date Override
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AVL-P-007 |
| **Module/Feature** | Availability - Date Overrides |
| **Test Scenario** | Verify date override can be deleted |
| **Preconditions** | Schedule has date overrides |
| **Test Steps** | 1. Open schedule with overrides<br>2. Click delete button on an override<br>3. Save schedule |
| **Expected Results** | 1. Override is removed from list<br>2. Override count decreases<br>3. Date becomes available again |
| **Test Data** | Existing override |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-AVL-E-001: Date Override in Negative Timezone
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AVL-E-001 |
| **Module/Feature** | Availability - Timezone Handling |
| **Test Scenario** | Verify date override works in negative timezone |
| **Preconditions** | User is editing a schedule |
| **Test Steps** | 1. Open schedule<br>2. Change timezone to America/New_York<br>3. Add override for current day<br>4. Save schedule<br>5. Reload page |
| **Expected Results** | 1. Override is saved correctly<br>2. Override persists after reload<br>3. Override list shows 1 item |
| **Test Data** | Timezone: America/New_York |
| **Priority** | Medium |
| **Test Type** | Edge |

---

## 5. Calendar Integrations Test Cases

### 5.1 Calendar Connections

#### TC-CAL-P-001: Connect Google Calendar
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CAL-P-001 |
| **Module/Feature** | Calendar Integrations - Google |
| **Test Scenario** | Verify Google Calendar can be connected |
| **Preconditions** | User is logged in, has Google account |
| **Test Steps** | 1. Navigate to /apps/installed/calendar<br>2. Click "Connect" for Google Calendar<br>3. Complete OAuth flow<br>4. Authorize access |
| **Expected Results** | 1. OAuth flow completes<br>2. Google Calendar appears in connected list<br>3. Calendars are synced |
| **Test Data** | Valid Google account |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-CAL-P-002: Connect Outlook Calendar
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CAL-P-002 |
| **Module/Feature** | Calendar Integrations - Outlook |
| **Test Scenario** | Verify Outlook Calendar can be connected |
| **Preconditions** | User is logged in, has Microsoft account |
| **Test Steps** | 1. Navigate to /apps/installed/calendar<br>2. Click "Connect" for Outlook Calendar<br>3. Complete OAuth flow<br>4. Authorize access |
| **Expected Results** | 1. OAuth flow completes<br>2. Outlook Calendar appears in connected list<br>3. Calendars are synced |
| **Test Data** | Valid Microsoft account |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-CAL-P-003: Select Destination Calendar
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CAL-P-003 |
| **Module/Feature** | Calendar Integrations - Destination |
| **Test Scenario** | Verify destination calendar can be selected |
| **Preconditions** | Calendar is connected |
| **Test Steps** | 1. Navigate to calendar settings<br>2. Select destination calendar from dropdown<br>3. Save settings<br>4. Create a booking |
| **Expected Results** | 1. Destination calendar is saved<br>2. New bookings appear in selected calendar |
| **Test Data** | Connected calendar |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-CAL-N-001: Calendar Sync Failure Handling
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CAL-N-001 |
| **Module/Feature** | Calendar Integrations - Error Handling |
| **Test Scenario** | Verify graceful handling of calendar sync failures |
| **Preconditions** | Calendar is connected but token is expired |
| **Test Steps** | 1. Simulate expired OAuth token<br>2. Trigger calendar sync<br>3. Observe error handling |
| **Expected Results** | 1. Error is logged<br>2. User is notified of sync issue<br>3. System prompts for re-authentication |
| **Test Data** | Expired token |
| **Priority** | Medium |
| **Test Type** | Negative |

#### TC-CAL-NW-001: Calendar Sync During Network Outage
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CAL-NW-001 |
| **Module/Feature** | Calendar Integrations - Network |
| **Test Scenario** | Verify calendar sync behavior during network issues |
| **Preconditions** | Calendar is connected |
| **Test Steps** | 1. Simulate network outage<br>2. Trigger calendar sync<br>3. Restore network<br>4. Verify retry behavior |
| **Expected Results** | 1. Sync fails gracefully<br>2. Error is logged<br>3. Retry mechanism activates<br>4. Sync completes when network restored |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Network |

---

## 6. Video Conferencing Test Cases

### 6.1 Cal Video (Daily.co)

#### TC-VID-P-001: Cal Video Meeting Creation
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-VID-P-001 |
| **Module/Feature** | Video Conferencing - Cal Video |
| **Test Scenario** | Verify Cal Video meeting is created for booking |
| **Preconditions** | Event type has Cal Video as location |
| **Test Steps** | 1. Create event type with Cal Video location<br>2. Complete a booking<br>3. Check booking details |
| **Expected Results** | 1. Booking is created<br>2. Video meeting URL is generated<br>3. URL contains Cal Video domain |
| **Test Data** | N/A |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-VID-P-002: Cal Video Link After Reschedule
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-VID-P-002 |
| **Module/Feature** | Video Conferencing - Reschedule |
| **Test Scenario** | Verify valid Cal Video URL after rescheduling opt-in event |
| **Preconditions** | Opt-in event with Cal Video, DAILY_API_KEY configured |
| **Test Steps** | 1. Book opt-in event with Cal Video<br>2. Confirm booking<br>3. Reschedule booking<br>4. Confirm rescheduled booking<br>5. Navigate to video URL |
| **Expected Results** | 1. Video URL is valid<br>2. Video page loads with "Continue" button<br>3. Meeting is accessible |
| **Test Data** | Opt-in event with Cal Video |
| **Priority** | Medium |
| **Test Type** | Positive |

### 6.2 Third-Party Video Integrations

#### TC-VID-P-003: Zoom Integration
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-VID-P-003 |
| **Module/Feature** | Video Conferencing - Zoom |
| **Test Scenario** | Verify Zoom meeting is created for booking |
| **Preconditions** | Zoom is connected, event type uses Zoom |
| **Test Steps** | 1. Connect Zoom integration<br>2. Create event type with Zoom location<br>3. Complete a booking |
| **Expected Results** | 1. Zoom meeting is created<br>2. Meeting URL is included in booking<br>3. Calendar invite contains Zoom link |
| **Test Data** | Valid Zoom account |
| **Priority** | High |
| **Test Type** | Positive |

#### TC-VID-P-004: Google Meet Integration
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-VID-P-004 |
| **Module/Feature** | Video Conferencing - Google Meet |
| **Test Scenario** | Verify Google Meet is created for booking |
| **Preconditions** | Google Calendar connected with Meet enabled |
| **Test Steps** | 1. Create event type with Google Meet location<br>2. Complete a booking |
| **Expected Results** | 1. Google Meet link is generated<br>2. Link is included in booking confirmation |
| **Test Data** | Google account with Meet |
| **Priority** | High |
| **Test Type** | Positive |

---

## 7. Workflows & Automations Test Cases

### 7.1 Workflow Management

#### TC-WFL-P-001: Create New Workflow
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-WFL-P-001 |
| **Module/Feature** | Workflows - Creation |
| **Test Scenario** | Verify user can create new workflow |
| **Preconditions** | User is logged in |
| **Test Steps** | 1. Navigate to /workflows<br>2. Click "New Workflow"<br>3. Enter name "test workflow"<br>4. Configure trigger and action<br>5. Save workflow |
| **Expected Results** | 1. Workflow is created<br>2. Workflow appears in list<br>3. Workflow count increases |
| **Test Data** | Name: test workflow |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-WFL-P-002: Edit Existing Workflow
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-WFL-P-002 |
| **Module/Feature** | Workflows - Editing |
| **Test Scenario** | Verify workflow can be edited |
| **Preconditions** | Workflow exists |
| **Test Steps** | 1. Navigate to /workflows<br>2. Click on existing workflow<br>3. Change name to "Edited Workflow"<br>4. Save changes<br>5. Go back to list |
| **Expected Results** | 1. Changes are saved<br>2. Updated name appears in list |
| **Test Data** | New name: Edited Workflow |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-WFL-P-003: Delete Workflow
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-WFL-P-003 |
| **Module/Feature** | Workflows - Deletion |
| **Test Scenario** | Verify workflow can be deleted |
| **Preconditions** | Workflow exists |
| **Test Steps** | 1. Navigate to /workflows<br>2. Click delete on workflow<br>3. Confirm deletion |
| **Expected Results** | 1. Workflow is removed from list<br>2. Workflow count decreases |
| **Test Data** | Existing workflow |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-WFL-P-004: Workflow Reminder Creation
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-WFL-P-004 |
| **Module/Feature** | Workflows - Reminders |
| **Test Scenario** | Verify workflow creates reminders for bookings |
| **Preconditions** | Workflows with BEFORE_EVENT and AFTER_EVENT triggers exist |
| **Test Steps** | 1. Create BEFORE_EVENT workflow<br>2. Create AFTER_EVENT workflow<br>3. Book an event<br>4. Check workflow reminders |
| **Expected Results** | 1. 2 workflow reminders are created<br>2. Reminders are associated with booking |
| **Test Data** | BEFORE_EVENT and AFTER_EVENT workflows |
| **Priority** | High |
| **Test Type** | Positive, Regression |

### 7.2 Team Workflows

#### TC-WFL-P-005: Admin Create Team Workflow
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-WFL-P-005 |
| **Module/Feature** | Workflows - Team |
| **Test Scenario** | Verify admin can create team workflow |
| **Preconditions** | User is team admin |
| **Test Steps** | 1. Login as team admin<br>2. Navigate to /workflows<br>3. Create new workflow for team<br>4. Save workflow |
| **Expected Results** | 1. Team workflow is created<br>2. Workflow appears in team workflows list |
| **Test Data** | Team admin user |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-WFL-N-001: Member Cannot Edit Team Workflow
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-WFL-N-001 |
| **Module/Feature** | Workflows - Permissions |
| **Test Scenario** | Verify team member cannot edit team workflows |
| **Preconditions** | User is team member (not admin) |
| **Test Steps** | 1. Login as team member<br>2. Navigate to /workflows<br>3. Attempt to edit team workflow |
| **Expected Results** | 1. Workflow options are disabled<br>2. Readonly badge is visible<br>3. Cannot modify workflow |
| **Test Data** | Team member user |
| **Priority** | Medium |
| **Test Type** | Negative |

---

## 8. Organizations & Teams Test Cases

### 8.1 Team Management

#### TC-TM-P-001: Render Teams Page
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-TM-P-001 |
| **Module/Feature** | Teams - Page Rendering |
| **Test Scenario** | Verify teams page renders correctly |
| **Preconditions** | User is logged in |
| **Test Steps** | 1. Navigate to /teams |
| **Expected Results** | 1. Page loads successfully<br>2. "Teams" heading is visible |
| **Test Data** | N/A |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-TM-P-002: Create Team with Same Name as User
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-TM-P-002 |
| **Module/Feature** | Teams - Creation |
| **Test Scenario** | Verify team can be created with same name as username |
| **Preconditions** | User is logged in |
| **Test Steps** | 1. Navigate to /teams<br>2. Click "Create Team"<br>3. Enter team name same as username<br>4. Complete team creation<br>5. Access both team and user pages |
| **Expected Results** | 1. Team is created successfully<br>2. /team/{name} shows team page<br>3. /{name} shows user page<br>4. Both are accessible |
| **Test Data** | Name matching username |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-TM-P-003: Create Private Team
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-TM-P-003 |
| **Module/Feature** | Teams - Privacy |
| **Test Scenario** | Verify private team hides member information |
| **Preconditions** | Team exists with members |
| **Test Steps** | 1. Login as team owner<br>2. Navigate to team settings<br>3. Enable "Make team private"<br>4. Logout<br>5. Visit team page as anonymous user |
| **Expected Results** | 1. "Book a team member" button is hidden<br>2. Team members are not visible<br>3. "You cannot see team members" message shown |
| **Test Data** | Team with members |
| **Priority** | Medium |
| **Test Type** | Positive |

### 8.2 Team Booking

#### TC-TM-P-004: Book Collective Event Type
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-TM-P-004 |
| **Module/Feature** | Teams - Collective Booking |
| **Test Scenario** | Verify collective event books all team members |
| **Preconditions** | Team with collective event type exists |
| **Test Steps** | 1. Navigate to /team/{slug}/{event-slug}<br>2. Select time slot<br>3. Complete booking |
| **Expected Results** | 1. Booking is created<br>2. All team members appear in booking<br>3. Booking title includes team name |
| **Test Data** | Team with 4 members |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-TM-P-005: Book Round Robin Event Type
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-TM-P-005 |
| **Module/Feature** | Teams - Round Robin Booking |
| **Test Scenario** | Verify round robin assigns one team member |
| **Preconditions** | Team with round robin event type exists |
| **Test Steps** | 1. Navigate to /team/{slug}/{event-slug}<br>2. Select time slot<br>3. Complete booking |
| **Expected Results** | 1. Booking is created<br>2. One team member is assigned as host<br>3. Host is from team members list |
| **Test Data** | Team with 4 members |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-TM-P-006: Reschedule Collective Booking
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-TM-P-006 |
| **Module/Feature** | Teams - Reschedule |
| **Test Scenario** | Verify collective booking can be rescheduled |
| **Preconditions** | Collective booking exists |
| **Test Steps** | 1. Navigate to /reschedule/{booking_uid}<br>2. Select new time slot<br>3. Confirm reschedule |
| **Expected Results** | 1. Booking is rescheduled<br>2. All team members remain on booking<br>3. Success page is displayed |
| **Test Data** | Collective booking |
| **Priority** | Medium |
| **Test Type** | Positive |

### 8.3 Organization Management

#### TC-TM-N-001: Non-Admin Cannot Create Team in Org
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-TM-N-001 |
| **Module/Feature** | Organizations - Permissions |
| **Test Scenario** | Verify non-admin cannot create team in organization |
| **Preconditions** | User is org member (not admin) |
| **Test Steps** | 1. Login as org member<br>2. Navigate to /teams<br>3. Check for create team button |
| **Expected Results** | 1. "New team" button is hidden<br>2. "Create team" button is disabled<br>3. Cannot create new team |
| **Test Data** | Org member user |
| **Priority** | Medium |
| **Test Type** | Negative |

#### TC-TM-P-007: Teams in Different Orgs Can Have Same Slug
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-TM-P-007 |
| **Module/Feature** | Organizations - Slug Uniqueness |
| **Test Scenario** | Verify teams in different orgs can share slug |
| **Preconditions** | Two organizations exist |
| **Test Steps** | 1. Create team "calCom" in org 1<br>2. Create team "calCom" in org 2<br>3. Update team 1 slug to match team 2 |
| **Expected Results** | 1. Both teams can have same slug<br>2. No conflict error<br>3. Teams are accessible via org domains |
| **Test Data** | Slug: calCom |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-TM-N-002: Teams in Same Org Cannot Have Duplicate Slugs
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-TM-N-002 |
| **Module/Feature** | Organizations - Slug Uniqueness |
| **Test Scenario** | Verify teams in same org cannot have duplicate slugs |
| **Preconditions** | Organization with 2 teams exists |
| **Test Steps** | 1. Login as org owner<br>2. Navigate to team 1 settings<br>3. Change slug to match team 2 |
| **Expected Results** | 1. API returns 409 conflict<br>2. Slug change is rejected<br>3. Error message displayed |
| **Test Data** | Two teams in same org |
| **Priority** | Medium |
| **Test Type** | Negative |

---

## 9. Payments Module Test Cases

### 9.1 Stripe Integration

#### TC-PAY-P-001: Add Stripe Integration
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-P-001 |
| **Module/Feature** | Payments - Stripe Setup |
| **Test Scenario** | Verify Stripe can be connected |
| **Preconditions** | User is logged in, Stripe is enabled |
| **Test Steps** | 1. Navigate to /apps/installed<br>2. Install Stripe app<br>3. Complete OAuth flow |
| **Expected Results** | 1. Stripe appears in installed apps<br>2. "Remove App" option is available |
| **Test Data** | Stripe test account |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-PAY-P-002: Book Paid Event
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-P-002 |
| **Module/Feature** | Payments - Booking |
| **Test Scenario** | Verify paid event can be booked |
| **Preconditions** | Stripe connected, paid event type exists |
| **Test Steps** | 1. Navigate to paid event booking page<br>2. Select time slot<br>3. Complete booking form<br>4. Complete Stripe payment |
| **Expected Results** | 1. Redirected to payment page<br>2. Payment completes successfully<br>3. Success page is displayed |
| **Test Data** | Stripe test card |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-PAY-P-003: Pending Payment Shows Unconfirmed
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-P-003 |
| **Module/Feature** | Payments - Status |
| **Test Scenario** | Verify unpaid booking shows as unconfirmed |
| **Preconditions** | Paid event type exists |
| **Test Steps** | 1. Start booking for paid event<br>2. Complete form but don't pay<br>3. Check bookings list |
| **Expected Results** | 1. Booking shows "Unconfirmed"<br>2. "Pending payment" status is visible |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-PAY-P-004: Paid Booking Shows Paid Badge
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-P-004 |
| **Module/Feature** | Payments - Confirmation |
| **Test Scenario** | Verify paid booking shows paid badge |
| **Preconditions** | Paid booking with completed payment |
| **Test Steps** | 1. Complete paid booking with payment<br>2. Confirm pending payment<br>3. Navigate to /bookings/upcoming |
| **Expected Results** | 1. "Paid" badge is visible<br>2. Badge text shows "Paid" |
| **Test Data** | Completed payment |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-PAY-P-005: Reschedule Paid Booking
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-P-005 |
| **Module/Feature** | Payments - Reschedule |
| **Test Scenario** | Verify paid booking can be rescheduled |
| **Preconditions** | Paid and confirmed booking exists |
| **Test Steps** | 1. Click reschedule link on paid booking<br>2. Select new time<br>3. Confirm reschedule |
| **Expected Results** | 1. Reschedule completes without new payment<br>2. "This meeting is scheduled" message shown |
| **Test Data** | Paid booking |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-PAY-P-006: Cancel Paid Booking
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-P-006 |
| **Module/Feature** | Payments - Cancellation |
| **Test Scenario** | Verify paid booking can be cancelled |
| **Preconditions** | Paid booking exists |
| **Test Steps** | 1. Navigate to booking<br>2. Click cancel<br>3. Confirm cancellation |
| **Expected Results** | 1. Booking is cancelled<br>2. Cancelled headline is visible |
| **Test Data** | Paid booking |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-PAY-P-007: Change Stripe Currency
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-P-007 |
| **Module/Feature** | Payments - Currency |
| **Test Scenario** | Verify currency can be changed for paid events |
| **Preconditions** | Stripe connected |
| **Test Steps** | 1. Edit paid event type<br>2. Go to Apps tab<br>3. Enable Stripe<br>4. Set price to 200<br>5. Change currency to MXN<br>6. Save and view booking page |
| **Expected Results** | 1. Price shows "MX$200.00"<br>2. Currency is displayed correctly on booking form<br>3. Payment page shows correct currency |
| **Test Data** | Price: 200, Currency: MXN |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-PAY-P-008: Stripe CredentialId Included in Metadata
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-P-008 |
| **Module/Feature** | Payments - Configuration |
| **Test Scenario** | Verify credentialId is stored in event type metadata |
| **Preconditions** | Stripe connected |
| **Test Steps** | 1. Install Stripe<br>2. Setup event with price<br>3. Check event type metadata in database |
| **Expected Results** | 1. Metadata contains apps.stripe.credentialId<br>2. credentialId is a number |
| **Test Data** | N/A |
| **Priority** | Low |
| **Test Type** | Positive |

---

## 10. Embed & API Test Cases

### 10.1 Embed Code Generator

#### TC-EMB-P-001: Generate Inline Embed Code
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EMB-P-001 |
| **Module/Feature** | Embed - Inline |
| **Test Scenario** | Verify inline embed code generation |
| **Preconditions** | User has event types |
| **Test Steps** | 1. Navigate to /event-types<br>2. Click options on first event type<br>3. Click "Embed"<br>4. Select "Inline" embed type<br>5. View generated code |
| **Expected Results** | 1. Embed dialog opens<br>2. HTML code contains Cal inline embed<br>3. Code is valid JavaScript<br>4. Preview iframe loads correctly |
| **Test Data** | N/A |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-EMB-P-002: Generate Floating Popup Embed Code
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EMB-P-002 |
| **Module/Feature** | Embed - Floating Popup |
| **Test Scenario** | Verify floating popup embed code generation |
| **Preconditions** | User has event types |
| **Test Steps** | 1. Navigate to /event-types<br>2. Click embed on event type<br>3. Select "Floating popup" type<br>4. View generated code |
| **Expected Results** | 1. HTML code contains floating-popup embed<br>2. Code includes floatingButton configuration<br>3. Preview shows floating button |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-EMB-P-003: Generate Element Click Embed Code
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EMB-P-003 |
| **Module/Feature** | Embed - Element Click |
| **Test Scenario** | Verify element click embed code generation |
| **Preconditions** | User has event types |
| **Test Steps** | 1. Navigate to /event-types<br>2. Click embed on event type<br>3. Select "Element click" type<br>4. View generated code |
| **Expected Results** | 1. HTML code contains element-click embed<br>2. Code includes data-cal-link attribute<br>3. Preview shows clickable element |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-EMB-P-004: Generate React Embed Code
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EMB-P-004 |
| **Module/Feature** | Embed - React |
| **Test Scenario** | Verify React embed code generation |
| **Preconditions** | User has event types |
| **Test Steps** | 1. Open embed dialog<br>2. Select embed type<br>3. Click "React" tab<br>4. View generated code |
| **Expected Results** | 1. React code contains MyApp function<br>2. Code includes Cal component or cal() call<br>3. Code is valid JSX |
| **Test Data** | N/A |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-EMB-P-005: Organization Embed Includes Org Slug
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EMB-P-005 |
| **Module/Feature** | Embed - Organization |
| **Test Scenario** | Verify org embed code includes org slug |
| **Preconditions** | User is org member |
| **Test Steps** | 1. Login as org member<br>2. Navigate to /event-types<br>3. Open embed dialog<br>4. Check generated code |
| **Expected Results** | 1. Embed code contains org slug<br>2. Preview uses org booker URL |
| **Test Data** | Org member user |
| **Priority** | Medium |
| **Test Type** | Positive |

### 10.2 Team Embed

#### TC-EMB-P-006: Team Event Email Embed Slots
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EMB-P-006 |
| **Module/Feature** | Embed - Team Email |
| **Test Scenario** | Verify email embed shows slots for team events |
| **Preconditions** | Team with collective event exists |
| **Test Steps** | 1. Login as team owner<br>2. Navigate to team event types<br>3. Click options > Embed<br>4. Select "Email" embed<br>5. Go to next month |
| **Expected Results** | 1. Slots are available (not "no slots")<br>2. "See all available times" link contains team URL |
| **Test Data** | Team event type |
| **Priority** | Medium |
| **Test Type** | Positive |

---

## 11. Routing Forms Test Cases

### 11.1 Form Management

#### TC-RTF-P-001: Create Routing Form
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RTF-P-001 |
| **Module/Feature** | Routing Forms - Creation |
| **Test Scenario** | Verify routing form can be created |
| **Preconditions** | User is logged in |
| **Test Steps** | 1. Navigate to /routing-forms<br>2. Click "New Form"<br>3. Enter form name<br>4. Add form fields<br>5. Configure routing rules<br>6. Save form |
| **Expected Results** | 1. Form is created<br>2. Form appears in list<br>3. Form is accessible via URL |
| **Test Data** | Form name: Test Routing Form |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-RTF-P-002: Add Custom Fields to Form
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RTF-P-002 |
| **Module/Feature** | Routing Forms - Fields |
| **Test Scenario** | Verify custom fields can be added |
| **Preconditions** | Routing form exists |
| **Test Steps** | 1. Edit routing form<br>2. Add text field<br>3. Add dropdown field<br>4. Add radio button field<br>5. Save form |
| **Expected Results** | 1. All field types are added<br>2. Fields appear on form preview<br>3. Fields are functional |
| **Test Data** | Various field types |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-RTF-P-003: Configure Routing Rules
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RTF-P-003 |
| **Module/Feature** | Routing Forms - Rules |
| **Test Scenario** | Verify routing rules work correctly |
| **Preconditions** | Form with fields exists |
| **Test Steps** | 1. Edit routing form<br>2. Add rule: if field = "A" route to event type 1<br>3. Add rule: if field = "B" route to event type 2<br>4. Save form<br>5. Test with different inputs |
| **Expected Results** | 1. Input "A" routes to event type 1<br>2. Input "B" routes to event type 2<br>3. Routing is correct |
| **Test Data** | Field values: A, B |
| **Priority** | High |
| **Test Type** | Positive, Regression |

#### TC-RTF-P-004: Route to External URL
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RTF-P-004 |
| **Module/Feature** | Routing Forms - External Routing |
| **Test Scenario** | Verify routing to external URL works |
| **Preconditions** | Routing form exists |
| **Test Steps** | 1. Edit routing form<br>2. Add rule to route to external URL<br>3. Save form<br>4. Submit form with matching input |
| **Expected Results** | 1. User is redirected to external URL<br>2. URL parameters are passed correctly |
| **Test Data** | External URL: https://example.com |
| **Priority** | Medium |
| **Test Type** | Positive |

#### TC-RTF-N-001: Invalid Routing Configuration
| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RTF-N-001 |
| **Module/Feature** | Routing Forms - Validation |
| **Test Scenario** | Verify invalid routing config is rejected |
| **Preconditions** | Routing form exists |
| **Test Steps** | 1. Edit routing form<br>2. Create circular routing rule<br>3. Attempt to save |
| **Expected Results** | 1. Validation error is shown<br>2. Form is not saved<br>3. User is prompted to fix configuration |
| **Test Data** | Circular routing rule |
| **Priority** | Medium |
| **Test Type** | Negative |

---

## Appendix A: Test Environment Requirements

### A.1 Test Environment Setup
- Node.js >= 18.x
- PostgreSQL >= 13.x
- Yarn package manager
- Playwright for E2E testing

### A.2 Test Data Requirements
- Test user accounts with various roles
- Test team with multiple members
- Test organization with sub-teams
- Connected calendar accounts (Google, Outlook)
- Stripe test account

### A.3 Test Execution Commands
```bash
# Run E2E tests
NEXT_PUBLIC_IS_E2E=1 yarn playwright test --project=@calcom/web

# Run unit tests
TZ=UTC yarn vitest run

# Run lint checks
yarn lint-staged
```

---

## Appendix B: Traceability Matrix

| Requirement ID | Test Case IDs |
|----------------|---------------|
| FR-AUTH-001 | TC-AUTH-P-001 |
| FR-AUTH-002 | TC-AUTH-P-002 |
| FR-AUTH-003 | TC-AUTH-P-003 |
| FR-AUTH-004 | TC-AUTH-N-001, TC-AUTH-N-002 |
| FR-AUTH-008 | TC-AUTH-P-004 |
| FR-AUTH-012 | TC-AUTH-N-005, TC-AUTH-N-006 |
| FR-EVT-001 | TC-EVT-P-003 |
| FR-EVT-004 | TC-EVT-P-005 |
| FR-EVT-009 | TC-EVT-P-008, TC-EVT-P-009, TC-EVT-P-010, TC-EVT-P-011 |
| FR-EVT-015 | TC-EVT-P-007 |
| FR-EVT-021 | TC-TM-P-005 |
| FR-EVT-022 | TC-TM-P-004 |
| FR-BKG-001 | TC-BKG-P-001 |
| FR-BKG-004 | TC-BKG-P-002 |
| FR-BKG-005 | TC-BKG-N-001 |
| FR-BKG-006 | TC-BKG-P-005, TC-BKG-P-006 |
| FR-BKG-018 | TC-BKG-P-007 |
| FR-BKG-019 | TC-BKG-P-009 |
| FR-AVL-001 | TC-AVL-P-001 |
| FR-AVL-008 | TC-AVL-P-005 |
| FR-WFL-001 | TC-WFL-P-001 |
| FR-PAY-001 | TC-PAY-P-001 |
| FR-PAY-003 | TC-PAY-P-002 |
| FR-EMB-001 | TC-EMB-P-001 |
| FR-EMB-002 | TC-EMB-P-002 |
| FR-EMB-003 | TC-EMB-P-003 |
| FR-RTF-001 | TC-RTF-P-001 |
| FR-RTF-003 | TC-RTF-P-003 |

---

*This document is subject to updates as the Cal.com platform evolves.*
