"""
Base Page class with common methods for all page objects.
"""
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException


class BasePage:
    """Base class for all page objects."""
    
    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url
        self.timeout = 15
    
    def navigate(self, path=""):
        """Navigate to a specific path."""
        url = f"{self.base_url}{path}"
        self.driver.get(url)
    
    def wait_for_element(self, locator, timeout=None):
        """Wait for an element to be present and visible."""
        timeout = timeout or self.timeout
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located(locator)
        )
    
    def wait_for_element_clickable(self, locator, timeout=None):
        """Wait for an element to be clickable."""
        timeout = timeout or self.timeout
        return WebDriverWait(self.driver, timeout).until(
            EC.element_to_be_clickable(locator)
        )
    
    def wait_for_elements(self, locator, timeout=None):
        """Wait for multiple elements to be present."""
        timeout = timeout or self.timeout
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_all_elements_located(locator)
        )
    
    def click_element(self, locator):
        """Click on an element after waiting for it to be clickable."""
        element = self.wait_for_element_clickable(locator)
        element.click()
        return element
    
    def type_text(self, locator, text):
        """Type text into an input field."""
        element = self.wait_for_element(locator)
        element.clear()
        element.send_keys(text)
        return element
    
    def get_text(self, locator):
        """Get text from an element."""
        element = self.wait_for_element(locator)
        return element.text
    
    def is_element_visible(self, locator, timeout=5):
        """Check if an element is visible."""
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located(locator)
            )
            return True
        except TimeoutException:
            return False
    
    def is_element_present(self, locator, timeout=5):
        """Check if an element is present in the DOM."""
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located(locator)
            )
            return True
        except TimeoutException:
            return False
    
    def get_current_url(self):
        """Get the current URL."""
        return self.driver.current_url
    
    def wait_for_url_contains(self, text, timeout=None):
        """Wait for URL to contain specific text."""
        timeout = timeout or self.timeout
        return WebDriverWait(self.driver, timeout).until(
            EC.url_contains(text)
        )
    
    def get_element_attribute(self, locator, attribute):
        """Get an attribute value from an element."""
        element = self.wait_for_element(locator)
        return element.get_attribute(attribute)
    
    def scroll_to_element(self, locator):
        """Scroll to an element."""
        element = self.wait_for_element(locator)
        self.driver.execute_script("arguments[0].scrollIntoView(true);", element)
        return element
