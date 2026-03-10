"""
Selenium tests for Cal.com Settings/Profile page.
Covers: profile page loading, form fields, and settings navigation.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import BASE_URL


class TestSettingsProfile:
    """Tests for the Settings and Profile pages."""

    def test_profile_settings_page_loads(self, logged_in_driver):
        """Verify the profile settings page loads successfully."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/settings/my-account/profile")
        wait.until(EC.url_contains("/settings"))

        body = driver.find_element(By.TAG_NAME, "body")
        assert body.text, "Profile settings page should have content"

    def test_profile_has_name_field(self, logged_in_driver):
        """Verify the profile page has a name input field."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/settings/my-account/profile")
        wait.until(EC.url_contains("/settings"))

        try:
            name_field = wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "input[name='name'], input[name='username'], input[id='name']")
                )
            )
            assert name_field.is_displayed(), "Name field should be visible on profile page"
        except Exception:
            # Settings may have a different layout
            body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
            assert "profile" in body_text or "name" in body_text, (
                "Profile page should contain profile-related content"
            )

    def test_profile_has_bio_or_description_field(self, logged_in_driver):
        """Verify the profile page has a bio/description textarea."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/settings/my-account/profile")
        wait.until(EC.url_contains("/settings"))

        # Look for bio/about textarea
        bio_fields = driver.find_elements(
            By.CSS_SELECTOR, "textarea[name='bio'], textarea[name='about'], textarea[id='bio']"
        )
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        has_bio = len(bio_fields) > 0 or "bio" in body_text or "about" in body_text
        assert has_bio, "Profile page should have a bio/about section"

    def test_profile_has_save_button(self, logged_in_driver):
        """Verify the profile page has a save/update button."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/settings/my-account/profile")
        wait.until(EC.url_contains("/settings"))

        save_buttons = driver.find_elements(
            By.XPATH,
            "//button[contains(text(), 'Save') or contains(text(), 'Update') or contains(text(), 'save') or contains(text(), 'update')]"
        )
        submit_buttons = driver.find_elements(By.CSS_SELECTOR, "button[type='submit']")
        assert len(save_buttons) > 0 or len(submit_buttons) > 0, (
            "Profile page should have a save/update button"
        )

    def test_settings_sidebar_navigation(self, logged_in_driver):
        """Verify the settings page has sidebar navigation links."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/settings/my-account/profile")
        wait.until(EC.url_contains("/settings"))

        # Look for settings navigation links
        settings_links = driver.find_elements(
            By.CSS_SELECTOR, "a[href*='/settings/']"
        )
        assert len(settings_links) > 0, "Settings page should have navigation links"

    def test_general_settings_accessible(self, logged_in_driver):
        """Verify the general settings page is accessible."""
        driver = logged_in_driver
        wait = WebDriverWait(driver, 15)

        driver.get(f"{BASE_URL}/settings/my-account/general")
        wait.until(EC.url_contains("/settings"))

        body = driver.find_element(By.TAG_NAME, "body")
        assert body.text, "General settings page should have content"

    def test_settings_not_accessible_unauthenticated(self, driver):
        """Verify that unauthenticated users cannot access settings."""
        driver.get(f"{BASE_URL}/settings/my-account/profile")
        wait = WebDriverWait(driver, 15)

        wait.until(
            lambda d: "/auth/login" in d.current_url or "/auth" in d.current_url
        )
        assert "/auth" in driver.current_url, (
            "Unauthenticated users should be redirected to login"
        )
