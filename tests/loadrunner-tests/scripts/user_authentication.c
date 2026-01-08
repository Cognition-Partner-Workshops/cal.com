/*
 * Cal.com LoadRunner Performance Test Script
 * Script Name: User Authentication Flow
 * Description: Simulates user authentication and session management
 * 
 * Test Scenarios:
 * 1. User login with credentials
 * 2. Session validation
 * 3. Get user profile
 * 4. Update user settings
 * 5. User logout
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
    
    lr_output_message("Cal.com User Authentication Test - Initialization Complete");
    
    return 0;
}

Action()
{
    int rc;
    
    // ============================================================
    // Transaction 1: Get CSRF Token
    // ============================================================
    lr_start_transaction("T01_Get_CSRF_Token");
    
    web_reg_save_param_regexp(
        "ParamName=csrfToken",
        "RegExp=csrfToken\":\"([^\"]+)\"",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_CSRF_Token",
        "URL=" API_BASE_URL "/auth/csrf",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get CSRF Token failed with HTTP code: %d", rc);
        lr_end_transaction("T01_Get_CSRF_Token", LR_FAIL);
        return -1;
    }
    
    lr_output_message("CSRF Token obtained: %s", lr_eval_string("{csrfToken}"));
    
    lr_end_transaction("T01_Get_CSRF_Token", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 2: User Login
    // ============================================================
    lr_start_transaction("T02_User_Login");
    
    // Parameterize user credentials from data file
    lr_save_string(lr_eval_string("{pEmail}"), "userEmail");
    lr_save_string(lr_eval_string("{pPassword}"), "userPassword");
    
    web_reg_save_param_json(
        "ParamName=sessionToken",
        "QueryString=$.session.token",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=userId",
        "QueryString=$.user.id",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
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
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200 && rc != 302) {
        lr_error_message("Login failed with HTTP code: %d", rc);
        lr_end_transaction("T02_User_Login", LR_FAIL);
        return -1;
    }
    
    lr_output_message("User logged in successfully. User ID: %s", lr_eval_string("{userId}"));
    
    lr_end_transaction("T02_User_Login", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 3: Validate Session
    // ============================================================
    lr_start_transaction("T03_Validate_Session");
    
    web_reg_save_param_json(
        "ParamName=sessionValid",
        "QueryString=$.user.email",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Validate_Session",
        "URL=" API_BASE_URL "/auth/session",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Session validation failed with HTTP code: %d", rc);
        lr_end_transaction("T03_Validate_Session", LR_FAIL);
        return -1;
    }
    
    lr_output_message("Session valid for user: %s", lr_eval_string("{sessionValid}"));
    
    lr_end_transaction("T03_Validate_Session", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 4: Get User Profile
    // ============================================================
    lr_start_transaction("T04_Get_User_Profile");
    
    web_reg_save_param_json(
        "ParamName=userName",
        "QueryString=$.result.data.name",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=userUsername",
        "QueryString=$.result.data.username",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=userTimezone",
        "QueryString=$.result.data.timeZone",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_User_Profile",
        "URL=" API_BASE_URL "/trpc/viewer.me",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get User Profile failed with HTTP code: %d", rc);
        lr_end_transaction("T04_Get_User_Profile", LR_FAIL);
        return -1;
    }
    
    lr_output_message("User Profile - Name: %s, Username: %s, Timezone: %s", 
        lr_eval_string("{userName}"),
        lr_eval_string("{userUsername}"),
        lr_eval_string("{userTimezone}"));
    
    lr_end_transaction("T04_Get_User_Profile", LR_PASS);
    
    lr_think_time(THINK_TIME_MAX);
    
    // ============================================================
    // Transaction 5: Get User Settings
    // ============================================================
    lr_start_transaction("T05_Get_User_Settings");
    
    web_reg_save_param_json(
        "ParamName=userLocale",
        "QueryString=$.result.data.locale",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_reg_save_param_json(
        "ParamName=userWeekStart",
        "QueryString=$.result.data.weekStart",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_User_Settings",
        "URL=" API_BASE_URL "/trpc/viewer.me",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get User Settings failed with HTTP code: %d", rc);
        lr_end_transaction("T05_Get_User_Settings", LR_FAIL);
        return -1;
    }
    
    lr_end_transaction("T05_Get_User_Settings", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 6: Get User Bookings
    // ============================================================
    lr_start_transaction("T06_Get_User_Bookings");
    
    web_reg_save_param_json(
        "ParamName=bookingsCount",
        "QueryString=$.result.data.totalCount",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_User_Bookings",
        "URL=" API_BASE_URL "/trpc/viewer.bookings.get?"
            "input={\"json\":{\"filters\":{\"status\":\"upcoming\"},\"limit\":10,\"offset\":0}}",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get User Bookings failed with HTTP code: %d", rc);
        lr_end_transaction("T06_Get_User_Bookings", LR_FAIL);
        return -1;
    }
    
    lr_output_message("User has %s upcoming bookings", lr_eval_string("{bookingsCount}"));
    
    lr_end_transaction("T06_Get_User_Bookings", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 7: Get User Event Types
    // ============================================================
    lr_start_transaction("T07_Get_User_Event_Types");
    
    web_reg_save_param_json(
        "ParamName=eventTypesCount",
        "QueryString=$.result.data.length",
        SEARCH_FILTERS,
        "Scope=Body",
        LAST);
    
    web_custom_request("Get_User_Event_Types",
        "URL=" API_BASE_URL "/trpc/viewer.eventTypes.list",
        "Method=GET",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200) {
        lr_error_message("Get User Event Types failed with HTTP code: %d", rc);
        lr_end_transaction("T07_Get_User_Event_Types", LR_FAIL);
        return -1;
    }
    
    lr_output_message("User has %s event types", lr_eval_string("{eventTypesCount}"));
    
    lr_end_transaction("T07_Get_User_Event_Types", LR_PASS);
    
    lr_think_time(THINK_TIME_MIN);
    
    // ============================================================
    // Transaction 8: User Logout
    // ============================================================
    lr_start_transaction("T08_User_Logout");
    
    web_custom_request("Logout_Request",
        "URL=" API_BASE_URL "/auth/signout",
        "Method=POST",
        "Resource=0",
        "RecContentType=application/json",
        "Mode=HTTP",
        "EncType=application/json",
        "Body={"
            "\"csrfToken\": \"{csrfToken}\","
            "\"callbackUrl\": \"" BASE_URL "/\","
            "\"json\": true"
        "}",
        EXTRARES,
        LAST);
    
    rc = web_get_int_property(HTTP_INFO_RETURN_CODE);
    if (rc != 200 && rc != 302) {
        lr_error_message("Logout failed with HTTP code: %d", rc);
        lr_end_transaction("T08_User_Logout", LR_FAIL);
        return -1;
    }
    
    lr_output_message("User logged out successfully");
    
    lr_end_transaction("T08_User_Logout", LR_PASS);
    
    return 0;
}

vuser_end()
{
    lr_output_message("Cal.com User Authentication Test - Completed");
    
    return 0;
}
