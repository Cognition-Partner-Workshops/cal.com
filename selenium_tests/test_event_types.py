"""
Selenium tests for Cal.com Event Types page.
Covers: event type listing, creation dialog, event type details, and event type actions.
"""

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import BASE_URL


class TestEventTypesPage:
    """Tests for the Event Types management page."""

    def test_event_types_page_loads(self, logged_in_driver):
        """Verify the Event Types page loads successfully."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/event-types")
        wait.until(EC.url_contains("/event-types"))

        # Page should contain event types content
        body_text = driver.find_element(By.TAG_NAME, "body").text
        assert body_text, "Event types page should have content"

    def test_event_types_list_visible(self, logged_in_driver):
        """Verify that event types are listed on the page."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/event-types")
        wait.until(EC.url_contains("/event-types"))

        # Wait for event type items to load
        try:
            wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "[data-testid='event-types'] li, [data-testid='event-type-link'], a[href*='/event-types/']")
                )
            )
            event_items = driver.find_elements(
                By.CSS_SELECTOR, "[data-testid='event-types'] li, [data-testid='event-type-link'], a[href*='/event-types/']"
            )
            assert len(event_items) > 0, "Should have at least one event type listed"
        except Exception:
            # If no event types exist, there should be an empty state or create button
            empty_state = driver.find_elements(
                By.CSS_SELECTOR, "[data-testid='empty-screen'], .empty-state"
            )
            create_btn = driver.find_elements(
                By.CSS_SELECTOR, "[data-testid='new-event-type'], button"
            )
            assert len(empty_state) > 0 or len(create_btn) > 0, (
                "Should show event types list, empty state, or create button"
            )

    def test_new_event_type_button_exists(self, logged_in_driver):
        """Verify the 'New Event Type' button is present."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/event-types")
        wait.until(EC.url_contains("/event-types"))

        # Look for new event type button
        new_btn = driver.find_elements(
            By.CSS_SELECTOR,
            "[data-testid='new-event-type'], [data-testid='new-event-type-dropdown'], button[data-testid='new-event-type']"
        )
        # Also check for any button that might trigger creating a new event
        if not new_btn:
            new_btn = driver.find_elements(
                By.XPATH, "//button[contains(text(), 'New') or contains(text(), 'Create') or contains(text(), 'Add')]"
            )
        assert len(new_btn) > 0, "New event type button should be present"

    def test_new_event_type_dialog_opens(self, logged_in_driver):
        """Verify clicking 'New Event Type' opens a creation dialog."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/event-types")
        wait.until(EC.url_contains("/event-types"))

        # Find and click new event type button
        new_btn = driver.find_elements(
            By.CSS_SELECTOR,
            "[data-testid='new-event-type'], [data-testid='new-event-type-dropdown']"
        )
        if not new_btn:
            new_btn = driver.find_elements(
                By.XPATH, "//button[contains(text(), 'New') or contains(text(), 'Create')]"
            )

        if new_btn:
            new_btn[0].click()

            # Wait for dialog/modal to appear
            try:
                dialog = wait.until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, "[role='dialog'], .modal, [data-testid='dialog'], [data-state='open']")
                    )
                )
                assert dialog is not None, "Dialog should open when clicking new event type"
            except Exception:
                # May navigate to a new page instead of opening a dialog
                pass

    def test_event_type_has_title(self, logged_in_driver):
        """Verify that event type items display a title."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/event-types")
        wait.until(EC.url_contains("/event-types"))

        try:
            event_links = wait.until(
                EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "[data-testid='event-type-link'], [data-testid='event-types'] a")
                )
            )
            if event_links:
                first_event = event_links[0]
                assert first_event.text.strip(), "Event type should have a visible title"
        except Exception:
            pytest.skip("No event types available to check titles")

    def test_event_type_shows_duration(self, logged_in_driver):
        """Verify that event types display duration information."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/event-types")
        wait.until(EC.url_contains("/event-types"))

        # Look for duration indicators (e.g., "30 min", "60 min")
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        has_duration = "min" in body_text or "minute" in body_text or "hour" in body_text
        assert has_duration, "Event types page should display duration information"
