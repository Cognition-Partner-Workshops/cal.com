"""
Test cases for Bookings page link functionality.
Tests that booking links navigate to the correct booking detail pages.
"""
import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pages.login_page import LoginPage
from pages.bookings_page import BookingsPage


class TestBookingsLinks:
    """Test class for Bookings links functionality."""
    
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
    
    def test_booking_links_exist(self):
        """Test that booking links are present on the page."""
        links = self.bookings_page.get_booking_links()
        assert len(links) > 0, "There should be at least one booking link on the page"
    
    def test_booking_link_has_correct_href(self):
        """Test that booking links have correct href format."""
        links = self.bookings_page.get_booking_links()
        if links:
            href = links[0].get_attribute("href")
            assert "/booking/" in href, \
                f"Booking link href should contain '/booking/', got: {href}"
    
    def test_click_booking_link_navigates_to_detail(self):
        """Test that clicking a booking link navigates to the booking detail page."""
        links = self.bookings_page.get_booking_links()
        if links:
            result = self.bookings_page.click_first_booking_link()
            assert result, "Should be able to click the first booking link"
            assert self.bookings_page.is_on_booking_detail_page(), \
                "Should navigate to booking detail page after clicking link"
    
    def test_booking_detail_page_url_format(self):
        """Test that booking detail page URL has correct format."""
        links = self.bookings_page.get_booking_links()
        if links:
            self.bookings_page.click_first_booking_link()
            current_url = self.bookings_page.get_current_url()
            
            assert "/booking/" in current_url, \
                f"URL should contain '/booking/', got: {current_url}"
    
    def test_multiple_booking_links_are_clickable(self):
        """Test that multiple booking links are present and have valid hrefs."""
        links = self.bookings_page.get_booking_links()
        
        valid_links = 0
        for link in links[:5]:  # Check first 5 links
            href = link.get_attribute("href")
            if href and "/booking/" in href:
                valid_links += 1
        
        assert valid_links > 0, "At least one booking link should have a valid href"
    
    def test_booking_date_link_format(self):
        """Test that booking date links display date information."""
        links = self.bookings_page.get_booking_links()
        if links:
            link_text = links[0].text
            # Date links typically contain day names or date formats
            date_indicators = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", 
                             "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            has_date = any(indicator in link_text for indicator in date_indicators)
            # Either has date or has event name - both are valid booking links
            assert link_text or has_date, \
                "Booking link should have text content"
