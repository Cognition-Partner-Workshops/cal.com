package com.calcom.components;

import com.calcom.utils.ConfigReader;
import com.calcom.utils.DriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class NavigationComponent {
    private WebDriver driver;
    private WebDriverWait wait;

    private static final String TEAMS_NAV_LINK = "a[href*='/teams']";
    private static final String EVENT_TYPES_NAV_LINK = "a[href*='/event-types']";
    private static final String BOOKINGS_NAV_LINK = "a[href*='/bookings']";
    private static final String AVAILABILITY_NAV_LINK = "a[href*='/availability']";
    private static final String APPS_NAV_LINK = "a[href*='/apps']";

    public NavigationComponent() {
        this.driver = DriverManager.getDriver();
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(ConfigReader.getExplicitWait()));
    }

    public void clickTeamsLink() {
        WebElement teamsLink = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(TEAMS_NAV_LINK)));
        teamsLink.click();
        waitForPageLoad();
    }

    public void clickEventTypesLink() {
        WebElement eventTypesLink = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(EVENT_TYPES_NAV_LINK)));
        eventTypesLink.click();
        waitForPageLoad();
    }

    public void clickBookingsLink() {
        WebElement bookingsLink = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(BOOKINGS_NAV_LINK)));
        bookingsLink.click();
        waitForPageLoad();
    }

    public void clickAvailabilityLink() {
        WebElement availabilityLink = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(AVAILABILITY_NAV_LINK)));
        availabilityLink.click();
        waitForPageLoad();
    }

    public void clickAppsLink() {
        WebElement appsLink = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(APPS_NAV_LINK)));
        appsLink.click();
        waitForPageLoad();
    }

    public boolean isTeamsLinkDisplayed() {
        try {
            return driver.findElement(By.cssSelector(TEAMS_NAV_LINK)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isNavigationVisible() {
        try {
            return driver.findElement(By.cssSelector("nav")).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    private void waitForPageLoad() {
        wait.until(webDriver -> ((org.openqa.selenium.JavascriptExecutor) webDriver)
                .executeScript("return document.readyState").equals("complete"));
    }

    public void navigateToTeams() {
        driver.get(ConfigReader.getBaseUrl() + "/teams");
        waitForPageLoad();
    }
}
