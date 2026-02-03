"""
Bookings Page Object for Cal.com Bookings section.
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pages.base_page import BasePage
import time


class BookingsPage(BasePage):
    """Page Object for the Bookings page."""
    
    # Tab Locators - Using normalize-space() for reliable text matching
    UPCOMING_TAB = (By.XPATH, "//main//button[normalize-space()='Upcoming']")
    UNCONFIRMED_TAB = (By.XPATH, "//main//button[normalize-space()='Unconfirmed']")
    RECURRING_TAB = (By.XPATH, "//main//button[normalize-space()='Recurring']")
    PAST_TAB = (By.XPATH, "//main//button[normalize-space()='Past']")
    CANCELED_TAB = (By.XPATH, "//main//button[normalize-space()='Canceled']")
    
    # Filter and Saved Button Locators
    FILTER_BUTTON = (By.XPATH, "//button[contains(@aria-expanded, 'false') or contains(@aria-expanded, 'true')][.//svg[@data-name='start-icon']][1]")
    SAVED_BUTTON = (By.XPATH, "//button[contains(text(), 'Saved') or .//svg[@data-name='start-icon']][2]")
    
    # Filter Dropdown Locators
    FILTER_DROPDOWN = (By.CSS_SELECTOR, "[role='listbox'], [role='menu']")
    FILTER_SEARCH_INPUT = (By.CSS_SELECTOR, "input[placeholder*='Search']")
    FILTER_EVENT_TYPE_OPTION = (By.XPATH, "//*[contains(text(), 'Event Type')]")
    FILTER_TEAM_OPTION = (By.XPATH, "//*[contains(text(), 'Team')]")
    FILTER_ATTENDEES_NAME_OPTION = (By.XPATH, "//*[contains(text(), 'Attendees Name')]")
    FILTER_ATTENDEE_EMAIL_OPTION = (By.XPATH, "//*[contains(text(), 'Attendee Email')]")
    FILTER_DATE_RANGE_OPTION = (By.XPATH, "//*[contains(text(), 'Date Range')]")
    FILTER_BOOKING_UID_OPTION = (By.XPATH, "//*[contains(text(), 'Booking UID')]")
    
    # Saved Dropdown Locators
    SAVED_DROPDOWN = (By.XPATH, "//div[contains(text(), 'Default') or contains(text(), 'My Bookings')]")
    MY_BOOKINGS_OPTION = (By.XPATH, "//*[contains(text(), 'My Bookings')]")
    
    # Booking List Locators
    BOOKING_ITEMS = (By.CSS_SELECTOR, "table tbody tr td")
    BOOKING_DATE_LINKS = (By.CSS_SELECTOR, "table tbody tr td a[href*='/booking/']")
    BOOKING_TITLE_LINKS = (By.CSS_SELECTOR, "table tbody tr td a[href*='/booking/']")
    
    # Three Dots Menu Locators
    THREE_DOTS_MENU_BUTTON = (By.CSS_SELECTOR, "button[aria-expanded][type='button'] svg[data-name='start-icon']")
    MENU_DROPDOWN = (By.CSS_SELECTOR, "div[tabindex='-1']")
    RESCHEDULE_OPTION = (By.XPATH, "//*[contains(text(), 'Reschedule booking')]")
    REQUEST_RESCHEDULE_OPTION = (By.XPATH, "//*[contains(text(), 'Request reschedule')]")
    EDIT_LOCATION_OPTION = (By.XPATH, "//*[contains(text(), 'Edit location')]")
    ADD_GUESTS_OPTION = (By.XPATH, "//*[contains(text(), 'Add guests')]")
    CANCEL_EVENT_OPTION = (By.XPATH, "//*[contains(text(), 'Cancel event')]")
    REPORT_BOOKING_OPTION = (By.XPATH, "//*[contains(text(), 'Report booking')]")
    
    # Confirm/Reject Button Locators (for unconfirmed bookings)
    REJECT_BUTTON = (By.XPATH, "//button[contains(text(), 'Reject')]")
    CONFIRM_BUTTON = (By.XPATH, "//button[contains(text(), 'Confirm')]")
    
    # Reject Modal Locators
    REJECT_MODAL = (By.XPATH, "//h2[contains(text(), 'Reject the booking request')]")
    REJECT_REASON_TEXTAREA = (By.CSS_SELECTOR, "textarea[name='rejectionReason']")
    REJECT_MODAL_CLOSE_BUTTON = (By.XPATH, "//button[contains(text(), 'Close')]")
    REJECT_MODAL_CONFIRM_BUTTON = (By.XPATH, "//button[contains(text(), 'Reject the booking')]")
    
    # Attendee Name Button Locators
    ATTENDEE_NAME_BUTTONS = (By.CSS_SELECTOR, "table tbody tr td button[aria-expanded]")
    ATTENDEE_EMAIL_LINK = (By.XPATH, "//a[contains(@href, 'mailto:')]")
    ATTENDEE_COPY_BUTTON = (By.XPATH, "//button[contains(text(), 'Copy')]")
    
    # Pagination Locators
    ROWS_PER_PAGE_SELECTOR = (By.CSS_SELECTOR, "input[aria-expanded][type='text']")
    ROWS_PER_PAGE_OPTIONS = (By.CSS_SELECTOR, "div[aria-selected]")
    PAGINATION_INFO = (By.XPATH, "//*[contains(text(), 'of 13') or contains(text(), 'rows per page')]")
    PREVIOUS_PAGE_BUTTON = (By.CSS_SELECTOR, "button[disabled] svg[data-name='start-icon']")
    NEXT_PAGE_BUTTON = (By.XPATH, "//button[not(@disabled)][.//svg[@data-name='start-icon']]")
    
    # Toast Notification
    TOAST_SUCCESS = (By.XPATH, "//*[contains(text(), 'succeeded') or contains(text(), 'success')]")
    
    def __init__(self, driver, base_url):
        super().__init__(driver, base_url)
        self.path = "/bookings/upcoming"
    
    def navigate(self, tab="upcoming"):
        """Navigate to the bookings page with specified tab."""
        super().navigate(f"/bookings/{tab}")
        time.sleep(2)  # Wait for page to load
    
    # Tab Methods
    def click_upcoming_tab(self):
        """Click the Upcoming tab."""
        self.click_element(self.UPCOMING_TAB)
        self.wait_for_url_contains("/bookings/upcoming")
    
    def click_unconfirmed_tab(self):
        """Click the Unconfirmed tab."""
        self.click_element(self.UNCONFIRMED_TAB)
        self.wait_for_url_contains("/bookings/unconfirmed")
    
    def click_recurring_tab(self):
        """Click the Recurring tab."""
        self.click_element(self.RECURRING_TAB)
        self.wait_for_url_contains("/bookings/recurring")
    
    def click_past_tab(self):
        """Click the Past tab."""
        self.click_element(self.PAST_TAB)
        self.wait_for_url_contains("/bookings/past")
    
    def click_canceled_tab(self):
        """Click the Canceled tab."""
        self.click_element(self.CANCELED_TAB)
        self.wait_for_url_contains("/bookings/cancelled")
    
    def is_tab_active(self, tab_name):
        """Check if a specific tab is active based on URL."""
        current_url = self.get_current_url()
        return f"/bookings/{tab_name}" in current_url
    
    # Filter Methods
    def click_filter_button(self):
        """Click the Filter button."""
        filter_buttons = self.driver.find_elements(By.CSS_SELECTOR, "button[aria-expanded]")
        for btn in filter_buttons:
            try:
                svg = btn.find_element(By.CSS_SELECTOR, "svg[data-name='start-icon']")
                if svg:
                    btn.click()
                    time.sleep(0.5)
                    return True
            except:
                continue
        return False
    
    def is_filter_dropdown_visible(self):
        """Check if filter dropdown is visible."""
        return self.is_element_visible(self.FILTER_EVENT_TYPE_OPTION, timeout=3)
    
    def get_filter_options(self):
        """Get list of filter options."""
        options = []
        option_locators = [
            self.FILTER_EVENT_TYPE_OPTION,
            self.FILTER_TEAM_OPTION,
            self.FILTER_ATTENDEES_NAME_OPTION,
            self.FILTER_ATTENDEE_EMAIL_OPTION,
            self.FILTER_DATE_RANGE_OPTION,
            self.FILTER_BOOKING_UID_OPTION
        ]
        for locator in option_locators:
            if self.is_element_visible(locator, timeout=2):
                options.append(self.get_text(locator))
        return options
    
    # Saved Button Methods
    def click_saved_button(self):
        """Click the Saved button."""
        saved_buttons = self.driver.find_elements(By.XPATH, "//button[.//svg]")
        for btn in saved_buttons:
            text = btn.text
            if "Saved" in text or btn.get_attribute("aria-expanded") is not None:
                try:
                    # Find the second button with svg (Saved button)
                    btn.click()
                    time.sleep(0.5)
                    return True
                except:
                    continue
        return False
    
    def is_saved_dropdown_visible(self):
        """Check if saved dropdown is visible."""
        return self.is_element_visible(self.MY_BOOKINGS_OPTION, timeout=3)
    
    # Booking Link Methods
    def get_booking_links(self):
        """Get all booking links on the page."""
        return self.driver.find_elements(*self.BOOKING_DATE_LINKS)
    
    def click_first_booking_link(self):
        """Click the first booking link."""
        links = self.get_booking_links()
        if links:
            links[0].click()
            self.wait_for_url_contains("/booking/")
            return True
        return False
    
    def is_on_booking_detail_page(self):
        """Check if currently on a booking detail page."""
        return "/booking/" in self.get_current_url()
    
    # Three Dots Menu Methods
    def get_three_dots_menu_buttons(self):
        """Get all three dots menu buttons."""
        return self.driver.find_elements(By.CSS_SELECTOR, "table tbody tr td button[aria-expanded='false']")
    
    def click_first_three_dots_menu(self):
        """Click the first three dots menu button."""
        buttons = self.get_three_dots_menu_buttons()
        for btn in buttons:
            try:
                svg = btn.find_element(By.CSS_SELECTOR, "svg[data-name='start-icon']")
                if svg:
                    btn.click()
                    time.sleep(0.5)
                    return True
            except:
                continue
        return False
    
    def is_menu_dropdown_visible(self):
        """Check if menu dropdown is visible."""
        return self.is_element_visible(self.RESCHEDULE_OPTION, timeout=3)
    
    def get_menu_options(self):
        """Get list of menu options."""
        options = []
        option_locators = [
            self.RESCHEDULE_OPTION,
            self.REQUEST_RESCHEDULE_OPTION,
            self.EDIT_LOCATION_OPTION,
            self.ADD_GUESTS_OPTION,
            self.CANCEL_EVENT_OPTION,
            self.REPORT_BOOKING_OPTION
        ]
        for locator in option_locators:
            if self.is_element_visible(locator, timeout=2):
                options.append(self.get_text(locator))
        return options
    
    # Confirm/Reject Methods
    def is_reject_button_visible(self):
        """Check if Reject button is visible."""
        return self.is_element_visible(self.REJECT_BUTTON, timeout=3)
    
    def is_confirm_button_visible(self):
        """Check if Confirm button is visible."""
        return self.is_element_visible(self.CONFIRM_BUTTON, timeout=3)
    
    def click_reject_button(self):
        """Click the Reject button."""
        self.click_element(self.REJECT_BUTTON)
    
    def click_confirm_button(self):
        """Click the Confirm button."""
        self.click_element(self.CONFIRM_BUTTON)
    
    def is_reject_modal_visible(self):
        """Check if reject modal is visible."""
        return self.is_element_visible(self.REJECT_MODAL, timeout=3)
    
    def close_reject_modal(self):
        """Close the reject modal."""
        self.click_element(self.REJECT_MODAL_CLOSE_BUTTON)
    
    # Attendee Methods
    def get_attendee_buttons(self):
        """Get all attendee name buttons."""
        return self.driver.find_elements(*self.ATTENDEE_NAME_BUTTONS)
    
    def click_first_attendee_button(self):
        """Click the first attendee name button."""
        buttons = self.get_attendee_buttons()
        for btn in buttons:
            text = btn.text
            if text and "@" not in text and "..." not in text:
                btn.click()
                time.sleep(0.5)
                return True
        return False
    
    def is_attendee_dropdown_visible(self):
        """Check if attendee dropdown is visible."""
        return self.is_element_visible(self.ATTENDEE_EMAIL_LINK, timeout=3) or \
               self.is_element_visible(self.ATTENDEE_COPY_BUTTON, timeout=3)
    
    # Pagination Methods
    def click_rows_per_page_selector(self):
        """Click the rows per page selector."""
        self.scroll_to_element(self.ROWS_PER_PAGE_SELECTOR)
        self.click_element(self.ROWS_PER_PAGE_SELECTOR)
    
    def is_rows_per_page_dropdown_visible(self):
        """Check if rows per page dropdown is visible."""
        return self.is_element_visible(self.ROWS_PER_PAGE_OPTIONS, timeout=3)
    
    def get_rows_per_page_options(self):
        """Get available rows per page options."""
        options = self.driver.find_elements(*self.ROWS_PER_PAGE_OPTIONS)
        return [opt.text for opt in options if opt.text]
    
    def click_next_page(self):
        """Click the next page button."""
        next_buttons = self.driver.find_elements(By.CSS_SELECTOR, "button:not([disabled])")
        for btn in next_buttons:
            try:
                svg = btn.find_element(By.CSS_SELECTOR, "svg[data-name='start-icon']")
                if svg and not btn.get_attribute("disabled"):
                    btn.click()
                    time.sleep(1)
                    return True
            except:
                continue
        return False
    
    def get_pagination_info(self):
        """Get pagination info text."""
        try:
            elements = self.driver.find_elements(By.XPATH, "//*[contains(text(), 'of')]")
            for el in elements:
                text = el.text
                if "of" in text and any(char.isdigit() for char in text):
                    return text
        except:
            pass
        return ""
    
    def is_on_page(self, page_num):
        """Check if on a specific page based on URL."""
        current_url = self.get_current_url()
        if page_num == 0:
            return "page=" not in current_url
        return f"page={page_num}" in current_url
    
    # Utility Methods
    def close_any_dropdown(self):
        """Close any open dropdown by pressing Escape."""
        from selenium.webdriver.common.keys import Keys
        self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        time.sleep(0.3)
    
    def is_toast_visible(self):
        """Check if success toast is visible."""
        return self.is_element_visible(self.TOAST_SUCCESS, timeout=5)
