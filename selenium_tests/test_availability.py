"""
Selenium tests for Cal.com Availability page.
Covers: availability page loading, schedule display, and timezone settings.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import BASE_URL


class TestAvailabilityPage:
    """Tests for the Availability management page."""

    def test_availability_page_loads(self, logged_in_driver):
        """Verify the availability page loads successfully."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/availability")
        wait.until(EC.url_contains("/availability"))

        body = driver.find_element(By.TAG_NAME, "body")
        assert body.text, "Availability page should have content"

    def test_availability_schedule_displayed(self, logged_in_driver):
        """Verify that a schedule or availability info is displayed."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/availability")
        wait.until(EC.url_contains("/availability"))

        # Look for schedule-related content
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        has_schedule_content = any(
            term in body_text
            for term in ["schedule", "availability", "hours", "time", "working"]
        )
        assert has_schedule_content, "Availability page should display schedule-related content"

    def test_availability_has_timezone_selector(self, logged_in_driver):
        """Verify the timezone selector is present on the availability page."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/availability")
        wait.until(EC.url_contains("/availability"))

        # Look for timezone-related elements
        timezone_elements = driver.find_elements(
            By.CSS_SELECTOR,
            "[data-testid='timezone-select'], [data-testid='timezone'], select[name*='timezone'], button[data-testid*='timezone']"
        )
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        has_timezone = len(timezone_elements) > 0 or "timezone" in body_text or "time zone" in body_text

        assert has_timezone, "Availability page should have timezone information or selector"

    def test_availability_shows_weekday_schedule(self, logged_in_driver):
        """Verify that weekday names are displayed in the availability schedule."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/availability")
        wait.until(EC.url_contains("/availability"))

        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        weekdays = [
            "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
            "mon", "tue", "wed", "thu", "fri", "sat", "sun",
        ]
        found_days = [day for day in weekdays if day in body_text]
        assert len(found_days) > 0, "Availability page should display weekday names"

    def test_availability_page_not_accessible_unauthenticated(self, driver):
        """Verify that unauthenticated users cannot access the availability page."""
        driver.get(f"{BASE_URL}/availability")
        wait = WebDriverWait(driver, 15)

        wait.until(
            lambda d: "/auth/login" in d.current_url or "/auth" in d.current_url
        )
        assert "/auth" in driver.current_url, \
            "Unauthenticated users should be redirected to login"
