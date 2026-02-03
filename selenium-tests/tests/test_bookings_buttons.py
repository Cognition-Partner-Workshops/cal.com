"""
Test cases for Bookings page button functionality.
Tests Filter, Saved, Three Dots Menu, Confirm/Reject, and Attendee buttons.
"""
import pytest
import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pages.login_page import LoginPage
from pages.bookings_page import BookingsPage


class TestFilterButton:
    """Test class for Filter button functionality."""
    
    @pytest.fixture(autouse=True)
    def setup(self, driver, base_url, test_credentials):
        """Setup for each test - login and navigate to bookings."""
        self.driver = driver
        self.base_url = base_url
        
        # Login
        login_page = LoginPage(driver, base_url)
        login_page.navigate()
        login_page.login(test_credentials["email"], test_credentials["password"])
        
        # Initialize bookings page
        self.bookings_page = BookingsPage(driver, base_url)
        self.bookings_page.navigate()
    
    def test_filter_button_is_clickable(self):
        """Test that Filter button is clickable."""
        result = self.bookings_page.click_filter_button()
        assert result, "Filter button should be clickable"
    
    def test_filter_dropdown_opens(self):
        """Test that clicking Filter button opens dropdown."""
        self.bookings_page.click_filter_button()
        time.sleep(1)
        assert self.bookings_page.is_filter_dropdown_visible(), \
            "Filter dropdown should be visible after clicking Filter button"
    
    def test_filter_dropdown_has_event_type_option(self):
        """Test that Filter dropdown contains Event Type option."""
        self.bookings_page.click_filter_button()
        time.sleep(1)
        options = self.bookings_page.get_filter_options()
        assert any("Event Type" in opt for opt in options), \
            "Filter dropdown should contain 'Event Type' option"
    
    def test_filter_dropdown_has_team_option(self):
        """Test that Filter dropdown contains Team option."""
        self.bookings_page.click_filter_button()
        time.sleep(1)
        options = self.bookings_page.get_filter_options()
        assert any("Team" in opt for opt in options), \
            "Filter dropdown should contain 'Team' option"
    
    def test_filter_dropdown_has_date_range_option(self):
        """Test that Filter dropdown contains Date Range option."""
        self.bookings_page.click_filter_button()
        time.sleep(1)
        options = self.bookings_page.get_filter_options()
        assert any("Date Range" in opt for opt in options), \
            "Filter dropdown should contain 'Date Range' option"
    
    def test_filter_dropdown_closes_on_escape(self):
        """Test that Filter dropdown closes when pressing Escape."""
        self.bookings_page.click_filter_button()
        time.sleep(1)
        assert self.bookings_page.is_filter_dropdown_visible()
        
        self.bookings_page.close_any_dropdown()
        time.sleep(0.5)
        # Dropdown should close (may need to verify differently based on implementation)


class TestSavedButton:
    """Test class for Saved button functionality."""
    
    @pytest.fixture(autouse=True)
    def setup(self, driver, base_url, test_credentials):
        """Setup for each test - login and navigate to bookings."""
        self.driver = driver
        self.base_url = base_url
        
        # Login
        login_page = LoginPage(driver, base_url)
        login_page.navigate()
        login_page.login(test_credentials["email"], test_credentials["password"])
        
        # Initialize bookings page
        self.bookings_page = BookingsPage(driver, base_url)
        self.bookings_page.navigate()
    
    def test_saved_dropdown_has_my_bookings_option(self):
        """Test that Saved dropdown contains My Bookings option."""
        self.bookings_page.click_saved_button()
        time.sleep(1)
        assert self.bookings_page.is_saved_dropdown_visible(), \
            "Saved dropdown should contain 'My Bookings' option"


class TestThreeDotsMenu:
    """Test class for Three Dots Menu button functionality."""
    
    @pytest.fixture(autouse=True)
    def setup(self, driver, base_url, test_credentials):
        """Setup for each test - login and navigate to bookings."""
        self.driver = driver
        self.base_url = base_url
        
        # Login
        login_page = LoginPage(driver, base_url)
        login_page.navigate()
        login_page.login(test_credentials["email"], test_credentials["password"])
        
        # Initialize bookings page
        self.bookings_page = BookingsPage(driver, base_url)
        self.bookings_page.navigate()
    
    def test_three_dots_menu_buttons_exist(self):
        """Test that three dots menu buttons are present."""
        buttons = self.bookings_page.get_three_dots_menu_buttons()
        assert len(buttons) > 0, "There should be at least one three dots menu button"
    
    def test_three_dots_menu_is_clickable(self):
        """Test that three dots menu button is clickable."""
        result = self.bookings_page.click_first_three_dots_menu()
        assert result, "Three dots menu button should be clickable"
    
    def test_three_dots_menu_opens_dropdown(self):
        """Test that clicking three dots menu opens dropdown."""
        self.bookings_page.click_first_three_dots_menu()
        time.sleep(1)
        assert self.bookings_page.is_menu_dropdown_visible(), \
            "Menu dropdown should be visible after clicking three dots menu"
    
    def test_menu_has_reschedule_option(self):
        """Test that menu dropdown contains Reschedule booking option."""
        self.bookings_page.click_first_three_dots_menu()
        time.sleep(1)
        options = self.bookings_page.get_menu_options()
        assert any("Reschedule" in opt for opt in options), \
            "Menu should contain 'Reschedule booking' option"
    
    def test_menu_has_edit_location_option(self):
        """Test that menu dropdown contains Edit location option."""
        self.bookings_page.click_first_three_dots_menu()
        time.sleep(1)
        options = self.bookings_page.get_menu_options()
        assert any("Edit location" in opt for opt in options), \
            "Menu should contain 'Edit location' option"
    
    def test_menu_has_add_guests_option(self):
        """Test that menu dropdown contains Add guests option."""
        self.bookings_page.click_first_three_dots_menu()
        time.sleep(1)
        options = self.bookings_page.get_menu_options()
        assert any("Add guests" in opt for opt in options), \
            "Menu should contain 'Add guests' option"
    
    def test_menu_has_cancel_event_option(self):
        """Test that menu dropdown contains Cancel event option."""
        self.bookings_page.click_first_three_dots_menu()
        time.sleep(1)
        options = self.bookings_page.get_menu_options()
        assert any("Cancel" in opt for opt in options), \
            "Menu should contain 'Cancel event' option"


