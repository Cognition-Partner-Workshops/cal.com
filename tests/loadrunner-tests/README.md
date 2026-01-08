# Cal.com LoadRunner Performance Test Scripts

This directory contains comprehensive LoadRunner performance test scripts for the Cal.com scheduling application.

## Overview

These scripts are designed to simulate realistic user loads and measure the performance of key Cal.com functionalities including booking flows, availability checking, user authentication, event type management, and team booking scenarios.

## Directory Structure

```
loadrunner-tests/
├── README.md                           # This file
├── scripts/
│   ├── booking_flow.c                  # End-to-end booking creation flow
│   ├── availability_check.c            # Availability and slot retrieval
│   ├── user_authentication.c           # User login/logout and session management
│   ├── event_type_management.c         # Event type CRUD operations
│   └── team_booking.c                  # Team/collective booking scenarios
└── data/
    ├── users.dat                       # Test user credentials
    └── event_types.dat                 # Event type and team data
```

## Test Scripts

### 1. Booking Flow (`booking_flow.c`)

Simulates the complete booking creation process:
- T01_User_Login - Authenticate user
- T02_Get_Event_Types - Retrieve available event types
- T03_Get_Available_Slots - Query available time slots
- T04_Create_Booking - Create a new booking
- T05_Verify_Booking - Confirm booking details
- T06_Cancel_Booking - Cancel booking (cleanup)

### 2. Availability Check (`availability_check.c`)

Tests availability and slot retrieval performance:
- T01_Get_Public_Event_Type - Load public event type page
- T02_Get_Monthly_Availability - Query monthly availability
- T03_Get_Daily_Slots_Batch - Query slots for multiple days
- T04_Timezone_Slot_Query - Test timezone conversions
- T05_Get_Busy_Times - Retrieve busy time blocks
- T06_Check_Specific_Slot - Validate specific slot availability

### 3. User Authentication (`user_authentication.c`)

Tests authentication and session management:
- T01_Get_CSRF_Token - Obtain CSRF token
- T02_User_Login - Authenticate with credentials
- T03_Validate_Session - Verify session validity
- T04_Get_User_Profile - Retrieve user profile
- T05_Get_User_Settings - Load user settings
- T06_Get_User_Bookings - List user's bookings
- T07_Get_User_Event_Types - List user's event types
- T08_User_Logout - Sign out user

### 4. Event Type Management (`event_type_management.c`)

Tests event type CRUD operations:
- T01_List_Event_Types - List all event types
- T02_Create_Event_Type - Create new event type
- T03_Get_Event_Type_Details - Retrieve event type details
- T04_Update_Event_Type - Update event type settings
- T05_Update_Availability - Update availability schedule
- T06_Duplicate_Event_Type - Duplicate an event type
- T07_Delete_Duplicated_Event_Type - Delete duplicated event type
- T08_Delete_Original_Event_Type - Cleanup original event type

### 5. Team Booking (`team_booking.c`)

Tests team and collective booking scenarios:
- T01_Get_Team_Info - Retrieve team information
- T02_Get_Team_Event_Types - List team event types
- T03_Get_Team_Availability - Check team member availability
- T04_Create_Round_Robin_Booking - Create round-robin booking
- T05_Get_Collective_Availability - Check collective availability
- T06_Create_Collective_Booking - Create collective booking
- T07_Cancel_Round_Robin_Booking - Cancel round-robin booking
- T08_Cancel_Collective_Booking - Cancel collective booking

## Prerequisites

1. **LoadRunner Installation**: LoadRunner Professional 2021 or later, or LoadRunner Community Edition
2. **Cal.com Instance**: Running Cal.com application (local or remote)
3. **Test Data**: Configured test users and event types in the Cal.com database

## Configuration

### Environment Variables

Update the following constants in each script:

```c
#define BASE_URL "http://localhost:3000"        // Cal.com base URL
#define API_BASE_URL "http://localhost:3000/api" // API endpoint
#define THINK_TIME_MIN 2                         // Minimum think time (seconds)
#define THINK_TIME_MAX 5                         // Maximum think time (seconds)
```

