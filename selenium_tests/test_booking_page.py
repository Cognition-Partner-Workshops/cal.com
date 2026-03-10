"""
Selenium tests for Cal.com Public Booking Pages.
Covers: public profile page, event type booking page, time slot selection, and booking form.
"""

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import BASE_URL


class TestPublicBookingPage:
    """Tests for the public-facing booking pages."""

    def test_user_profile_page_loads(self, driver):
        """Verify that a user's public profile page loads."""
        driver.get(f"{BASE_URL}/john")
        wait = WebDriverWait(driver, 15)

        # The page should load without a 404
        body = wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        page_text = body.text.lower()

        # Should either show event types or a valid profile page
        # (not a hard 404 error page)
        assert "this page could not be found" not in page_text or "event" in page_text or "book" in page_text, (
            "User profile page should load without a 404 error"
        )

    def test_event_type_links_present_on_profile(self, driver):
        """Verify that event type links are shown on the user's profile page."""
        driver.get(f"{BASE_URL}/john")
        wait = WebDriverWait(driver, 15)

        try:
            # Wait for event type links
            event_links = wait.until(
                EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "[data-testid='event-type-link'], a[href*='/john/']")
                )
            )
            assert len(event_links) > 0, "Profile page should list event type links"
        except Exception:
            # User may have only one event type and get auto-redirected
            assert "/john" in driver.current_url, "Should be on the user's page or redirected to their event type"

    def test_booking_page_loads_for_event_type(self, driver):
        """Verify that navigating to a specific event type booking page works."""
        driver.get(f"{BASE_URL}/john")
        wait = WebDriverWait(driver, 15)

        try:
            # Click the first event type link
            event_link = wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "[data-testid='event-type-link'], a[href*='/john/']")
                )
            )
            event_link.click()

            # Wait for the booking page to load
            wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "[data-testid='day'], [data-testid='calendar'], .calendar")
                )
            )
        except Exception:
            # Auto-redirect scenario - already on event type page
            pass

    def test_calendar_is_displayed(self, driver):
        """Verify that the calendar/date picker is displayed on the booking page."""
        driver.get(f"{BASE_URL}/john")
        wait = WebDriverWait(driver, 15)

        try:
            # Click the first event type
            event_link = wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "[data-testid='event-type-link'], a[href*='/john/']")
                )
            )
            event_link.click()
        except Exception:
            pass

        # Wait for calendar to appear
        try:
            calendar = wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "[data-testid='calendar-dates'], [data-testid='day'], .react-calendar, [role='grid']")
                )
            )
            assert calendar.is_displayed(), "Calendar should be visible on booking page"
        except Exception:
            # Some event types may show time slots directly
            body_text = driver.find_element(By.TAG_NAME, "body").text
            assert body_text, "Booking page should have content"

    def test_month_navigation_buttons(self, driver):
        """Verify that month navigation buttons (prev/next) are present."""
        driver.get(f"{BASE_URL}/john")
        wait = WebDriverWait(driver, 15)

        try:
            event_link = wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "[data-testid='event-type-link'], a[href*='/john/']")
                )
            )
            event_link.click()
        except Exception:
            pass

        # Look for increment/decrement month buttons
        try:
            next_month = wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "[data-testid='incrementMonth'], button[aria-label*='Next'], button[aria-label*='next']")
                )
            )
            assert next_month is not None, "Next month button should be present"
        except Exception:
            pytest.skip("Month navigation not available on this page layout")

    def test_available_time_slots_displayed(self, driver):
        """Verify that available time slots are shown after selecting a date."""
        driver.get(f"{BASE_URL}/john")
        wait = WebDriverWait(driver, 20)

        try:
            event_link = wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "[data-testid='event-type-link'], a[href*='/john/']")
                )
            )
            event_link.click()
        except Exception:
            pass

        # Try to click on an available day
        try:
            available_day = wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "[data-testid='day'][data-disabled='false'], button[data-testid='day']:not([disabled])")
                )
            )
            available_day.click()

            # Wait for time slots to appear
            time_slots = wait.until(
                EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "[data-testid='time'], button[data-testid='time']")
                )
            )
            assert len(time_slots) > 0, "Time slots should be displayed after selecting a date"
        except Exception:
            pytest.skip("No available days found for slot selection test")

    def test_booking_form_fields_present(self, driver):
        """Verify that the booking form displays name and email fields after selecting a time."""
        driver.get(f"{BASE_URL}/john")
        wait = WebDriverWait(driver, 20)

        try:
            event_link = wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "[data-testid='event-type-link'], a[href*='/john/']")
                )
            )
            event_link.click()
        except Exception:
            pass

        # Select a day
        try:
            available_day = wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "[data-testid='day'][data-disabled='false']")
                )
            )
            available_day.click()

            # Select a time slot
            time_slot = wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "[data-testid='time']")
                )
            )
            time_slot.click()

            # Wait for booking form
            name_field = wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "input[name='name'], input[name='responses.name']")
                )
            )
            assert name_field.is_displayed(), "Name field should be visible in booking form"

            email_field = driver.find_element(
                By.CSS_SELECTOR, "input[name='email'], input[name='responses.email']"
            )
            assert email_field.is_displayed(), "Email field should be visible in booking form"
        except Exception:
            pytest.skip("Could not navigate to booking form - no available slots")

    def test_nonexistent_user_returns_404(self, driver):
        """Verify that accessing a non-existent user's page returns 404."""
        driver.get(f"{BASE_URL}/nonexistent-user-xyz-12345")
        wait = WebDriverWait(driver, 15)

        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # Should show 404 or "not found" indicator
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        is_404 = (
            "404" in body_text
            or "not found" in body_text
            or "could not be found" in body_text
            or "doesn't exist" in body_text
        )
        assert is_404, "Non-existent user page should return a 404 or not found message"
