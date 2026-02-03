"""
Test cases for Bookings page tab functionality.
Tests navigation between Upcoming, Unconfirmed, Recurring, Past, and Canceled tabs.
"""
import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pages.login_page import LoginPage
from pages.bookings_page import BookingsPage


class TestBookingsTabs:
    """Test class for Bookings tabs functionality."""
    
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
    
    def test_upcoming_tab_is_default(self):
        """Test that Upcoming tab is the default tab when navigating to bookings."""
        assert self.bookings_page.is_tab_active("upcoming"), \
            "Upcoming tab should be active by default"
        assert "/bookings/upcoming" in self.bookings_page.get_current_url(), \
            "URL should contain /bookings/upcoming"
    
    def test_click_unconfirmed_tab(self):
        """Test clicking on Unconfirmed tab navigates correctly."""
        self.bookings_page.click_unconfirmed_tab()
        
        assert self.bookings_page.is_tab_active("unconfirmed"), \
            "Unconfirmed tab should be active after clicking"
        assert "/bookings/unconfirmed" in self.bookings_page.get_current_url(), \
            "URL should contain /bookings/unconfirmed"
    
    def test_click_recurring_tab(self):
        """Test clicking on Recurring tab navigates correctly."""
        self.bookings_page.click_recurring_tab()
        
        assert self.bookings_page.is_tab_active("recurring"), \
            "Recurring tab should be active after clicking"
        assert "/bookings/recurring" in self.bookings_page.get_current_url(), \
            "URL should contain /bookings/recurring"
    
    def test_click_past_tab(self):
        """Test clicking on Past tab navigates correctly."""
        self.bookings_page.click_past_tab()
        
        assert self.bookings_page.is_tab_active("past"), \
            "Past tab should be active after clicking"
        assert "/bookings/past" in self.bookings_page.get_current_url(), \
            "URL should contain /bookings/past"
    
    def test_click_canceled_tab(self):
        """Test clicking on Canceled tab navigates correctly."""
        self.bookings_page.click_canceled_tab()
        
        assert self.bookings_page.is_tab_active("cancelled"), \
            "Canceled tab should be active after clicking"
        assert "/bookings/cancelled" in self.bookings_page.get_current_url(), \
            "URL should contain /bookings/cancelled"
    
    def test_tab_navigation_cycle(self):
        """Test navigating through all tabs in sequence."""
        # Start at Upcoming (default)
        assert self.bookings_page.is_tab_active("upcoming")
        
        # Navigate to Unconfirmed
        self.bookings_page.click_unconfirmed_tab()
        assert self.bookings_page.is_tab_active("unconfirmed")
        
        # Navigate to Recurring
        self.bookings_page.click_recurring_tab()
        assert self.bookings_page.is_tab_active("recurring")
        
        # Navigate to Past
        self.bookings_page.click_past_tab()
        assert self.bookings_page.is_tab_active("past")
        
        # Navigate to Canceled
        self.bookings_page.click_canceled_tab()
        assert self.bookings_page.is_tab_active("cancelled")
        
        # Navigate back to Upcoming
        self.bookings_page.click_upcoming_tab()
        assert self.bookings_page.is_tab_active("upcoming")
    
    def test_direct_url_navigation_upcoming(self):
        """Test direct URL navigation to Upcoming tab."""
        self.bookings_page.navigate("upcoming")
        assert self.bookings_page.is_tab_active("upcoming")
    
    def test_direct_url_navigation_unconfirmed(self):
        """Test direct URL navigation to Unconfirmed tab."""
        self.bookings_page.navigate("unconfirmed")
        assert self.bookings_page.is_tab_active("unconfirmed")
    
    def test_direct_url_navigation_recurring(self):
        """Test direct URL navigation to Recurring tab."""
        self.bookings_page.navigate("recurring")
        assert self.bookings_page.is_tab_active("recurring")
    
    def test_direct_url_navigation_past(self):
        """Test direct URL navigation to Past tab."""
        self.bookings_page.navigate("past")
        assert self.bookings_page.is_tab_active("past")
    
    def test_direct_url_navigation_cancelled(self):
        """Test direct URL navigation to Cancelled tab."""
        self.bookings_page.navigate("cancelled")
        assert self.bookings_page.is_tab_active("cancelled")
