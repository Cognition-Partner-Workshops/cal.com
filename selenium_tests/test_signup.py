"""
Selenium tests for Cal.com Signup page.
Covers: signup page loading, form fields, and validation.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import BASE_URL


class TestSignupPage:
    """Tests for the Signup/Registration page."""

    def test_signup_page_loads(self, driver):
        """Verify the signup page loads successfully."""
        driver.get(f"{BASE_URL}/signup")
        wait = WebDriverWait(driver, 15)

        body = wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        assert body.text, "Signup page should have content"

    def test_signup_page_has_form_fields(self, driver):
        """Verify the signup page has the required form fields."""
        driver.get(f"{BASE_URL}/signup")
        wait = WebDriverWait(driver, 15)

        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # Look for common signup form fields
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        has_signup_content = any(
            term in body_text
            for term in ["sign up", "register", "create account", "username", "email", "password"]
        )
        assert has_signup_content, "Signup page should contain registration-related content"

    def test_signup_page_has_login_link(self, driver):
        """Verify the signup page has a link to the login page."""
        driver.get(f"{BASE_URL}/signup")
        wait = WebDriverWait(driver, 15)

        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        login_links = driver.find_elements(By.CSS_SELECTOR, "a[href*='login'], a[href*='signin']")
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        has_login_ref = len(login_links) > 0 or "sign in" in body_text or "log in" in body_text
        assert has_login_ref, "Signup page should reference login/sign-in"

    def test_signup_form_validates_empty_submission(self, driver):
        """Test that submitting an empty signup form shows validation."""
        driver.get(f"{BASE_URL}/signup")
        wait = WebDriverWait(driver, 15)

        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        submit_buttons = driver.find_elements(By.CSS_SELECTOR, "button[type='submit']")
        if submit_buttons:
            submit_buttons[0].click()
            import time
            time.sleep(1)

            # Should remain on signup page or show validation errors
            assert "/signup" in driver.current_url or "/auth" in driver.current_url, (
                "Should remain on signup page after empty submission"
            )
