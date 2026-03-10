"""
Selenium tests for Cal.com Navigation and Dashboard.
Covers: main navigation links, sidebar, page routing, and dashboard elements.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import BASE_URL


class TestNavigation:
    """Tests for authenticated navigation and dashboard."""

    def test_dashboard_loads_after_login(self, logged_in_driver):
        """Verify that the dashboard/event-types page loads after login."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        # After login, user should be redirected to event-types or dashboard
        wait.until(
            lambda d: "/event-types" in d.current_url
            or "/getting-started" in d.current_url
            or "/bookings" in d.current_url
        )
        assert any(
            path in driver.current_url
            for path in ["/event-types", "/getting-started", "/bookings"]
        ), f"Should be on a main page after login, got: {driver.current_url}"

    def test_navigate_to_event_types(self, logged_in_driver):
        """Test navigation to the Event Types page."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/event-types")
        wait.until(EC.url_contains("/event-types"))

        assert "/event-types" in driver.current_url, "Should be on event types page"

    def test_navigate_to_bookings(self, logged_in_driver):
        """Test navigation to the Bookings page."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/bookings/upcoming")
        wait.until(EC.url_contains("/bookings"))

        assert "/bookings" in driver.current_url, "Should be on bookings page"

    def test_navigate_to_availability(self, logged_in_driver):
        """Test navigation to the Availability page."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/availability")
        wait.until(EC.url_contains("/availability"))

        assert "/availability" in driver.current_url, "Should be on availability page"

    def test_navigate_to_teams(self, logged_in_driver):
        """Test navigation to the Teams page."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/teams")
        wait.until(EC.url_contains("/teams"))

        assert "/teams" in driver.current_url, "Should be on teams page"

    def test_navigate_to_settings(self, logged_in_driver):
        """Test navigation to the Settings page."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/settings/my-account/profile")
        wait.until(EC.url_contains("/settings"))

        assert "/settings" in driver.current_url, "Should be on settings page"

    def test_sidebar_is_visible(self, logged_in_driver):
        """Verify the sidebar/navigation menu is visible on authenticated pages."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/event-types")
        wait.until(EC.url_contains("/event-types"))

        # Look for navigation elements (sidebar or nav)
        nav_elements = driver.find_elements(
            By.CSS_SELECTOR, "nav, [data-testid='navigation'], aside"
        )
        assert len(nav_elements) > 0, "Navigation/sidebar should be present on authenticated pages"

    def test_unauthenticated_redirect(self, driver):
        """Verify that unauthenticated access to protected pages redirects to login."""
        driver.get(f"{BASE_URL}/event-types")
        wait = WebDriverWait(driver, 15)

        # Should redirect to login
        wait.until(
            lambda d: "/auth/login" in d.current_url or "/auth" in d.current_url
        )
        assert "/auth" in driver.current_url, (
            "Unauthenticated users should be redirected to auth page"
        )

    def test_page_title_present(self, logged_in_driver):
        """Verify the page has a title."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/event-types")
        wait.until(EC.url_contains("/event-types"))

        assert driver.title, "Page should have a title"
