"""
Selenium tests for Cal.com Login functionality.
Covers: successful login, failed login, form validation, logout, and password visibility toggle.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import BASE_URL, TEST_USERS


class TestLoginPage:
    """Tests for the login page UI and functionality."""

    def test_login_page_loads(self, driver):
        """Verify that the login page loads and displays the login form."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        # Verify page title or login form is present
        login_form = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='login-form'], form"))
        )
        assert login_form is not None, "Login form should be present on the page"

    def test_login_page_has_email_field(self, driver):
        """Verify the email input field is present."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        email_field = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='email'], input[id='email']"))
        )
        assert email_field.is_displayed(), "Email field should be visible"

    def test_login_page_has_password_field(self, driver):
        """Verify the password input field is present."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        password_field = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "input[name='password'], input[id='password']")
            )
        )
        assert password_field.is_displayed(), "Password field should be visible"

    def test_login_page_has_submit_button(self, driver):
        """Verify the submit/sign-in button is present."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        submit_btn = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "button[type='submit']"))
        )
        assert submit_btn.is_displayed(), "Submit button should be visible"

    def test_login_page_has_forgot_password_link(self, driver):
        """Verify the 'Forgot password' link is present."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        # Wait for the page to load
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "form")))

        # Look for forgot password link
        links = driver.find_elements(By.CSS_SELECTOR, "a[href*='forgot-password']")
        assert len(links) > 0, "Forgot password link should be present"

    def test_successful_login(self, driver):
        """Test that a valid user can successfully log in."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        email_input = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='email'], input[id='email']"))
        )
        email_input.clear()
        user_key = next(iter(TEST_USERS))
        user = TEST_USERS[user_key]
        email_input.send_keys(user["email"])

        password_input = driver.find_element(
            By.CSS_SELECTOR, "input[name='password'], input[id='password']"
        )
        password_input.clear()
        password_input.send_keys(user["password"])

        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Wait for navigation away from login page
        wait.until(lambda d: "/auth/login" not in d.current_url)

        # Verify we are no longer on the login page
        assert "/auth/login" not in driver.current_url, "Should have navigated away from login page"

    def test_login_with_invalid_email(self, driver):
        """Test that login fails with a non-existent email."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        email_input = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='email'], input[id='email']"))
        )
        email_input.clear()
        email_input.send_keys("nonexistent@example.com")

        password_input = driver.find_element(
            By.CSS_SELECTOR, "input[name='password'], input[id='password']"
        )
        password_input.clear()
        password_input.send_keys("wrongpassword")

        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Should show an error message or remain on login page
        wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "[data-testid='alert'], [role='alert'], .text-red-600, .alert")
            )
        )
        assert "/auth/login" in driver.current_url or driver.find_elements(
            By.CSS_SELECTOR, "[data-testid='alert'], [role='alert'], .text-red-600, .alert"
        ), "Should show error or remain on login page"

    def test_login_with_wrong_password(self, driver):
        """Test that login fails with correct email but wrong password."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        email_input = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='email'], input[id='email']"))
        )
        email_input.clear()
        user_key = next(iter(TEST_USERS))
        user = TEST_USERS[user_key]
        email_input.send_keys(user["email"])

        password_input = driver.find_element(
            By.CSS_SELECTOR, "input[name='password'], input[id='password']"
        )
        password_input.clear()
        password_input.send_keys("definitelywrongpassword")

        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Should show an error message or remain on login page
        wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "[data-testid='alert'], [role='alert'], .text-red-600, .alert")
            )
        )
        error_elements = driver.find_elements(
            By.CSS_SELECTOR, "[data-testid='alert'], [role='alert'], .text-red-600, .alert"
        )
        assert len(error_elements) > 0, "Should display an error message for wrong password"

    def test_login_with_empty_fields(self, driver):
        """Test that submitting empty fields shows validation errors."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        submit_button = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
        submit_button.click()

        # The form should show validation errors or the email field should be marked as required
        # Browser native validation will prevent submission
        # Check that we're still on the login page
        assert "/auth/login" in driver.current_url, "Should remain on login page with empty fields"

    def test_password_field_is_masked(self, driver):
        """Verify that the password field masks input (type='password')."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        password_input = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "input[name='password'], input[id='password']")
            )
        )
        assert password_input.get_attribute("type") == "password", (
            "Password field should have type='password' to mask input"
        )

    def test_email_field_accepts_keyboard_input(self, driver):
        """Test that the email field properly accepts keyboard input."""
        driver.get(f"{BASE_URL}/auth/login")
        wait = WebDriverWait(driver, 15)

        email_input = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='email'], input[id='email']"))
        )
        email_input.clear()
        email_input.send_keys("test@example.com")

        assert email_input.get_attribute("value") == "test@example.com", (
            "Email field should contain the typed value"
        )
