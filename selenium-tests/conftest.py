"""
Pytest configuration and fixtures for Cal.com Selenium tests.
"""
import os
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options


# Chrome and ChromeDriver paths
CHROME_BINARY = "/opt/.devin/chrome/chrome/linux-137.0.7118.2/chrome-linux64/chrome"
CHROMEDRIVER_PATH = "/tmp/chromedriver-linux64/chromedriver"


@pytest.fixture(scope="session")
def base_url():
    """Base URL for the Cal.com application."""
    return os.environ.get("CAL_BASE_URL", "http://localhost:3000")


@pytest.fixture(scope="session")
def test_credentials():
    """Test user credentials for login."""
    return {
        "email": os.environ.get("CAL_TEST_EMAIL", "pro@example.com"),
        "password": os.environ.get("CAL_TEST_PASSWORD", "pro")
    }


@pytest.fixture(scope="function")
def driver():
    """Create and configure Chrome WebDriver instance."""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.binary_location = CHROME_BINARY
    
    service = Service(CHROMEDRIVER_PATH)
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.implicitly_wait(10)
    
    yield driver
    
    driver.quit()


@pytest.fixture(scope="function")
def logged_in_driver(driver, base_url, test_credentials):
    """Create a logged-in driver instance."""
    from pages.login_page import LoginPage
    
    login_page = LoginPage(driver, base_url)
    login_page.navigate()
    login_page.login(test_credentials["email"], test_credentials["password"])
    
    yield driver
