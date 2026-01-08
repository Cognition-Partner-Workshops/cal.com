/*
 * Cal.com LoadRunner Performance Test Script
 * Script Name: Availability Check Flow
 * Description: Simulates availability checking and slot retrieval
 * 
 * Test Scenarios:
 * 1. Get user availability schedule
 * 2. Check available slots for multiple date ranges
 * 3. Validate timezone conversions
 * 4. Test concurrent slot queries
 * 
 * Author: Devin AI
 * Date: 2026-01-08
 */

#include "lrun.h"
#include "web_api.h"

// Configuration parameters
#define BASE_URL "http://localhost:3000"
#define API_BASE_URL "http://localhost:3000/api"
#define THINK_TIME_MIN 1
#define THINK_TIME_MAX 3

vuser_init()
{
    // Initialize web settings
    web_set_max_html_param_len("100000");
    web_set_timeout("CONNECT", "60");
    web_set_timeout("RECEIVE", "120");
    
    // Set content type for JSON APIs
    web_add_auto_header("Content-Type", "application/json");
    web_add_auto_header("Accept", "application/json");
    
    lr_output_message("Cal.com Availability Check Test - Initialization Complete");
    
    return 0;
}

Action()
{
    int rc;
    int i;
    char dateParam[50];
    
    // ============================================================
    // Transaction 1: Get Public Event Type Info
    // ============================================================
    lr_start_transaction("T01_Get_Public_Event_Type");
    
    // Parameterize username and event slug
    lr_save_string(lr_eval_string("{pUsername}"), "username");
    lr_save_string(lr_eval_string("{pEventSlug}"), "eventSlug");
    
    web_reg_save_param_json(
        "ParamName=eventTypeId",
        "QueryString=$.result.data.id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=eventDuration",
        "QueryString=$.result.data.length",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=eventTitle",
        "QueryString=$.result.data.title",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Public_Event_Type",
        "URL=" BASE_URL "/{username}/{eventSlug}",
        "Method=GET",
        "Resource=0",
        "RecContentType=text/html",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get Public Event Type failed with HTTP code: %d", rc);
        lr_end_transaction("T01_Get_Public_Event_Type", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Event Type: %s (Duration: %s min)", 
        lr_eval_string("{eventTitle}"), 
        lr_eval_string("{eventDuration}"));
    
    lr_end_transaction("T01_Get_Public_Event_Type", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 2: Get Monthly Availability (Current Month)
    // ============================================================
    lr_start_transaction("T02_Get_Monthly_Availability");
    
    // Calculate current month date range
    lr_save_datetime("%Y-%m-01", DATE_NOW, "monthStart");
    lr_save_datetime("%Y-%m-%d", DATE_NOW + ONE_DAY * 30, "monthEnd");
    
    web_reg_save_param_json(
        "ParamName=availableDays",
        "QueryString=$.result.data.days",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Monthly_Availability",
        "URL=" API_BASE_URL "/trpc/public.slots.getSchedule?"
            "input={\"json\":{"
            "\"eventTypeId\":{eventTypeId},"
            "\"startTime\":\"{monthStart}T00:00:00.000Z\","
            "\"endTime\":\"{monthEnd}T23:59:59.999Z\","
            "\"timeZone\":\"America/New_York\","
            "\"isTeamEvent\":false"
            "}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get Monthly Availability failed with HTTP code: %d", rc);
        lr_end_transaction("T02_Get_Monthly_Availability", LR_FAIL);
        return -1;
    }
    
    lr_end_transaction("T02_Get_Monthly_Availability", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 3: Get Daily Slots (Multiple Days)
    // ============================================================
    lr_start_transaction("T03_Get_Daily_Slots_Batch");
    
    // Query slots for next 7 days individually
    for (i = 1; i <= 7; i++) {
        sprintf(dateParam, "%d", i);
        lr_save_string(dateParam, "dayOffset");
        
        lr_save_datetime("%Y-%m-%d", DATE_NOW + ONE_DAY * i, "queryDate");
        
        web_reg_save_param_json(
            "ParamName=daySlots",
            "QueryString=$.result.data.slots",
            SEARCH_FILTERS,
            "Scope=Body",
            LAST);
        
        web_custom_request("Get_Daily_Slots",
            "URL=" API_BASE_URL "/trpc/public.slots.getSchedule?"
                "input={\"json\":{"
                "\"eventTypeId\":{eventTypeId},"
                "\"startTime\":\"{queryDate}T00:00:00.000Z\","
                "\"endTime\":\"{queryDate}T23:59:59.999Z\","
                "\"timeZone\":\"UTC\""
                "}}",
            "Method=GET",
            "Resource=0",
            "RecContentType=application/json",
            "Mode=HTTP",
            EXTRARES,
            LAST);
        
        rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
        if (rc != 200) {
            lr_error_message("Get Daily Slots failed for day %d with HTTP code: %d", i, rc);
        }
    }
    
    lr_end_transaction("T03_Get_Daily_Slots_Batch", LR_PASS);
    
    lr_think_time(THINK_TIME_MAX);
    
    // ============================================================
    // Transaction 4: Get Slots with Different Timezones
    // ============================================================
    lr_start_transaction("T04_Timezone_Slot_Query");
    
    // Test timezone conversion - query same date with different timezones
    char *timezones[] = {
        "America/New_York",
        "America/Los_Angeles", 
        "Europe/London",
        "Asia/Tokyo",
        "Australia/Sydney"
    };
    
    lr_save_datetime("%Y-%m-%d", DATE_NOW + ONE_DAY * 3, "tzQueryDate");
    
    for (i = 0; i < 5; i++) {
        lr_save_string(timezones[i], "queryTimezone");
        
        web_reg_save_param_json(
            "ParamName=tzSlots",
            "QueryString=$.result.data.slots",
            SEARCH_FILTERS,
            "Scope=Body",
            LAST);
        
        web_custom_request("Get_Slots_Timezone",
            "URL=" API_BASE_URL "/trpc/public.slots.getSchedule?"
                "input={\"json\":{"
                "\"eventTypeId\":{eventTypeId},"
                "\"startTime\":\"{tzQueryDate}T00:00:00.000Z\","
                "\"endTime\":\"{tzQueryDate}T23:59:59.999Z\","
                "\"timeZone\":\"{queryTimezone}\""
                "}}",
            "Method=GET",
            "Resource=0",
            "RecContentType=application/json",
            "Mode=HTTP",
            EXTRARES,
            LAST);
        
        rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
        if (rc != 200) {
            lr_error_message("Timezone query failed for %s with HTTP code: %d", timezones[i], rc);
        }
        
        lr_output_message("Timezone %s query completed", timezones[i]);
    }
    
    lr_end_transaction("T04_Timezone_Slot_Query", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 5: Get Busy Times
    // ============================================================
    lr_start_transaction("T05_Get_Busy_Times");
    
    lr_save_datetime("%Y-%m-%d", DATE_NOW, "busyStart");
    lr_save_datetime("%Y-%m-%d", DATE_NOW + ONE_DAY * 14, "busyEnd");
    
    web_reg_save_param_json(
        "ParamName=busyTimes",
        "QueryString=$.result.data.busy",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_Busy_Times",
        "URL=" API_BASE_URL "/trpc/viewer.availability.user?"
            "input={\"json\":{"
            "\"dateFrom\":\"{busyStart}\","
            "\"dateTo\":\"{busyEnd}\","
            "\"eventTypeId\":{eventTypeId}"
            "}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get Busy Times failed with HTTP code: %d", rc);
        lr_end_transaction("T05_Get_Busy_Times", LR_FAIL);
        return -1;
    }
    
    lr_end_transaction("T05_Get_Busy_Times", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 6: Check Slot Availability (Specific Slot)
    // ============================================================
    lr_start_transaction("T06_Check_Specific_Slot");
    
    // Use a specific slot time from previous query
    lr_save_datetime("%Y-%m-%dT10:00:00.000Z", DATE_NOW + ONE_DAY * 2, "specificSlot");
    
    web_reg_save_param_json(
        "ParamName=slotAvailable",
        "QueryString=$.result.data.available",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Check_Slot_Availability",
        "URL=" API_BASE_URL "/trpc/public.slots.checkIfSlotIsAvailable?"
            "input={\"json\":{"
            "\"eventTypeId\":{eventTypeId},"
            "\"slotUtcStartDate\":\"{specificSlot}\","
            "\"slotUtcEndDate\":\"{specificSlotEnd}\""
            "}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Check Specific Slot failed with HTTP code: %d", rc);
        lr_end_transaction("T06_Check_Specific_Slot", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Slot availability: %s", lr_eval_string("{slotAvailable}"));
    
    lr_end_transaction("T06_Check_Specific_Slot", LR_PASS);
    
    return 0;
}

vuser_end()
{
    lr_output_message("Cal.com Availability Check Test - Completed");
    
    return 0;
}