### Parameter Files

1. **users.dat**: Contains test user credentials
   - pEmail: User email address
   - pPassword: User password
   - pBookerName: Name for booking
   - pBookerEmail: Email for booking

2. **event_types.dat**: Contains event type and team data
   - pUsername: Cal.com username
   - pEventSlug: Event type slug
   - pTeamSlug: Team slug

## Running Tests

### VuGen (Script Development)

1. Open LoadRunner VuGen
2. Create new Web - HTTP/HTML script
3. Import the .c script file
4. Configure runtime settings:
   - Set iteration count
   - Configure pacing
   - Set think time options
5. Run script in VuGen for debugging

### Controller (Load Test Execution)

1. Open LoadRunner Controller
2. Create new scenario
3. Add scripts to scenario
4. Configure virtual user groups:
   - Set number of Vusers
   - Configure ramp-up schedule
   - Set test duration
5. Configure load generators
6. Run scenario

### Recommended Load Profiles

#### Baseline Test
- 10 Vusers per script
- 30-minute duration
- 1 Vuser ramp-up per minute

#### Stress Test
- 50-100 Vusers per script
- 60-minute duration
- 5 Vusers ramp-up per minute

#### Endurance Test
- 25 Vusers per script
- 4-8 hour duration
- Steady state load

## Performance Metrics

### Key Transactions to Monitor

| Transaction | Target Response Time | Acceptable Threshold |
|-------------|---------------------|---------------------|
| User Login | < 2 seconds | < 5 seconds |
| Get Available Slots | < 1 second | < 3 seconds |
| Create Booking | < 3 seconds | < 5 seconds |
| Get Event Types | < 1 second | < 2 seconds |
| Cancel Booking | < 2 seconds | < 4 seconds |

### SLA Recommendations

- 90th percentile response time < 3 seconds
- Error rate < 1%
- Throughput > 100 transactions/second
- Server CPU utilization < 80%
- Memory utilization < 85%

## Troubleshooting

### Common Issues

1. **CSRF Token Errors**: Ensure CSRF token correlation is working correctly
2. **Session Timeout**: Increase session timeout in Cal.com configuration
3. **Rate Limiting**: Adjust think times or disable rate limiting for testing
4. **SSL/TLS Errors**: Configure LoadRunner to accept self-signed certificates

### Debug Mode

Enable verbose logging by adding:
```c
lr_set_debug_message(LR_MSG_CLASS_EXTENDED_LOG | LR_MSG_CLASS_RESULT_DATA, LR_SWITCH_ON);
```

## Best Practices

1. **Parameterization**: Always use parameterized data for realistic load simulation
2. **Correlation**: Correlate all dynamic values (tokens, IDs, timestamps)
3. **Think Times**: Use realistic think times based on actual user behavior
4. **Error Handling**: Implement proper error handling and logging
5. **Cleanup**: Always clean up test data after each iteration
6. **Monitoring**: Monitor both client-side and server-side metrics

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/csrf` | GET | Get CSRF token |
| `/api/auth/callback/credentials` | POST | User login |
| `/api/auth/session` | GET | Validate session |
| `/api/auth/signout` | POST | User logout |
| `/api/book/event` | POST | Create booking |
| `/api/trpc/viewer.me` | GET | Get user profile |
| `/api/trpc/viewer.bookings.get` | GET | Get bookings |
| `/api/trpc/viewer.bookings.cancel` | POST | Cancel booking |
| `/api/trpc/viewer.eventTypes.list` | GET | List event types |
| `/api/trpc/viewer.eventTypes.create` | POST | Create event type |
| `/api/trpc/viewer.eventTypes.update` | POST | Update event type |
| `/api/trpc/viewer.eventTypes.delete` | POST | Delete event type |
| `/api/trpc/public.slots.getSchedule` | GET | Get available slots |

## Contributing

When adding new test scripts:

1. Follow the existing naming conventions
2. Include comprehensive transaction markers
3. Add proper error handling
4. Update this README with script documentation
5. Include sample parameter data

## License

This test suite is part of the Cal.com project.
