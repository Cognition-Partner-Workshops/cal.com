# Business Requirements Document (BRD)
# Cal.com - Open Source Scheduling Platform

**Document Version:** 1.0  
**Date:** February 2026  
**Prepared By:** QA Engineering Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Application Overview](#2-application-overview)
3. [Core Functional Modules](#3-core-functional-modules)
4. [User Roles and Permissions](#4-user-roles-and-permissions)
5. [Integration Requirements](#5-integration-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Data Model Overview](#7-data-model-overview)
8. [Glossary](#8-glossary)

---

## 1. Executive Summary

### 1.1 Purpose
Cal.com is an open-source scheduling infrastructure platform designed as a Calendly alternative. It provides individuals, teams, and organizations with a comprehensive scheduling solution that offers full control over events, data, workflow, and appearance.

### 1.2 Business Objectives
- Provide a self-hosted or cloud-hosted scheduling solution
- Enable white-label customization for businesses
- Offer API-driven architecture for seamless integrations
- Support multi-tenant organizations with team scheduling capabilities
- Ensure data privacy and user control over scheduling data

### 1.3 Target Users
- Individual professionals (freelancers, consultants)
- Small to medium businesses
- Enterprise organizations
- Teams requiring collaborative scheduling
- Developers building scheduling integrations

---

## 2. Application Overview

### 2.1 Product Description
Cal.com is a scheduling platform that allows users to create booking pages, manage availability, and accept appointments from external parties. The platform supports various scheduling scenarios including one-on-one meetings, group events, round-robin assignments, and collective team bookings.

### 2.2 Technology Stack
- **Frontend:** Next.js, React.js, Tailwind CSS
- **Backend:** Node.js, tRPC
- **Database:** PostgreSQL with Prisma ORM
- **Video Conferencing:** Daily.co (default), with support for Zoom, Google Meet
- **Authentication:** NextAuth.js with support for SSO/SAML

### 2.3 Deployment Options
- Self-hosted deployment
- Cal.com cloud hosting
- Docker containerization
- Platform-as-a-Service (Vercel, Railway, etc.)

---

## 3. Core Functional Modules

### 3.1 Authentication Module

#### 3.1.1 User Registration
**Business Requirement:** Users must be able to create accounts to access the scheduling platform.

**Functional Requirements:**
- FR-AUTH-001: System shall support email/password registration
- FR-AUTH-002: System shall support Google OAuth registration
- FR-AUTH-003: System shall support SAML/SSO registration for enterprise users
- FR-AUTH-004: System shall validate unique username and email during registration
- FR-AUTH-005: System shall send email verification for new accounts
- FR-AUTH-006: System shall support organization invite tokens for team onboarding
- FR-AUTH-007: System shall enforce password complexity requirements

#### 3.1.2 User Login
**Business Requirement:** Registered users must be able to securely access their accounts.

**Functional Requirements:**
- FR-AUTH-008: System shall support email/password login
- FR-AUTH-009: System shall support Google OAuth login
- FR-AUTH-010: System shall support SAML/SSO login
- FR-AUTH-011: System shall support two-factor authentication (2FA)
- FR-AUTH-012: System shall display appropriate error messages for invalid credentials
- FR-AUTH-013: System shall maintain user sessions securely

#### 3.1.3 Password Management
**Business Requirement:** Users must be able to manage and recover their passwords.

**Functional Requirements:**
- FR-AUTH-014: System shall support password reset via email
- FR-AUTH-015: System shall allow users to change password from settings
- FR-AUTH-016: System shall expire password reset tokens after defined period
- FR-AUTH-017: System shall hash passwords using bcrypt

### 3.2 Event Types Module

#### 3.2.1 Event Type Management
**Business Requirement:** Users must be able to create and manage different types of bookable events.

**Functional Requirements:**
- FR-EVT-001: System shall allow creation of new event types with title, slug, and description
- FR-EVT-002: System shall support configurable event durations (15, 30, 45, 60+ minutes)
- FR-EVT-003: System shall support multiple duration options for single event type
- FR-EVT-004: System shall allow event type duplication
- FR-EVT-005: System shall allow event type deletion
- FR-EVT-006: System shall support event type visibility (public/hidden)
- FR-EVT-007: System shall support custom event URLs/slugs
- FR-EVT-008: System shall allow reordering of event types

#### 3.2.2 Event Type Configuration
**Business Requirement:** Users must be able to customize event type settings.

**Functional Requirements:**
- FR-EVT-009: System shall support location configuration (in-person, phone, video)
- FR-EVT-010: System shall support multiple location options per event
- FR-EVT-011: System shall support buffer time before/after events
- FR-EVT-012: System shall support minimum booking notice period
- FR-EVT-013: System shall support booking limits (per day/week/month/year)
- FR-EVT-014: System shall support duration limits
- FR-EVT-015: System shall support recurring events configuration
- FR-EVT-016: System shall support seats/capacity for group events
- FR-EVT-017: System shall support booking confirmation requirements
- FR-EVT-018: System shall support custom booking questions/fields
- FR-EVT-019: System shall support success redirect URLs
- FR-EVT-020: System shall support timezone locking

#### 3.2.3 Team Event Types
**Business Requirement:** Teams must be able to create collaborative event types.

**Functional Requirements:**
- FR-EVT-021: System shall support Round Robin scheduling (rotating hosts)
- FR-EVT-022: System shall support Collective scheduling (all hosts required)
- FR-EVT-023: System shall support Managed event types (admin-controlled templates)
- FR-EVT-024: System shall support host priority and weighting for Round Robin
- FR-EVT-025: System shall support "assign all team members" option

### 3.3 Booking Flow Module

#### 3.3.1 Booking Creation
**Business Requirement:** External users must be able to book appointments through booking pages.

**Functional Requirements:**
- FR-BKG-001: System shall display available time slots based on host availability
- FR-BKG-002: System shall collect booker information (name, email, notes)
- FR-BKG-003: System shall support custom booking questions
- FR-BKG-004: System shall support guest additions to bookings
- FR-BKG-005: System shall prevent double-booking of time slots
- FR-BKG-006: System shall reserve time slots during booking process
- FR-BKG-007: System shall support timezone selection for bookers
- FR-BKG-008: System shall send confirmation emails to all parties
- FR-BKG-009: System shall generate calendar invites (ICS)
- FR-BKG-010: System shall support booking with payment requirements

#### 3.3.2 Booking Management
**Business Requirement:** Users must be able to manage their bookings.

**Functional Requirements:**
- FR-BKG-011: System shall display upcoming bookings list
- FR-BKG-012: System shall display past bookings list
- FR-BKG-013: System shall display cancelled bookings list
- FR-BKG-014: System shall display unconfirmed/pending bookings
- FR-BKG-015: System shall support booking filtering and search
- FR-BKG-016: System shall support booking confirmation/rejection for opt-in events
- FR-BKG-017: System shall support booking notes and internal notes

#### 3.3.3 Rescheduling
**Business Requirement:** Both hosts and attendees must be able to reschedule bookings.

**Functional Requirements:**
- FR-BKG-018: System shall allow hosts to reschedule bookings
- FR-BKG-019: System shall allow attendees to reschedule via link
- FR-BKG-020: System shall send reschedule request emails
- FR-BKG-021: System shall display former time when rescheduling
- FR-BKG-022: System shall support minimum reschedule notice period
- FR-BKG-023: System shall handle rescheduling of paid bookings
- FR-BKG-024: System shall optionally allow rescheduling cancelled bookings
- FR-BKG-025: System shall optionally allow rescheduling past bookings

#### 3.3.4 Cancellation
**Business Requirement:** Both hosts and attendees must be able to cancel bookings.

**Functional Requirements:**
- FR-BKG-026: System shall allow hosts to cancel bookings
- FR-BKG-027: System shall allow attendees to cancel via link
- FR-BKG-028: System shall require cancellation reason
- FR-BKG-029: System shall send cancellation notification emails
- FR-BKG-030: System shall optionally disable cancellation for event types
- FR-BKG-031: System shall handle refunds for cancelled paid bookings

### 3.4 Availability Management Module

#### 3.4.1 Schedule Management
**Business Requirement:** Users must be able to define their working hours and availability.

**Functional Requirements:**
- FR-AVL-001: System shall support creation of multiple schedules
- FR-AVL-002: System shall support default schedule assignment
- FR-AVL-003: System shall support per-day availability configuration
- FR-AVL-004: System shall support multiple time ranges per day
- FR-AVL-005: System shall support schedule timezone configuration
- FR-AVL-006: System shall support copying times across days
- FR-AVL-007: System shall prevent deletion of last remaining schedule

#### 3.4.2 Date Overrides
**Business Requirement:** Users must be able to set specific availability for particular dates.

**Functional Requirements:**
- FR-AVL-008: System shall support date-specific availability overrides
- FR-AVL-009: System shall support marking dates as unavailable
- FR-AVL-010: System shall support custom hours for specific dates
- FR-AVL-011: System shall support multiple date override entries
- FR-AVL-012: System shall support date override deletion

#### 3.4.3 Out of Office
**Business Requirement:** Users must be able to set out-of-office periods.

**Functional Requirements:**
- FR-AVL-013: System shall support out-of-office date ranges
- FR-AVL-014: System shall support booking redirection during OOO
- FR-AVL-015: System shall support OOO reasons/notes

#### 3.4.4 Travel Schedules
**Business Requirement:** Users must be able to manage timezone changes for travel.

**Functional Requirements:**
- FR-AVL-016: System shall support travel schedule entries
- FR-AVL-017: System shall automatically adjust availability for travel timezones

### 3.5 Calendar Integrations Module

#### 3.5.1 Calendar Connections
**Business Requirement:** Users must be able to connect external calendars for availability checking.

**Functional Requirements:**
- FR-CAL-001: System shall support Google Calendar integration
- FR-CAL-002: System shall support Microsoft Outlook/Office 365 integration
- FR-CAL-003: System shall support Apple Calendar integration
- FR-CAL-004: System shall support CalDAV calendar connections
- FR-CAL-005: System shall support multiple calendar connections per user
- FR-CAL-006: System shall check connected calendars for conflicts

#### 3.5.2 Destination Calendar
**Business Requirement:** Users must be able to specify where new bookings are added.

**Functional Requirements:**
- FR-CAL-007: System shall support destination calendar selection
- FR-CAL-008: System shall support per-event-type destination calendars
- FR-CAL-009: System shall create calendar events for confirmed bookings

#### 3.5.3 Calendar Sync
**Business Requirement:** System must keep calendar data synchronized.

**Functional Requirements:**
- FR-CAL-010: System shall sync calendar events periodically
- FR-CAL-011: System shall support webhook-based calendar updates
- FR-CAL-012: System shall handle calendar sync errors gracefully

### 3.6 Video Conferencing Module

#### 3.6.1 Video Integration
**Business Requirement:** Users must be able to add video conferencing to their events.

**Functional Requirements:**
- FR-VID-001: System shall support Cal Video (Daily.co) as default
- FR-VID-002: System shall support Zoom integration
- FR-VID-003: System shall support Google Meet integration
- FR-VID-004: System shall support Microsoft Teams integration
- FR-VID-005: System shall auto-generate meeting links for bookings
- FR-VID-006: System shall support recording options for Cal Video
- FR-VID-007: System shall support transcription for Cal Video

### 3.7 Workflows & Automations Module

#### 3.7.1 Workflow Management
**Business Requirement:** Users must be able to create automated workflows for booking events.

**Functional Requirements:**
- FR-WFL-001: System shall support workflow creation with triggers and actions
- FR-WFL-002: System shall support BEFORE_EVENT trigger
- FR-WFL-003: System shall support AFTER_EVENT trigger
- FR-WFL-004: System shall support NEW_EVENT trigger
- FR-WFL-005: System shall support EVENT_CANCELLED trigger
- FR-WFL-006: System shall support RESCHEDULE_EVENT trigger
- FR-WFL-007: System shall support workflow editing and deletion

#### 3.7.2 Workflow Actions
**Business Requirement:** Workflows must support various notification actions.

**Functional Requirements:**
- FR-WFL-008: System shall support EMAIL_HOST action
- FR-WFL-009: System shall support EMAIL_ATTENDEE action
- FR-WFL-010: System shall support EMAIL_ADDRESS action (custom email)
- FR-WFL-011: System shall support SMS_ATTENDEE action
- FR-WFL-012: System shall support SMS_NUMBER action
- FR-WFL-013: System shall support WhatsApp notifications
- FR-WFL-014: System shall support custom email/SMS templates
- FR-WFL-015: System shall support time-based triggers (X hours/days before/after)

#### 3.7.3 Team Workflows
**Business Requirement:** Teams must be able to share workflows across members.

**Functional Requirements:**
- FR-WFL-016: System shall support team-level workflows
- FR-WFL-017: System shall support workflow assignment to event types
- FR-WFL-018: System shall support "active on all" event types option

### 3.8 Organizations & Teams Module

#### 3.8.1 Team Management
**Business Requirement:** Users must be able to create and manage teams.

**Functional Requirements:**
- FR-TM-001: System shall support team creation with name and slug
- FR-TM-002: System shall support team member invitations
- FR-TM-003: System shall support member roles (Owner, Admin, Member)
- FR-TM-004: System shall support team profile customization
- FR-TM-005: System shall support team branding (logo, colors)
- FR-TM-006: System shall support private teams (hidden member list)
- FR-TM-007: System shall support team deletion

#### 3.8.2 Organization Management
**Business Requirement:** Enterprise users must be able to manage organizations with multiple teams.

**Functional Requirements:**
- FR-ORG-001: System shall support organization creation
- FR-ORG-002: System shall support sub-team creation within organizations
- FR-ORG-003: System shall support organization-wide settings
- FR-ORG-004: System shall support organization branding
- FR-ORG-005: System shall support custom organization domains
- FR-ORG-006: System shall support organization-level admin controls
- FR-ORG-007: System shall support directory sync (SCIM/DSYNC)
- FR-ORG-008: System shall support organization-wide workflows

#### 3.8.3 Member Attributes
**Business Requirement:** Organizations must be able to define custom attributes for members.

**Functional Requirements:**
- FR-ORG-009: System shall support custom member attributes
- FR-ORG-010: System shall support attribute-based routing

### 3.9 Payments Module

#### 3.9.1 Payment Integration
**Business Requirement:** Users must be able to collect payments for bookings.

**Functional Requirements:**
- FR-PAY-001: System shall support Stripe integration
- FR-PAY-002: System shall support PayPal integration
- FR-PAY-003: System shall support configurable pricing per event type
- FR-PAY-004: System shall support multiple currencies
- FR-PAY-005: System shall require payment before booking confirmation
- FR-PAY-006: System shall handle payment failures gracefully
- FR-PAY-007: System shall support refunds for cancellations
- FR-PAY-008: System shall display payment status on bookings

### 3.10 Embed & API Module

#### 3.10.1 Embed Functionality
**Business Requirement:** Users must be able to embed booking widgets on external websites.

**Functional Requirements:**
- FR-EMB-001: System shall support inline embed widget
- FR-EMB-002: System shall support floating popup embed
- FR-EMB-003: System shall support element-click trigger embed
- FR-EMB-004: System shall generate HTML embed code
- FR-EMB-005: System shall generate React embed code
- FR-EMB-006: System shall support embed customization (colors, layout)
- FR-EMB-007: System shall support embed preview

#### 3.10.2 API Access
**Business Requirement:** Developers must be able to integrate with Cal.com programmatically.

**Functional Requirements:**
- FR-API-001: System shall provide REST API endpoints
- FR-API-002: System shall support API key authentication
- FR-API-003: System shall support OAuth authentication
- FR-API-004: System shall provide API documentation
- FR-API-005: System shall support rate limiting
- FR-API-006: System shall support webhook notifications

### 3.11 Routing Forms Module

#### 3.11.1 Form Management
**Business Requirement:** Users must be able to create routing forms to direct bookers to appropriate event types.

**Functional Requirements:**
- FR-RTF-001: System shall support routing form creation
- FR-RTF-002: System shall support custom form fields
- FR-RTF-003: System shall support conditional routing rules
- FR-RTF-004: System shall support routing to different event types
- FR-RTF-005: System shall support routing to external URLs
- FR-RTF-006: System shall support form response tracking
- FR-RTF-007: System shall support team routing forms

---

## 4. User Roles and Permissions

### 4.1 System-Level Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| USER | Standard user account | Manage own event types, bookings, availability, integrations |
| ADMIN | System administrator | All USER permissions + system configuration, user management |

### 4.2 Team-Level Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| MEMBER | Team member | View team event types, participate in team bookings |
| ADMIN | Team administrator | All MEMBER permissions + manage team settings, members, event types |
| OWNER | Team owner | All ADMIN permissions + delete team, transfer ownership |

### 4.3 Organization-Level Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| MEMBER | Organization member | Access organization resources, join teams |
| ADMIN | Organization administrator | Manage organization settings, teams, members |
| OWNER | Organization owner | Full organization control, billing management |

### 4.4 Permission Matrix

| Feature | User | Team Member | Team Admin | Team Owner | Org Admin | Org Owner |
|---------|------|-------------|------------|------------|-----------|-----------|
| Create personal event types | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View team event types | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create team event types | - | - | ✓ | ✓ | ✓ | ✓ |
| Manage team members | - | - | ✓ | ✓ | ✓ | ✓ |
| Delete team | - | - | - | ✓ | ✓ | ✓ |
| Create sub-teams | - | - | - | - | ✓ | ✓ |
| Manage organization settings | - | - | - | - | ✓ | ✓ |
| Manage billing | - | - | - | - | - | ✓ |

---

## 5. Integration Requirements

### 5.1 Calendar Integrations

| Integration | Type | Features |
|-------------|------|----------|
| Google Calendar | OAuth 2.0 | Read/write events, availability checking |
| Microsoft Outlook | OAuth 2.0 | Read/write events, availability checking |
| Apple Calendar | CalDAV | Read/write events, availability checking |
| CalDAV | Protocol | Generic calendar support |

### 5.2 Video Conferencing Integrations

| Integration | Type | Features |
|-------------|------|----------|
| Cal Video (Daily.co) | Built-in | Video calls, recording, transcription |
| Zoom | OAuth 2.0 | Meeting creation, join links |
| Google Meet | OAuth 2.0 | Meeting creation, join links |
| Microsoft Teams | OAuth 2.0 | Meeting creation, join links |

### 5.3 Payment Integrations

| Integration | Type | Features |
|-------------|------|----------|
| Stripe | OAuth/API | Payment collection, refunds, multiple currencies |
| PayPal | OAuth/API | Payment collection |

### 5.4 Communication Integrations

| Integration | Type | Features |
|-------------|------|----------|
| Email (SMTP) | Protocol | Notifications, confirmations |
| Twilio | API | SMS notifications |
| WhatsApp | API | WhatsApp notifications |

### 5.5 Authentication Integrations

| Integration | Type | Features |
|-------------|------|----------|
| Google | OAuth 2.0 | SSO login |
| SAML | Protocol | Enterprise SSO |
| SCIM | Protocol | Directory sync |

---

## 6. Non-Functional Requirements

### 6.1 Performance Requirements

| Requirement ID | Description | Target |
|----------------|-------------|--------|
| NFR-PERF-001 | Page load time | < 3 seconds |
| NFR-PERF-002 | API response time | < 500ms (95th percentile) |
| NFR-PERF-003 | Booking creation time | < 2 seconds |
| NFR-PERF-004 | Concurrent users | Support 10,000+ simultaneous users |
| NFR-PERF-005 | Database query time | < 100ms for common queries |

### 6.2 Security Requirements

| Requirement ID | Description |
|----------------|-------------|
| NFR-SEC-001 | All data transmission must use HTTPS/TLS |
| NFR-SEC-002 | Passwords must be hashed using bcrypt |
| NFR-SEC-003 | API keys must be securely stored and hashed |
| NFR-SEC-004 | Support for two-factor authentication |
| NFR-SEC-005 | Session tokens must expire after inactivity |
| NFR-SEC-006 | CSRF protection on all forms |
| NFR-SEC-007 | Input validation and sanitization |
| NFR-SEC-008 | SQL injection prevention via ORM |
| NFR-SEC-009 | XSS prevention |
| NFR-SEC-010 | Rate limiting on authentication endpoints |

### 6.3 Scalability Requirements

| Requirement ID | Description |
|----------------|-------------|
| NFR-SCL-001 | Horizontal scaling support for web servers |
| NFR-SCL-002 | Database connection pooling |
| NFR-SCL-003 | Caching layer support (Redis) |
| NFR-SCL-004 | CDN support for static assets |
| NFR-SCL-005 | Microservices-ready architecture |

### 6.4 Availability Requirements

| Requirement ID | Description | Target |
|----------------|-------------|--------|
| NFR-AVL-001 | System uptime | 99.9% |
| NFR-AVL-002 | Planned maintenance windows | < 4 hours/month |
| NFR-AVL-003 | Recovery time objective (RTO) | < 1 hour |
| NFR-AVL-004 | Recovery point objective (RPO) | < 15 minutes |

### 6.5 Usability Requirements

| Requirement ID | Description |
|----------------|-------------|
| NFR-USB-001 | Responsive design for mobile devices |
| NFR-USB-002 | WCAG 2.1 AA accessibility compliance |
| NFR-USB-003 | Multi-language support (i18n) |
| NFR-USB-004 | Timezone-aware date/time display |
| NFR-USB-005 | Intuitive navigation and UX |

### 6.6 Compliance Requirements

| Requirement ID | Description |
|----------------|-------------|
| NFR-CMP-001 | GDPR compliance for EU users |
| NFR-CMP-002 | Data export capability |
| NFR-CMP-003 | Account deletion capability |
| NFR-CMP-004 | Cookie consent management |
| NFR-CMP-005 | Privacy policy and terms of service |

---

## 7. Data Model Overview

### 7.1 Core Entities

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| User | Platform user account | id, email, username, name, timezone, role |
| EventType | Bookable event configuration | id, title, slug, duration, locations, userId/teamId |
| Booking | Scheduled appointment | id, uid, startTime, endTime, status, userId, eventTypeId |
| Attendee | Booking participant | id, email, name, timezone, bookingId |
| Schedule | Availability schedule | id, name, timezone, userId |
| Availability | Time slot availability | id, days, startTime, endTime, scheduleId |
| Team | Group of users | id, name, slug, members |
| Membership | User-team relationship | id, userId, teamId, role |
| Credential | Integration credentials | id, type, key, userId/teamId |
| Workflow | Automation workflow | id, name, trigger, steps, userId/teamId |
| Payment | Booking payment record | id, amount, currency, status, bookingId |

### 7.2 Entity Relationships

```
User (1) -----> (N) EventType
User (1) -----> (N) Booking
User (1) -----> (N) Schedule
User (1) -----> (N) Credential
User (N) <----> (N) Team (via Membership)

EventType (1) -----> (N) Booking
EventType (1) -----> (N) Host

Booking (1) -----> (N) Attendee
Booking (1) -----> (N) Payment
Booking (1) -----> (N) BookingReference

Schedule (1) -----> (N) Availability

Team (1) -----> (N) EventType
Team (1) -----> (N) Workflow

Organization (1) -----> (N) Team
Organization (1) -----> (N) Profile
```

---

## 8. Glossary

| Term | Definition |
|------|------------|
| Booker | External user who books an appointment |
| Host | User who owns/manages an event type |
| Event Type | Configuration for a bookable meeting type |
| Booking | A confirmed or pending appointment |
| Slot | Available time period for booking |
| Round Robin | Scheduling type that rotates between team members |
| Collective | Scheduling type requiring all team members |
| Managed Event | Event type template controlled by admin |
| Workflow | Automated action triggered by booking events |
| Routing Form | Form that directs users to appropriate event types |
| Embed | Widget for integrating booking on external sites |
| Destination Calendar | Calendar where new bookings are created |
| Selected Calendar | Calendar checked for availability conflicts |
| Buffer Time | Gap before/after events to prevent back-to-back bookings |
| Minimum Notice | Required advance time for new bookings |

---

## Document Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Product Owner | | | |
| Technical Lead | | | |

---

*This document is subject to updates as the Cal.com platform evolves.*
