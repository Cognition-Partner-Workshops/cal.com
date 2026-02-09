import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class SampleSeleniumTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        cls.driver = webdriver.Chrome(options=options)
        cls.driver.implicitly_wait(10)
        cls.base_url = "http://localhost:3000"

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_homepage_loads(self):
        self.driver.get(self.base_url)
        WebDriverWait(self.driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        self.assertIn("Cal.com", self.driver.title)

    def test_login_page_accessible(self):
        self.driver.get(f"{self.base_url}/auth/login")
        WebDriverWait(self.driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "form"))
        )
        email_field = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        self.assertTrue(email_field.is_displayed())

    def test_signup_page_accessible(self):
        self.driver.get(f"{self.base_url}/signup")
        WebDriverWait(self.driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        self.assertEqual(self.driver.current_url, f"{self.base_url}/signup")

    def test_navigation_links_present(self):
        self.driver.get(self.base_url)
        WebDriverWait(self.driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "nav"))
        )
        nav = self.driver.find_element(By.TAG_NAME, "nav")
        links = nav.find_elements(By.TAG_NAME, "a")
        self.assertGreater(len(links), 0, "Navigation should contain at least one link")

    def test_page_has_no_console_errors(self):
        self.driver.get(self.base_url)
        logs = self.driver.get_log("browser")
        severe_logs = [log for log in logs if log["level"] == "SEVERE"]
        self.assertEqual(len(severe_logs), 0, f"Page has console errors: {severe_logs}")


if __name__ == "__main__":
    unittest.main()
