package com.calcom.pages;

import com.calcom.utils.ConfigReader;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class LoginPage extends BasePage {

    @FindBy(id = "email")
    private WebElement emailField;

    @FindBy(id = "password")
    private WebElement passwordField;

    @FindBy(css = "[data-testid='login-form'] button[type='submit']")
    private WebElement signInButton;

    @FindBy(css = "[data-testid='login-form']")
    private WebElement loginForm;

    public LoginPage() {
        super();
    }

    public void navigateToLoginPage() {
        navigateTo(ConfigReader.getBaseUrl() + "/auth/login");
        waitForPageLoad();
    }

    public void enterEmail(String email) {
        waitForElementVisible(emailField);
        type(emailField, email);
    }

    public void enterPassword(String password) {
        waitForElementVisible(passwordField);
        type(passwordField, password);
    }

    public void clickSignIn() {
        waitForElementClickable(signInButton);
        click(signInButton);
    }

    public TeamsPage login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickSignIn();
        waitForUrlContains("/event-types");
        return new TeamsPage();
    }

    public TeamsPage loginWithDefaultCredentials() {
        return login(ConfigReader.getEmail(), ConfigReader.getPassword());
    }

    public boolean isLoginFormDisplayed() {
        return isElementDisplayed(loginForm);
    }

    public boolean isOnLoginPage() {
        return getCurrentUrl().contains("/auth/login");
    }
}
