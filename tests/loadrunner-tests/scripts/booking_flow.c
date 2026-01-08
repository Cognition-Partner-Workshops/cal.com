/*
 * Cal.com LoadRunner Performance Test Script
 * Script Name: Booking Flow
 * Description: Simulates end-to-end booking creation flow
 * 
 * Test Scenarios:
 * 1. Get available slots for an event type
 * 2. Create a new booking
 * 3. Verify booking confirmation
 * 4. Cancel booking (cleanup)
 * 
 * Author: Devin AI
 * Date: 2026-01-08
 */

#include "lrun.h"
#include "web_api.h"

// Global variables for correlation
char *sessionToken;
char *bookingUid;
char *eventTypeSlug;
char *availableSlot;

// Configuration parameters
#define BASE_URL "http://localhost:3000"
#define API_BASE_URL "http://localhost:3000/api"
#define THINK_TIME_MIN 2
#define THINK_TIME_MAX 5

vuser_init()
{
    // Initialize web settings
    web_set_max_html_param_len("100000");
    web_set_timeout("CONNECT", "60");
    web_set_timeout("RECEIVE", "120");
    
    // Set content type for JSON APIs
    web_add_auto_header("Content-Type", "application/json");
    web_add_auto_header("Accept", "application/json");
    
    // Log initialization
    lr_output_message("Cal.com Booking Flow Test - Initialization Complete");
    lr_output_message("Base URL: %s", BASE_URL);
    
    return 0;
}

Action()
{
    int rc;
    
    // ============================================================
    // Transaction 1: User Authentication
    // ============================================================
    lr_start_transaction("T01_User_Login");
    
    // Parameterize user credentials
    lr_save_string(lr_eval_string("{pEmail}"), "userEmail");
    lr_save_string(lr_eval_string("{pPassword}"), "userPassword");
    
    web_custom_request("Login_Request",
        "URL=" API_BASE_URL "/auth/callback/credentials",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"email\": \"{userEmail}\","
            "\"password\": \"{userPassword}\","
            "\"csrfToken\": \"{csrfToken}\","
            "\"callbackUrl\": \"" BASE_URL "/\","
            "\"json\": true"
        "}",
        EXTRARES,
        LAST);
    
    // Correlate session token from response
    web_reg_save_param_json(
        "ParamName=sessionToken",
        "QueryString=$.session.token",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200 && rc != 302) {
        lr_error_message("Login failed with HTTP code: %d", rc);
        lr_end_transaction("T01_User_Login", LR_FAIL);
        return -1;
    }
    
    lr_end_transaction("T01_User_Login", LR_PASS);
    
    // Think time - simulate user reading the page
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 2: Get Event Types
    // ============================================================
    lr_start_transaction("T02_Get_Event_Types");
    
    web_reg_save_param_json(
        "ParamName=eventTypeId",
        "QueryString=$.result.data[0].id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=eventTypeSlug",
        "QueryString=$.result.data[0].slug",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=eventTypeDuration",
        "QueryString=$.result.data[0].length",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Event_Types",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.list",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get Event Types failed with HTTP code: %d", rc);
        lr_end_transaction("T02_Get_Event_Types", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Event Type ID: %s, Slug: %s", 
        lr_eval_string("{eventTypeId}"), 
        lr_eval_string("{eventTypeSlug}"));
    
    lr_end_transaction("T02_Get_Event_Types", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 3: Get Available Slots
    // ============================================================
    lr_start_transaction("T03_Get_Available_Slots");
    
    // Calculate date range for slot query (next 7 days)
    lr_save_datetime("%Y-%m-%d", DATE_NOW, "startDate");
    lr_save_datetime("%Y-%m-%d", DATE_NOW + ONE_DAY * 7, "endDate");
    
    web_reg_save_param_json(
        "ParamName=availableSlots",
        "QueryString=$.slots",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=firstSlotTime",
        "QueryString=$.slots[*].time[0]",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Available_Slots",
        "URL=" API_BASE_URL "/trpc/public.slots.getSchedule?"
            "input={\"json\":{\"eventTypeId\":{eventTypeId},"
            "\"startTime\":\"{startDate}T00:00:00.000Z\","
            "\"endTime\":\"{endDate}T23:59:59.999Z\","
            "\"timeZone\":\"UTC\"}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get Available Slots failed with HTTP code: %d", rc);
        lr_end_transaction("T03_Get_Available_Slots", LR_FAIL);
        return -1;
    }
    
    lr_output_message("First available slot: %s", lr_eval_string("{firstSlotTime}"));
    
    lr_end_transaction("T03_Get_Available_Slots", LR_PASS);
    
    lr_think_time(THINK_TIME_MAX);
    
    // ============================================================
    // Transaction 4: Create Booking
    // ============================================================
    lr_start_transaction("T04_Create_Booking");
    
    // Generate unique booking reference
    lr_save_string(lr_eval_string("{pBookerName}"), "bookerName");
    lr_save_string(lr_eval_string("{pBookerEmail}"), "bookerEmail");
    
    web_reg_save_param_json(
        "ParamName=bookingUid",
        "QueryString=$.uid",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=bookingId",
        "QueryString=$.id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Create_Booking",
        "URL=" API_BASE_URL "/book/event",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"eventTypeId\": {eventTypeId},"
            "\"start\": \"{firstSlotTime}\","
            "\"end\": \"{calculatedEndTime}\","
            "\"timeZone\": \"UTC\","
            "\"language\": \"en\","
            "\"metadata\": {},"
            "\"hasHashedBookingLink\": false,"
            "\"responses\": {"
                "\"name\": \"{bookerName}\","
                "\"email\": \"{bookerEmail}\","
                "\"guests\": [],"
                "\"notes\": \"LoadRunner Performance Test Booking\""
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200 && rc != 201) {
        lr_error_message("Create Booking failed with HTTP code: %d", rc);
        lr_end_transaction("T04_Create_Booking", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Booking created successfully. UID: %s", lr_eval_string("{bookingUid}"));
    
    lr_end_transaction("T04_Create_Booking", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 5: Verify Booking Details
    // ============================================================
    lr_start_transaction("T05_Verify_Booking");
    
    web_reg_save_param_json(
        "ParamName=bookingStatus",
        "QueryString=$.result.data.status",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Booking_Details",
        "URL=" API_BASE_URL "/trpc/viewer.bookings.get?"
            "input={\"json\":{\"filters\":{\"bookingUid\":\"{bookingUid}\"}}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Verify Booking failed with HTTP code: %d", rc);
        lr_end_transaction("T05_Verify_Booking", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Booking Status: %s", lr_eval_string("{bookingStatus}"));
    
    lr_end_transaction("T05_Verify_Booking", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 6: Cancel Booking (Cleanup)
    // ============================================================
    lr_start_transaction("T06_Cancel_Booking");
    
    web_custom_request("Cancel_Booking",
        "URL=" API_BASE_URL "/trpc/viewer.bookings.cancel",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"json\": {"
                "\"id\": {bookingId},"
                "\"cancellationReason\": \"LoadRunner Performance Test - Cleanup\""
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Cancel Booking failed with HTTP code: %d", rc);
        lr_end_transaction("T06_Cancel_Booking", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Booking cancelled successfully");
    
    lr_end_transaction("T06_Cancel_Booking", LR_PASS);
    
    return 0;
}

vuser_end()
{
    // Cleanup and logout
    lr_output_message("Cal.com Booking Flow Test - Completed");
    
    return 0;
}
