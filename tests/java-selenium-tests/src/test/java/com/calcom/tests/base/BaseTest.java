package com.calcom.tests.base;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.testng.annotations.*;

import java.time.Duration;

/**
 * Base test class for all Selenium tests.
 * Provides WebDriver setup and teardown functionality.
 */
public class BaseTest {

    protected WebDriver driver;
    protected static final String BASE_URL = "http://localhost:3000";
    protected static final int IMPLICIT_WAIT_SECONDS = 10;
    protected static final int PAGE_LOAD_TIMEOUT_SECONDS = 30;

    /**
     * Sets up the WebDriver before each test class.
     * Can be configured to use Chrome or Firefox via system property.
     */
    @BeforeClass
    @Parameters({"browser"})
    public void setUp(@Optional("chrome") String browser) {
        initializeDriver(browser);
        configureDriver();
    }

    /**
     * Initializes the WebDriver based on the specified browser.
     *
     * @param browser the browser to use (chrome or firefox)
     */
    private void initializeDriver(String browser) {
        switch (browser.toLowerCase()) {
            case "firefox":
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                firefoxOptions.addArguments("--headless");
                driver = new FirefoxDriver(firefoxOptions);
                break;
            case "chrome":
            default:
                WebDriverManager.chromedriver().setup();
                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.addArguments("--headless");
                chromeOptions.addArguments("--no-sandbox");
                chromeOptions.addArguments("--disable-dev-shm-usage");
                chromeOptions.addArguments("--disable-gpu");
                chromeOptions.addArguments("--window-size=1920,1080");
                driver = new ChromeDriver(chromeOptions);
                break;
        }
    }

    /**
     * Configures the WebDriver with timeouts and window settings.
     */
    private void configureDriver() {
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(IMPLICIT_WAIT_SECONDS));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(PAGE_LOAD_TIMEOUT_SECONDS));
        driver.manage().window().maximize();
    }

    /**
     * Tears down the WebDriver after each test class.
     */
    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    /**
     * Navigates to the specified URL.
     *
     * @param url the URL to navigate to
     */
    protected void navigateTo(String url) {
        driver.get(url);
    }

    /**
     * Navigates to a path relative to the base URL.
     *
     * @param path the path to navigate to
     */
    protected void navigateToPath(String path) {
        driver.get(BASE_URL + path);
    }

    /**
     * Gets the current page title.
     *
     * @return the page title
     */
    protected String getPageTitle() {
        return driver.getTitle();
    }

    /**
     * Gets the current URL.
     *
     * @return the current URL
     */
    protected String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    /**
     * Refreshes the current page.
     */
    protected void refreshPage() {
        driver.navigate().refresh();
    }

    /**
     * Navigates back in browser history.
     */
    protected void navigateBack() {
        driver.navigate().back();
    }

    /**
     * Navigates forward in browser history.
     */
    protected void navigateForward() {
        driver.navigate().forward();
    }
}
