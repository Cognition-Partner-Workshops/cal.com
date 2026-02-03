package com.calcom.pages;

import com.calcom.utils.ConfigReader;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class CreateTeamPage extends BasePage {

    @FindBy(css = "[data-testid='team-name']")
    private WebElement teamNameField;

    @FindBy(css = "input[name='slug']")
    private WebElement teamUrlField;

    @FindBy(css = "[data-testid='continue-button']")
    private WebElement continueButton;

    @FindBy(css = "button[color='secondary']")
    private WebElement cancelButton;

    public CreateTeamPage() {
        super();
    }

    public void navigateToCreateTeamPage() {
        navigateTo(ConfigReader.getBaseUrl() + "/settings/teams/new");
        waitForPageLoad();
    }

    public void enterTeamName(String teamName) {
        waitForElementVisible(teamNameField);
        type(teamNameField, teamName);
    }

    public void enterTeamUrl(String teamUrl) {
        waitForElementVisible(teamUrlField);
        type(teamUrlField, teamUrl);
    }

    public void clickContinue() {
        waitForElementClickable(continueButton);
        click(continueButton);
    }

    public void clickCancel() {
        waitForElementClickable(cancelButton);
        click(cancelButton);
    }

    public void createTeam(String teamName, String teamUrl) {
        enterTeamName(teamName);
        enterTeamUrl(teamUrl);
        clickContinue();
    }

    public void createTeamWithAutoSlug(String teamName) {
        enterTeamName(teamName);
        clickContinue();
    }

    public boolean isOnCreateTeamPage() {
        return getCurrentUrl().contains("/settings/teams/new");
    }

    public boolean isTeamNameFieldDisplayed() {
        return isElementDisplayed(teamNameField);
    }

    public boolean isContinueButtonDisplayed() {
        return isElementDisplayed(continueButton);
    }

    public boolean isCancelButtonDisplayed() {
        return isElementDisplayed(cancelButton);
    }

    public String getTeamNameValue() {
        waitForElementVisible(teamNameField);
        return teamNameField.getAttribute("value");
    }

    public String getTeamUrlValue() {
        waitForElementVisible(teamUrlField);
        return teamUrlField.getAttribute("value");
    }
}