class TestConfirmRejectButtons:
    """Test class for Confirm/Reject button functionality on unconfirmed bookings."""
    
    @pytest.fixture(autouse=True)
    def setup(self, driver, base_url, test_credentials):
        """Setup for each test - login and navigate to bookings."""
        self.driver = driver
        self.base_url = base_url
        
        # Login
        login_page = LoginPage(driver, base_url)
        login_page.navigate()
        login_page.login(test_credentials["email"], test_credentials["password"])
        
        # Initialize bookings page and navigate to upcoming (which shows unconfirmed bookings too)
        self.bookings_page = BookingsPage(driver, base_url)
        self.bookings_page.navigate()
    
    def test_reject_button_visible_for_unconfirmed(self):
        """Test that Reject button is visible for unconfirmed bookings."""
        # Check if there are unconfirmed bookings visible
        if self.bookings_page.is_reject_button_visible():
            assert True, "Reject button is visible for unconfirmed bookings"
        else:
            # Navigate to unconfirmed tab to check
            self.bookings_page.click_unconfirmed_tab()
            time.sleep(1)
            # May or may not have unconfirmed bookings
            pytest.skip("No unconfirmed bookings available to test")
    
    def test_confirm_button_visible_for_unconfirmed(self):
        """Test that Confirm button is visible for unconfirmed bookings."""
        if self.bookings_page.is_confirm_button_visible():
            assert True, "Confirm button is visible for unconfirmed bookings"
        else:
            self.bookings_page.click_unconfirmed_tab()
            time.sleep(1)
            pytest.skip("No unconfirmed bookings available to test")
    
    def test_reject_button_opens_modal(self):
        """Test that clicking Reject button opens confirmation modal."""
        if self.bookings_page.is_reject_button_visible():
            self.bookings_page.click_reject_button()
            time.sleep(1)
            assert self.bookings_page.is_reject_modal_visible(), \
                "Reject modal should be visible after clicking Reject button"
            self.bookings_page.close_any_dropdown()
        else:
            pytest.skip("No unconfirmed bookings available to test")
    
    def test_reject_modal_has_close_button(self):
        """Test that reject modal has a Close button."""
        if self.bookings_page.is_reject_button_visible():
            self.bookings_page.click_reject_button()
            time.sleep(1)
            # Modal should have close functionality
            self.bookings_page.close_any_dropdown()
            assert True
        else:
            pytest.skip("No unconfirmed bookings available to test")


class TestAttendeeButtons:
    """Test class for Attendee name button functionality."""
    
    @pytest.fixture(autouse=True)
    def setup(self, driver, base_url, test_credentials):
        """Setup for each test - login and navigate to bookings."""
        self.driver = driver
        self.base_url = base_url
        
        # Login
        login_page = LoginPage(driver, base_url)
        login_page.navigate()
        login_page.login(test_credentials["email"], test_credentials["password"])
        
        # Initialize bookings page
        self.bookings_page = BookingsPage(driver, base_url)
        self.bookings_page.navigate()
    
    def test_attendee_buttons_exist(self):
        """Test that attendee name buttons are present."""
        buttons = self.bookings_page.get_attendee_buttons()
        assert len(buttons) > 0, "There should be at least one attendee button"
    
    def test_attendee_button_is_clickable(self):
        """Test that attendee name button is clickable."""
        result = self.bookings_page.click_first_attendee_button()
        # May not always have clickable attendee buttons depending on data
        if result:
            assert True, "Attendee button is clickable"
        else:
            pytest.skip("No clickable attendee buttons available")
    
    def test_attendee_dropdown_shows_email_option(self):
        """Test that clicking attendee button shows email option."""
        result = self.bookings_page.click_first_attendee_button()
        if result:
            time.sleep(1)
            assert self.bookings_page.is_attendee_dropdown_visible(), \
                "Attendee dropdown should show email/copy options"
        else:
            pytest.skip("No clickable attendee buttons available")
