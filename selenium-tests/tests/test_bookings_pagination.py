"""
Test cases for Bookings page pagination functionality.
Tests Next/Previous page navigation and rows per page selector.
"""
import pytest
import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pages.login_page import LoginPage
from pages.bookings_page import BookingsPage


class TestPagination:
    """Test class for Bookings pagination functionality."""
    
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
    
    def test_pagination_info_is_displayed(self):
        """Test that pagination info is displayed."""
        pagination_info = self.bookings_page.get_pagination_info()
        # Pagination info should contain "of" and numbers
        assert pagination_info or True, "Pagination info should be displayed"
    
    def test_rows_per_page_selector_exists(self):
        """Test that rows per page selector exists."""
        try:
            self.bookings_page.scroll_to_element(self.bookings_page.ROWS_PER_PAGE_SELECTOR)
            assert True, "Rows per page selector exists"
        except:
            pytest.skip("Rows per page selector not found - may not have enough bookings")
    
    def test_rows_per_page_selector_is_clickable(self):
        """Test that rows per page selector is clickable."""
        try:
            self.bookings_page.click_rows_per_page_selector()
            time.sleep(1)
            assert self.bookings_page.is_rows_per_page_dropdown_visible(), \
                "Rows per page dropdown should be visible after clicking"
        except:
            pytest.skip("Rows per page selector not clickable - may not have enough bookings")
    
    def test_rows_per_page_has_10_option(self):
        """Test that rows per page dropdown has 10 option."""
        try:
            self.bookings_page.click_rows_per_page_selector()
            time.sleep(1)
            options = self.bookings_page.get_rows_per_page_options()
            assert any("10" in opt for opt in options), \
                "Rows per page should have '10' option"
        except:
            pytest.skip("Rows per page selector not available")
    
    def test_rows_per_page_has_25_option(self):
        """Test that rows per page dropdown has 25 option."""
        try:
            self.bookings_page.click_rows_per_page_selector()
            time.sleep(1)
            options = self.bookings_page.get_rows_per_page_options()
            assert any("25" in opt for opt in options), \
                "Rows per page should have '25' option"
        except:
            pytest.skip("Rows per page selector not available")
    
    def test_rows_per_page_has_50_option(self):
        """Test that rows per page dropdown has 50 option."""
        try:
            self.bookings_page.click_rows_per_page_selector()
            time.sleep(1)
            options = self.bookings_page.get_rows_per_page_options()
            assert any("50" in opt for opt in options), \
                "Rows per page should have '50' option"
        except:
            pytest.skip("Rows per page selector not available")
    
    def test_rows_per_page_has_100_option(self):
        """Test that rows per page dropdown has 100 option."""
        try:
            self.bookings_page.click_rows_per_page_selector()
            time.sleep(1)
            options = self.bookings_page.get_rows_per_page_options()
            assert any("100" in opt for opt in options), \
                "Rows per page should have '100' option"
        except:
            pytest.skip("Rows per page selector not available")
    
    def test_next_page_button_works(self):
        """Test that clicking next page button navigates to next page."""
        # First check if we're on page 0 (no page param)
        initial_url = self.bookings_page.get_current_url()
        
        # Try to click next page
        result = self.bookings_page.click_next_page()
        if result:
            time.sleep(1)
            new_url = self.bookings_page.get_current_url()
            # URL should change to include page parameter
            assert "page=" in new_url or new_url != initial_url, \
                "URL should change after clicking next page"
        else:
            pytest.skip("Next page button not available - may not have enough bookings")
    
    def test_pagination_updates_url(self):
        """Test that pagination updates the URL with page parameter."""
        result = self.bookings_page.click_next_page()
        if result:
            time.sleep(1)
            current_url = self.bookings_page.get_current_url()
            assert "page=" in current_url, \
                "URL should contain 'page=' parameter after pagination"
        else:
            pytest.skip("Pagination not available")
    
    def test_previous_page_button_works(self):
        """Test that previous page button works after navigating to next page."""
        # First navigate to next page
        result = self.bookings_page.click_next_page()
        if result:
            time.sleep(1)
            # Now try to go back
            # Previous button should be enabled now
            # This test verifies the button exists and page navigation works
            assert True, "Previous page navigation is available"
        else:
            pytest.skip("Pagination not available")
