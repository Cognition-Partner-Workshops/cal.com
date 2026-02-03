# Cal.com Selenium Java Automation Tests

This project contains Selenium Java automation tests for the Cal.com Teams functionality, following a modular architecture with Page, Component, and Runner patterns.

## Project Structure

```
selenium-tests/
├── pom.xml                                    # Maven configuration
├── src/
│   ├── main/java/com/calcom/
│   │   ├── pages/                             # Page Object classes
│   │   │   ├── BasePage.java                  # Base page with common methods
│   │   │   ├── LoginPage.java                 # Login page interactions
│   │   │   ├── TeamsPage.java                 # Teams listing page
│   │   │   └── CreateTeamPage.java            # Create new team form
│   │   ├── components/                        # Reusable UI components
│   │   │   ├── NavigationComponent.java       # Left navigation menu
│   │   │   └── FormComponent.java             # Form interactions
│   │   └── utils/                             # Utility classes
│   │       ├── ConfigReader.java              # Configuration reader
│   │       └── DriverManager.java             # WebDriver management
│   └── test/
│       ├── java/com/calcom/
│       │   ├── tests/
│       │   │   ├── BaseTest.java              # Base test class
│       │   │   └── CreateNewTeamTest.java     # Create New Team tests
│       │   └── runner/
│       │       └── TestRunner.java            # TestNG runner
│       └── resources/
│           ├── config.properties              # Test configuration
│           └── testng.xml                     # TestNG suite configuration
```

## Prerequisites

- Java 11 or higher
- Maven 3.6 or higher
- Chrome browser (for default execution)

## Configuration

Edit `src/test/resources/config.properties` to configure:

- `base.url`: Application URL (default: http://localhost:3000)
- `test.email`: Test user email
- `test.password`: Test user password
- `browser`: Browser to use (chrome/firefox)
- `headless`: Run in headless mode (true/false)

## Running Tests

### Using Maven

```bash
cd selenium-tests
mvn clean test
```

### Using TestNG XML

```bash
mvn test -DsuiteXmlFile=src/test/resources/testng.xml
```

### Using TestRunner class

```bash
mvn exec:java -Dexec.mainClass="com.calcom.runner.TestRunner"
```

## Test Cases

The `CreateNewTeamTest` class includes the following test cases:

1. **testNavigateToTeamsPage** - Verify user can navigate to Teams page from left navigation
2. **testCreateNewTeamButtonDisplayed** - Verify Create New Team button is displayed
3. **testNavigateToCreateNewTeamPage** - Verify user can navigate to Create New Team page
4. **testCreateNewTeamFormElementsDisplayed** - Verify form elements are displayed
5. **testEnterTeamDetails** - Verify user can enter team name and URL
6. **testTeamUrlAutoGeneration** - Verify team URL is auto-generated from team name
7. **testCreateNewTeamUsingFormComponent** - Verify creating team using FormComponent
8. **testCancelButtonReturnsToTeamsPage** - Verify cancel button returns to Teams page

## Architecture

### Page Object Model (POM)

- **BasePage**: Contains common methods for all pages (wait, click, type, etc.)
- **LoginPage**: Handles login functionality
- **TeamsPage**: Handles Teams listing page interactions
- **CreateTeamPage**: Handles Create New Team form interactions

### Component Pattern

- **NavigationComponent**: Handles left navigation menu interactions
- **FormComponent**: Provides reusable form interaction methods

### Utilities

- **ConfigReader**: Reads configuration from properties file
- **DriverManager**: Manages WebDriver lifecycle with ThreadLocal for parallel execution
