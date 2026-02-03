"""
Login Page Object for Cal.com authentication.
"""
from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class LoginPage(BasePage):
    """Page Object for the Login page."""
    
    # Locators
    EMAIL_INPUT = (By.CSS_SELECTOR, "input[name='email']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[name='password']")
    LOGIN_BUTTON = (By.CSS_SELECTOR, "button[type='submit']")
    ERROR_MESSAGE = (By.CSS_SELECTOR, "[data-testid='alert-error']")
    
    def __init__(self, driver, base_url):
        super().__init__(driver, base_url)
        self.path = "/auth/login"
    
    def navigate(self):
        """Navigate to the login page."""
        super().navigate(self.path)
        self.wait_for_element(self.EMAIL_INPUT)
    
    def enter_email(self, email):
        """Enter email address."""
        self.type_text(self.EMAIL_INPUT, email)
    
    def enter_password(self, password):
        """Enter password."""
        self.type_text(self.PASSWORD_INPUT, password)
    
    def click_login(self):
        """Click the login button."""
        self.click_element(self.LOGIN_BUTTON)
    
    def login(self, email, password):
        """Perform complete login action."""
        self.enter_email(email)
        self.enter_password(password)
        self.click_login()
        self.wait_for_url_contains("/event-types")
    
    def is_error_displayed(self):
        """Check if login error is displayed."""
        return self.is_element_visible(self.ERROR_MESSAGE)
    
    def get_error_message(self):
        """Get the error message text."""
        return self.get_text(self.ERROR_MESSAGE)
