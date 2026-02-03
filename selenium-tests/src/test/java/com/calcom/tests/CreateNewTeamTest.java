package com.calcom.tests;

import com.calcom.components.FormComponent;
import com.calcom.components.NavigationComponent;
import com.calcom.pages.CreateTeamPage;
import com.calcom.pages.LoginPage;
import com.calcom.pages.TeamsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CreateNewTeamTest extends BaseTest {

    private LoginPage loginPage;
    private TeamsPage teamsPage;
    private CreateTeamPage createTeamPage;
    private NavigationComponent navigationComponent;
    private FormComponent formComponent;

    @Test(priority = 1, description = "Verify user can navigate to Teams page from left navigation")
    public void testNavigateToTeamsPage() {
        loginPage = new LoginPage();
        loginPage.navigateToLoginPage();
        teamsPage = loginPage.loginWithDefaultCredentials();

        navigationComponent = new NavigationComponent();
        navigationComponent.clickTeamsLink();

        Assert.assertTrue(teamsPage.isOnTeamsPage(), "User should be on Teams page");
    }

    @Test(priority = 2, description = "Verify Create New Team button is displayed on Teams page")
    public void testCreateNewTeamButtonDisplayed() {
        loginPage = new LoginPage();
        loginPage.navigateToLoginPage();
        teamsPage = loginPage.loginWithDefaultCredentials();

        navigationComponent = new NavigationComponent();
        navigationComponent.clickTeamsLink();

        teamsPage = new TeamsPage();
        Assert.assertTrue(teamsPage.isNewTeamButtonDisplayed(), "Create New Team button should be displayed");
    }

    @Test(priority = 3, description = "Verify user can navigate to Create New Team page")
    public void testNavigateToCreateNewTeamPage() {
        loginPage = new LoginPage();
        loginPage.navigateToLoginPage();
        teamsPage = loginPage.loginWithDefaultCredentials();

        navigationComponent = new NavigationComponent();
        navigationComponent.clickTeamsLink();

        teamsPage = new TeamsPage();
        createTeamPage = teamsPage.clickCreateNewTeam();

        Assert.assertTrue(createTeamPage.isOnCreateTeamPage(), "User should be on Create Team page");
    }

    @Test(priority = 4, description = "Verify Create New Team form elements are displayed")
    public void testCreateNewTeamFormElementsDisplayed() {
        loginPage = new LoginPage();
        loginPage.navigateToLoginPage();
        teamsPage = loginPage.loginWithDefaultCredentials();

        navigationComponent = new NavigationComponent();
        navigationComponent.clickTeamsLink();

        teamsPage = new TeamsPage();
        createTeamPage = teamsPage.clickCreateNewTeam();

        Assert.assertTrue(createTeamPage.isTeamNameFieldDisplayed(), "Team name field should be displayed");
        Assert.assertTrue(createTeamPage.isContinueButtonDisplayed(), "Continue button should be displayed");
        Assert.assertTrue(createTeamPage.isCancelButtonDisplayed(), "Cancel button should be displayed");
    }

    @Test(priority = 5, description = "Verify user can enter team name and URL")
    public void testEnterTeamDetails() {
        loginPage = new LoginPage();
        loginPage.navigateToLoginPage();
        teamsPage = loginPage.loginWithDefaultCredentials();

        navigationComponent = new NavigationComponent();
        navigationComponent.clickTeamsLink();

        teamsPage = new TeamsPage();
        createTeamPage = teamsPage.clickCreateNewTeam();

        String teamName = "Test Team " + System.currentTimeMillis();
        String teamUrl = "test-team-" + System.currentTimeMillis();

        createTeamPage.enterTeamName(teamName);
        createTeamPage.enterTeamUrl(teamUrl);

        Assert.assertEquals(createTeamPage.getTeamUrlValue(), teamUrl, "Team URL should match entered value");
    }

    @Test(priority = 6, description = "Verify team URL is auto-generated from team name")
    public void testTeamUrlAutoGeneration() {
        loginPage = new LoginPage();
        loginPage.navigateToLoginPage();
        teamsPage = loginPage.loginWithDefaultCredentials();

        navigationComponent = new NavigationComponent();
        navigationComponent.clickTeamsLink();

        teamsPage = new TeamsPage();
        createTeamPage = teamsPage.clickCreateNewTeam();

        String teamName = "My Awesome Team";
        createTeamPage.enterTeamName(teamName);

        String generatedUrl = createTeamPage.getTeamUrlValue();
        Assert.assertNotNull(generatedUrl, "Team URL should be auto-generated");
        Assert.assertFalse(generatedUrl.isEmpty(), "Team URL should not be empty");
    }

    @Test(priority = 7, description = "Verify user can create a new team using FormComponent")
    public void testCreateNewTeamUsingFormComponent() {
        loginPage = new LoginPage();
        loginPage.navigateToLoginPage();
        teamsPage = loginPage.loginWithDefaultCredentials();

        navigationComponent = new NavigationComponent();
        navigationComponent.clickTeamsLink();

        teamsPage = new TeamsPage();
        createTeamPage = teamsPage.clickCreateNewTeam();

        formComponent = new FormComponent();

        String teamName = "Selenium Test Team " + System.currentTimeMillis();
        formComponent.fillTextFieldByTestId("team-name", teamName);

        Assert.assertTrue(formComponent.isButtonDisplayedByTestId("continue-button"),
                "Continue button should be displayed");
    }

    @Test(priority = 8, description = "Verify cancel button returns to Teams page")
    public void testCancelButtonReturnsToTeamsPage() {
        loginPage = new LoginPage();
        loginPage.navigateToLoginPage();
        teamsPage = loginPage.loginWithDefaultCredentials();

        navigationComponent = new NavigationComponent();
        navigationComponent.clickTeamsLink();

        teamsPage = new TeamsPage();
        createTeamPage = teamsPage.clickCreateNewTeam();

        Assert.assertTrue(createTeamPage.isOnCreateTeamPage(), "User should be on Create Team page");

        createTeamPage.clickCancel();

        teamsPage = new TeamsPage();
        Assert.assertTrue(teamsPage.isOnTeamsPage(), "User should be returned to Teams page after cancel");
    }
}
