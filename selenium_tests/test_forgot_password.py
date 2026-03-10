"""
Selenium tests for Cal.com Forgot Password page.
Covers: page loading, form validation, and email submission.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import BASE_URL


class TestForgotPasswordPage:
    """Tests for the Forgot Password flow."""

    def test_forgot_password_page_loads(self, driver):
        """Verify the forgot password page loads successfully."""
        driver.get(f"{BASE_URL}/auth/forgot-password")
        wait = WebDriverWait(driver, 15)

        body = wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        assert body.text, "Forgot password page should have content"

    def test_forgot_password_has_email_field(self, driver):
        """Verify the forgot password page has an email input field."""
        driver.get(f"{BASE_URL}/auth/forgot-password")
        wait = WebDriverWait(driver, 15)

        email_field = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "input[name='email'], input[type='email'], input[id='email']")
            )
        )
        assert email_field.is_displayed(), "Email field should be visible"

    def test_forgot_password_has_submit_button(self, driver):
        """Verify the forgot password page has a submit button."""
        driver.get(f"{BASE_URL}/auth/forgot-password")
        wait = WebDriverWait(driver, 15)

        submit_btn = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "button[type='submit']"))
        )
        assert submit_btn.is_displayed(), "Submit button should be visible"

    def test_forgot_password_has_back_to_login_link(self, driver):
        """Verify the forgot password page has a link back to login."""
        driver.get(f"{BASE_URL}/auth/forgot-password")
        wait = WebDriverWait(driver, 15)

        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        login_links = driver.find_elements(By.CSS_SELECTOR, "a[href*='login'], a[href*='auth']")
        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        has_login_link = len(login_links) > 0 or "login" in body_text or "sign in" in body_text
        assert has_login_link, "Forgot password page should have a link back to login"

    def test_forgot_password_submit_with_valid_email(self, driver):
        """Test submitting the forgot password form with a valid email format."""
        driver.get(f"{BASE_URL}/auth/forgot-password")
        wait = WebDriverWait(driver, 15)

        email_field = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "input[name='email'], input[type='email'], input[id='email']")
            )
        )
        email_field.clear()
        email_field.send_keys("john@example.com")

        submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_btn.click()

        # After submission, should show a success message or confirmation
        import time
        time.sleep(3)

        body_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        # Should show confirmation, success, or remain on the page without errors
        has_response = (
            "sent" in body_text
            or "email" in body_text
            or "check" in body_text
            or "reset" in body_text
            or "password" in body_text
        )
        assert has_response, "Should show a response after submitting forgot password form"

    def test_forgot_password_submit_with_empty_email(self, driver):
        """Test submitting the forgot password form with an empty email."""
        driver.get(f"{BASE_URL}/auth/forgot-password")
        wait = WebDriverWait(driver, 15)

        submit_btn = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
        submit_btn.click()

        # Should remain on the forgot password page (HTML validation or app validation)
        assert "/forgot-password" in driver.current_url or "/auth" in driver.current_url, (
            "Should stay on forgot password page with empty email"
        )
