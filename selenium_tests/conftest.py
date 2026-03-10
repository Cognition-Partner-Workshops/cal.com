"""
Pytest configuration and shared fixtures for Cal.com Selenium tests.

Test credentials are loaded from environment variables or from
the TEST_CREDENTIALS.md file in the project root.
Set the following environment variables before running:
  TEST_USER_EMAIL    (default: reads from TEST_CREDENTIALS.md)
  TEST_USER_PASSWORD (default: reads from TEST_CREDENTIALS.md)
"""

import os
import re

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")


def _load_credentials_from_file():
    """Parse TEST_CREDENTIALS.md to extract test user credentials."""
    creds_path = os.path.join(
        os.path.dirname(__file__), "..", "TEST_CREDENTIALS.md"
    )
    users = {}
    if os.path.exists(creds_path):
        with open(creds_path, "r") as f:
            content = f.read()
        # Parse markdown table rows: | username | email | password | role |
        rows = re.findall(
            r"\|\s*(\w+)\s*\|\s*([\w@.]+)\s*\|\s*(\S+)\s*\|\s*(\w+)\s*\|",
            content,
        )
        for username, email, password, role in rows:
            if username.lower() not in ("username", "---"):
                users[username.lower()] = {
                    "email": email,
                    "password": password,
                    "role": role,
                }
    return users


def _get_test_users():
    """Get test users from env vars or from credentials file."""
    env_email = os.environ.get("TEST_USER_EMAIL")
    env_password = os.environ.get("TEST_USER_PASSWORD")
    if env_email and env_password:
        return {
            "default": {
                "email": env_email,
                "password": env_password,
                "role": "USER",
            },
        }
    return _load_credentials_from_file()


TEST_USERS = _get_test_users()


@pytest.fixture(scope="session")
def chrome_options():
    """Configure Chrome options for headless testing."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-infobars")
    return options


@pytest.fixture(scope="function")
def driver(chrome_options):
    """Create a new Chrome WebDriver instance for each test."""
    drv = webdriver.Chrome(options=chrome_options)
    drv.implicitly_wait(10)
    drv.set_page_load_timeout(30)
    yield drv
    drv.quit()


@pytest.fixture(scope="function")
def logged_in_driver(driver):
    """Return a driver that is already logged in as the first test user."""
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    user_key = next(iter(TEST_USERS))
    user = TEST_USERS[user_key]

    driver.get(f"{BASE_URL}/auth/login")
    wait = WebDriverWait(driver, 15)

    # Wait for login form
    email_input = wait.until(
        EC.presence_of_element_located(
            (By.CSS_SELECTOR, "input[name='email'], input[id='email']")
        )
    )
    email_input.clear()
    email_input.send_keys(user["email"])

    password_input = driver.find_element(
        By.CSS_SELECTOR, "input[name='password'], input[id='password']"
    )
    password_input.clear()
    password_input.send_keys(user["password"])

    # Submit the login form
    submit_button = driver.find_element(
        By.CSS_SELECTOR, "button[type='submit']"
    )
    submit_button.click()

    # Wait for redirect away from login page
    wait.until(lambda d: "/auth/login" not in d.current_url)

    yield driver
