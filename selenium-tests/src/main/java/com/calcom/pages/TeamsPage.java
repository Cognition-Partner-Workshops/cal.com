package com.calcom.pages;

import com.calcom.utils.ConfigReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class TeamsPage extends BasePage {

    @FindBy(css = "[data-testid='new-team-btn']")
    private WebElement newTeamButton;

    @FindBy(css = "[data-testid='create-team-btn']")
    private WebElement createTeamButton;

    @FindBy(css = "a[href*='/teams']")
    private WebElement teamsNavLink;

    public TeamsPage() {
        super();
    }

    public void navigateToTeamsPage() {
        navigateTo(ConfigReader.getBaseUrl() + "/teams");
        waitForPageLoad();
    }

    public void clickNewTeamButton() {
        try {
            waitForElementClickable(newTeamButton);
            click(newTeamButton);
        } catch (Exception e) {
            waitForElementClickable(createTeamButton);
            click(createTeamButton);
        }
    }

    public CreateTeamPage clickCreateNewTeam() {
        clickNewTeamButton();
        waitForUrlContains("/settings/teams/new");
        return new CreateTeamPage();
    }

    public boolean isOnTeamsPage() {
        return getCurrentUrl().contains("/teams");
    }

    public boolean isNewTeamButtonDisplayed() {
        try {
            return isElementDisplayed(newTeamButton) || isElementDisplayed(createTeamButton);
        } catch (Exception e) {
            return false;
        }
    }

    public int getTeamCount() {
        try {
            return driver.findElements(By.cssSelector("[data-testid='team-list-item-link']")).size();
        } catch (Exception e) {
            return 0;
        }
    }

    public boolean isTeamDisplayed(String teamName) {
        try {
            WebElement team = driver.findElement(By.xpath("//span[contains(text(), '" + teamName + "')]"));
            return isElementDisplayed(team);
        } catch (Exception e) {
            return false;
        }
    }
}
