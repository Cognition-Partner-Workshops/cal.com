/*
 * Cal.com LoadRunner Performance Test Script
 * Script Name: Event Type Management Flow
 * Description: Simulates event type CRUD operations
 * 
 * Test Scenarios:
 * 1. List all event types
 * 2. Create new event type
 * 3. Update event type settings
 * 4. Duplicate event type
 * 5. Delete event type
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
    
    lr_output_message("Cal.com Event Type Management Test - Initialization Complete");
    
    return 0;
}

Action()
{
    int rc;
    char uniqueSlug[100];
    
    // Generate unique slug for this iteration
    sprintf(uniqueSlug, "perf-test-%d-%d", lr_get_vuser_id(), lr_get_iteration_num());
    lr_save_string(uniqueSlug, "uniqueSlug");
    
    // ============================================================
    // Transaction 1: List All Event Types
    // ============================================================
    lr_start_transaction("T01_List_Event_Types");
    
    web_reg_save_param_json(
        "ParamName=eventTypesList",
        "QueryString=$.result.data",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=eventTypesCount",
        "QueryString=$.result.data.length",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("List_Event_Types",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.list",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("List Event Types failed with HTTP code: %d", rc);
        lr_end_transaction("T01_List_Event_Types", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Found %s event types", lr_eval_string("{eventTypesCount}"));
    
    lr_end_transaction("T01_List_Event_Types", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 2: Create New Event Type
    // ============================================================
    lr_start_transaction("T02_Create_Event_Type");
    
    web_reg_save_param_json(
        "ParamName=newEventTypeId",
        "QueryString=$.result.data.id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=newEventTypeSlug",
        "QueryString=$.result.data.slug",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Create_Event_Type",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.create",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"json\": {"
                "\"title\": \"Performance Test Meeting - {uniqueSlug}\","
                "\"slug\": \"{uniqueSlug}\","
                "\"length\": 30,"
                "\"description\": \"Auto-generated event type for LoadRunner performance testing\","
                "\"locations\": ["
                    "{"
                        "\"type\": \"integrations:google:meet\""
                    "}"
                "],"
                "\"schedulingType\": null,"
                "\"metadata\": {}"
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200 && rc != 201) {
        lr_error_message("Create Event Type failed with HTTP code: %d", rc);
        lr_end_transaction("T02_Create_Event_Type", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Created event type ID: %s, Slug: %s", 
        lr_eval_string("{newEventTypeId}"),
        lr_eval_string("{newEventTypeSlug}"));
    
    lr_end_transaction("T02_Create_Event_Type", LR_PASS);
    
    lr_think_time(THINK_TIME_MAX);
    
    // ============================================================
    // Transaction 3: Get Event Type Details
    // ============================================================
    lr_start_transaction("T03_Get_Event_Type_Details");
    
    web_reg_save_param_json(
        "ParamName=eventTypeTitle",
        "QueryString=$.result.data.title",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=eventTypeLength",
        "QueryString=$.result.data.length",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Event_Type_Details",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.get?"
            "input={\"json\":{\"id\":{newEventTypeId}}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get Event Type Details failed with HTTP code: %d", rc);
        lr_end_transaction("T03_Get_Event_Type_Details", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Event Type: %s (Duration: %s min)", 
        lr_eval_string("{eventTypeTitle}"),
        lr_eval_string("{eventTypeLength}"));
    
    lr_end_transaction("T03_Get_Event_Type_Details", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 4: Update Event Type
    // ============================================================
    lr_start_transaction("T04_Update_Event_Type");
    
    web_custom_request("Update_Event_Type",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.update",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"json\": {"
                "\"id\": {newEventTypeId},"
                "\"title\": \"Updated Performance Test Meeting - {uniqueSlug}\","
                "\"length\": 45,"
                "\"description\": \"Updated description for LoadRunner performance testing\","
                "\"hidden\": false,"
                "\"requiresConfirmation\": false,"
                "\"disableGuests\": false,"
                "\"hideCalendarNotes\": false,"
                "\"minimumBookingNotice\": 120,"
                "\"beforeEventBuffer\": 0,"
                "\"afterEventBuffer\": 0,"
                "\"slotInterval\": null,"
                "\"successRedirectUrl\": null"
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Update Event Type failed with HTTP code: %d", rc);
        lr_end_transaction("T04_Update_Event_Type", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Event type updated successfully");
    
    lr_end_transaction("T04_Update_Event_Type", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 5: Update Event Type Availability
    // ============================================================
    lr_start_transaction("T05_Update_Availability");
    
    web_custom_request("Update_Event_Type_Availability",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.update",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"json\": {"
                "\"id\": {newEventTypeId},"
                "\"availability\": ["
                    "{"
                        "\"days\": [1, 2, 3, 4, 5],"
                        "\"startTime\": \"09:00\","
                        "\"endTime\": \"17:00\""
                    "}"
                "]"
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Update Availability failed with HTTP code: %d", rc);
        lr_end_transaction("T05_Update_Availability", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Event type availability updated");
    
    lr_end_transaction("T05_Update_Availability", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 6: Duplicate Event Type
    // ============================================================
    lr_start_transaction("T06_Duplicate_Event_Type");
    
    web_reg_save_param_json(
        "ParamName=duplicatedEventTypeId",
        "QueryString=$.result.data.id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Duplicate_Event_Type",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.duplicate",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"json\": {"
                "\"id\": {newEventTypeId}"
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200 && rc != 201) {
        lr_error_message("Duplicate Event Type failed with HTTP code: %d", rc);
        lr_end_transaction("T06_Duplicate_Event_Type", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Duplicated event type ID: %s", lr_eval_string("{duplicatedEventTypeId}"));
    
    lr_end_transaction("T06_Duplicate_Event_Type", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 7: Delete Duplicated Event Type
    // ============================================================
    lr_start_transaction("T07_Delete_Duplicated_Event_Type");
    
    web_custom_request("Delete_Duplicated_Event_Type",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.delete",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"json\": {"
                "\"id\": {duplicatedEventTypeId}"
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Delete Duplicated Event Type failed with HTTP code: %d", rc);
        lr_end_transaction("T07_Delete_Duplicated_Event_Type", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Duplicated event type deleted");
    
    lr_end_transaction("T07_Delete_Duplicated_Event_Type", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 8: Delete Original Event Type (Cleanup)
    // ============================================================
    lr_start_transaction("T08_Delete_Original_Event_Type");
    
    web_custom_request("Delete_Original_Event_Type",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.delete",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"json\": {"
                "\"id\": {newEventTypeId}"
            "}"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Delete Original Event Type failed with HTTP code: %d", rc);
        lr_end_transaction("T08_Delete_Original_Event_Type", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Original event type deleted - cleanup complete");
    
    lr_end_transaction("T08_Delete_Original_Event_Type", LR_PASS);
    
    return 0;
}

vuser_end()
{
    lr_output_message("Cal.com Event Type Management Test - Completed");
    
    return 0;
}
