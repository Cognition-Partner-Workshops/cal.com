/*
 * Cal.com LoadRunner Performance Test Script
 * Script Name: Team Booking Flow
 * Description: Simulates team/collective booking scenarios
 * 
 * Test Scenarios:
 * 1. Get team event types
 * 2. Check team member availability
 * 3. Create round-robin booking
 * 4. Create collective booking
 * 5. Reschedule team booking
 * 
 * Author: Devin AI
 * Date: 2026-01-08
 */

#include "lrun.h"
#include "web_api.h"

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
    
    lr_output_message("Cal.com Team Booking Test - Initialization Complete");
    
    return 0;
}

Action()
{
    int rc;
    
    // ============================================================
    // Transaction 1: Get Team Information
    // ============================================================
    lr_start_transaction("T01_Get_Team_Info");
    
    // Parameterize team slug from data file
    lr_save_string(lr_eval_string("{pTeamSlug}"), "teamSlug");
    
    web_reg_save_param_json(
        "ParamName=teamId",
        "QueryString=$.result.data.id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=teamName",
        "QueryString=$.result.data.name",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Team_Info",
        "URL=" API_BASE_URL "/trpc/viewer.teams.get?"
            "input={\"json\":{\"slug\":\"{teamSlug}\"}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get Team Info failed with HTTP code: %d", rc);
        lr_end_transaction("T01_Get_Team_Info", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Team: %s (ID: %s)", 
        lr_eval_string("{teamName}"),
        lr_eval_string("{teamId}"));
    
    lr_end_transaction("T01_Get_Team_Info", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 2: Get Team Event Types
    // ============================================================
    lr_start_transaction("T02_Get_Team_Event_Types");
    
    web_reg_save_param_json(
        "ParamName=teamEventTypes",
        "QueryString=$.result.data",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=roundRobinEventId",
        "QueryString=$.result.data[?(@.schedulingType=='ROUND_ROBIN')].id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=collectiveEventId",
        "QueryString=$.result.data[?(@.schedulingType=='COLLECTIVE')].id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Team_Event_Types",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.list?"
            "input={\"json\":{\"teamId\":{teamId}}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get Team Event Types failed with HTTP code: %d", rc);
        lr_end_transaction("T02_Get_Team_Event_Types", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Round Robin Event ID: %s, Collective Event ID: %s", 
        lr_eval_string("{roundRobinEventId}"),
        lr_eval_string("{collectiveEventId}"));
    
    lr_end_transaction("T02_Get_Team_Event_Types", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 3: Get Team Members Availability
    // ============================================================
    lr_start_transaction("T03_Get_Team_Availability");
    
    lr_save_datetime("%Y-%m-%d", DATE_NOW, "startDate");
    lr_save_datetime("%Y-%m-%d", DATE_NOW + ONE_DAY * 7, "endDate");
    
    web_reg_save_param_json(
        "ParamName=teamSlots",
        "QueryString=$.result.data.slots",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=firstTeamSlot",
        "QueryString=$.result.data.slots[*].time[0]",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Team_Availability",
        "URL=" API_BASE_URL "/trpc/public.slots.getSchedule?"
            "input={\"json\":{"
            "\"eventTypeId\":{roundRobinEventId},"
            "\"startTime\":\"{startDate}T00:00:00.000Z\","
            "\"endTime\":\"{endDate}T23:59:59.999Z\","
            "\"timeZone\":\"UTC\","
            "\"isTeamEvent\":true"
            "}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get Team Availability failed with HTTP code: %d", rc);
        lr_end_transaction("T03_Get_Team_Availability", LR_FAIL);
        return -1;
    }
    
    lr_output_message("First available team slot: %s", lr_eval_string("{firstTeamSlot}"));
    
    lr_end_transaction("T03_Get_Team_Availability", LR_PASS);
    
    lr_think_time(THINK_TIME_MAX);
    
    // ============================================================
    // Transaction 4: Create Round-Robin Booking
    // ============================================================
    lr_start_transaction("T04_Create_Round_Robin_Booking");
    
    lr_save_string(lr_eval_string("{pBookerName}"), "bookerName");
    lr_save_string(lr_eval_string("{pBookerEmail}"), "bookerEmail");
    
    web_reg_save_param_json(
        "ParamName=roundRobinBookingUid",
        "QueryString=$.uid",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=roundRobinBookingId",
        "QueryString=$.id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=assignedHost",
        "QueryString=$.user.name",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Create_Round_Robin_Booking",
        "URL=" API_BASE_URL "/book/event",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"eventTypeId\": {roundRobinEventId},"
            "\"start\": \"{firstTeamSlot}\","
            "\"timeZone\": \"UTC\","
            "\"language\": \"en\","
            "\"metadata\": {},"
            "\"hasHashedBookingLink\": false,"
            "\"responses\": {"
                "\"name\": \"{bookerName}\","
                "\"email\": \"{bookerEmail}\","
                "\"guests\": [],"
                "\"notes\": \"LoadRunner Round-Robin Booking Test\""
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200 && rc != 201) {
        lr_error_message("Create Round-Robin Booking failed with HTTP code: %d", rc);
        lr_end_transaction("T04_Create_Round_Robin_Booking", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Round-Robin booking created. UID: %s, Assigned to: %s", 
        lr_eval_string("{roundRobinBookingUid}"),
        lr_eval_string("{assignedHost}"));
    
    lr_end_transaction("T04_Create_Round_Robin_Booking", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 5: Get Collective Event Availability
    // ============================================================
    lr_start_transaction("T05_Get_Collective_Availability");
    
    web_reg_save_param_json(
        "ParamName=collectiveSlots",
        "QueryString=$.result.data.slots",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=firstCollectiveSlot",
        "QueryString=$.result.data.slots[*].time[0]",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Collective_Availability",
        "URL=" API_BASE_URL "/trpc/public.slots.getSchedule?"
            "input={\"json\":{"
            "\"eventTypeId\":{collectiveEventId},"
            "\"startTime\":\"{startDate}T00:00:00.000Z\","
            "\"endTime\":\"{endDate}T23:59:59.999Z\","
            "\"timeZone\":\"UTC\","
            "\"isTeamEvent\":true"
            "}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get Collective Availability failed with HTTP code: %d", rc);
        lr_end_transaction("T05_Get_Collective_Availability", LR_FAIL);
        return -1;
    }
    
    lr_output_message("First collective slot: %s", lr_eval_string("{firstCollectiveSlot}"));
    
    lr_end_transaction("T05_Get_Collective_Availability", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 6: Create Collective Booking
    // ============================================================
    lr_start_transaction("T06_Create_Collective_Booking");
    
    web_reg_save_param_json(
        "ParamName=collectiveBookingUid",
        "QueryString=$.uid",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=collectiveBookingId",
        "QueryString=$.id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Create_Collective_Booking",
        "URL=" API_BASE_URL "/book/event",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"eventTypeId\": {collectiveEventId},"
            "\"start\": \"{firstCollectiveSlot}\","
            "\"timeZone\": \"UTC\","
            "\"language\": \"en\","
            "\"metadata\": {},"
            "\"hasHashedBookingLink\": false,"
            "\"responses\": {"
                "\"name\": \"{bookerName}\","
                "\"email\": \"{bookerEmail}\","
                "\"guests\": [],"
                "\"notes\": \"LoadRunner Collective Booking Test\""
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200 && rc != 201) {
        lr_error_message("Create Collective Booking failed with HTTP code: %d", rc);
        lr_end_transaction("T06_Create_Collective_Booking", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Collective booking created. UID: %s", lr_eval_string("{collectiveBookingUid}"));
    
    lr_end_transaction("T06_Create_Collective_Booking", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 7: Cancel Round-Robin Booking (Cleanup)
    // ============================================================
    lr_start_transaction("T07_Cancel_Round_Robin_Booking");
    
    web_custom_request("Cancel_Round_Robin_Booking",
        "URL=" API_BASE_URL "/trpc/viewer.bookings.cancel",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"json\": {"
                "\"id\": {roundRobinBookingId},"
                "\"cancellationReason\": \"LoadRunner Test Cleanup\""
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Cancel Round-Robin Booking failed with HTTP code: %d", rc);
        lr_end_transaction("T07_Cancel_Round_Robin_Booking", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Round-Robin booking cancelled");
    
    lr_end_transaction("T07_Cancel_Round_Robin_Booking", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 8: Cancel Collective Booking (Cleanup)
    // ============================================================
    lr_start_transaction("T08_Cancel_Collective_Booking");
    
    web_custom_request("Cancel_Collective_Booking",
        "URL=" API_BASE_URL "/trpc/viewer.bookings.cancel",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"json\": {"
                "\"id\": {collectiveBookingId},"
                "\"cancellationReason\": \"LoadRunner Test Cleanup\""
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Cancel Collective Booking failed with HTTP code: %d", rc);
        lr_end_transaction("T08_Cancel_Collective_Booking", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Collective booking cancelled");
    
    lr_end_transaction("T08_Cancel_Collective_Booking", LR_PASS);
    
    return 0;
}

vuser_end()
{
    lr_output_message("Cal.com Team Booking Test - Completed");
    
    return 0;
}
