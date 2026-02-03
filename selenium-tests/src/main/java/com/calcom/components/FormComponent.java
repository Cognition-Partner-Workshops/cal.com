package com.calcom.components;

import com.calcom.utils.ConfigReader;
import com.calcom.utils.DriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class FormComponent {
    private WebDriver driver;
    private WebDriverWait wait;

    public FormComponent() {
        this.driver = DriverManager.getDriver();
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(ConfigReader.getExplicitWait()));
    }

    public void fillTextField(String fieldName, String value) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("input[name='" + fieldName + "']")));
        field.clear();
        field.sendKeys(value);
    }

    public void fillTextFieldById(String fieldId, String value) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(fieldId)));
        field.clear();
        field.sendKeys(value);
    }

    public void fillTextFieldByTestId(String testId, String value) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-testid='" + testId + "']")));
        field.clear();
        field.sendKeys(value);
    }

    public void clickButtonByTestId(String testId) {
        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("[data-testid='" + testId + "']")));
        button.click();
    }

    public void clickButtonByText(String buttonText) {
        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(text(), '" + buttonText + "')]")));
        button.click();
    }

    public void clickSubmitButton() {
        WebElement submitButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("button[type='submit']")));
        submitButton.click();
    }

    public String getFieldValue(String fieldName) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("input[name='" + fieldName + "']")));
        return field.getAttribute("value");
    }

    public String getFieldValueByTestId(String testId) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-testid='" + testId + "']")));
        return field.getAttribute("value");
    }

    public boolean isFieldDisplayed(String fieldName) {
        try {
            return driver.findElement(By.cssSelector("input[name='" + fieldName + "']")).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isFieldDisplayedByTestId(String testId) {
        try {
            return driver.findElement(By.cssSelector("[data-testid='" + testId + "']")).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isButtonDisplayedByTestId(String testId) {
        try {
            return driver.findElement(By.cssSelector("[data-testid='" + testId + "']")).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void clearField(String fieldName) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("input[name='" + fieldName + "']")));
        field.clear();
    }

    public void clearFieldByTestId(String testId) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-testid='" + testId + "']")));
        field.clear();
    }

    public void scrollToField(String fieldName) {
        WebElement field = driver.findElement(By.cssSelector("input[name='" + fieldName + "']"));
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].scrollIntoView(true);", field);
    }

    public boolean hasValidationError() {
        try {
            return driver.findElement(By.cssSelector("[role='alert'], .error, .text-red-500")).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getValidationErrorMessage() {
        try {
            WebElement errorElement = driver.findElement(By.cssSelector("[role='alert'], .error, .text-red-500"));
            return errorElement.getText();
        } catch (Exception e) {
            return "";
        }
    }
}
