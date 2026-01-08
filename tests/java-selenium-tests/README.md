# Cal.com Java Selenium Test Scripts

This directory contains Java Selenium-based test scripts converted from the original TypeScript Vitest tests.

## Overview

These test scripts provide Java equivalents of the Cal.com utility function tests, specifically converted from `packages/lib/array.test.ts`.

## Project Structure

```
java-selenium-tests/
├── pom.xml                                    # Maven configuration
├── README.md                                  # This file
└── src/
    ├── main/java/com/calcom/
    │   └── utils/
    │       └── ArrayUtils.java                # Array utility functions
    └── test/java/com/calcom/tests/
        ├── base/
        │   └── BaseTest.java                  # Base test class with WebDriver setup
        ├── ArrayUtilsTest.java                # Converted array.test.ts tests
        └── resources/
            └── testng.xml                     # TestNG configuration
```

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Chrome or Firefox browser (for Selenium tests)

## Dependencies

- Selenium WebDriver 4.16.1
- TestNG 7.9.0
- WebDriverManager 5.6.2
- AssertJ 3.24.2

## Running Tests

### Run all tests
```bash
mvn test
```

### Run specific test class
```bash
mvn test -Dtest=ArrayUtilsTest
```

### Run with specific browser
```bash
mvn test -Dbrowser=firefox
```

### Run with verbose output
```bash
mvn test -X
```

## Test Mapping

The following tests have been converted from TypeScript to Java:

| Original TypeScript Test | Java Test Method |
|-------------------------|------------------|
| `should remove duplicates based on single key` | `testUniqueBy_SingleKey_RemovesDuplicates()` |
| `should remove duplicates based on multiple keys` | `testUniqueBy_MultipleKeys_RemovesDuplicates()` |
| `should handle empty array` | `testUniqueBy_EmptyArray_ReturnsEmptyList()` |
| `should handle array with single item` | `testUniqueBy_SingleItem_ReturnsSameItem()` |

### Additional Java Tests

The Java implementation includes additional test cases for comprehensive coverage:

- `testUniqueBy_NullInput_ReturnsEmptyList()` - Handles null input gracefully
- `testNotNull_ListWithNulls_FiltersNulls()` - Filters null values from lists
- `testUniqueBy_PreservesFirstOccurrenceOrder()` - Verifies order preservation
- `testUniqueBy_NullValuesInKeys_HandlesCorrectly()` - Handles null key values
- `testUniqueBy_StringKeys_RemovesDuplicates()` - Works with string keys
- `testUniqueBy_ThreeKeys_RemovesDuplicates()` - Supports multiple keys
- `testUniqueBy_LargeArray_HandlesEfficiently()` - Performance test

## Utility Classes

### ArrayUtils

Java equivalent of `packages/lib/array.ts`:

```java
// Filter null values (equivalent to notUndefined)
List<String> filtered = ArrayUtils.notNull(listWithNulls);

// Remove duplicates by keys (equivalent to uniqueBy)
List<Map<String, Object>> unique = ArrayUtils.uniqueByKeys(list, "id", "type");

// Check if value is not null
boolean isValid = ArrayUtils.isNotNull(value);
```

## Selenium WebDriver Support

The `BaseTest` class provides WebDriver setup and teardown:

```java
public class MyTest extends BaseTest {
    @Test
    public void testSomething() {
        navigateToPath("/booking");
        // Use driver for Selenium operations
    }
}
```

## Configuration

### Browser Selection

Set the browser via TestNG parameter or system property:

```xml
<parameter name="browser" value="chrome"/>
```

Or via command line:
```bash
mvn test -Dbrowser=firefox
```

### Headless Mode

Tests run in headless mode by default. To run with visible browser, modify `BaseTest.java`:

```java
chromeOptions.addArguments("--headless"); // Remove this line
```

## Reports

Test reports are generated in:
- `target/surefire-reports/` - TestNG reports
- `target/surefire-reports/junitreports/` - JUnit XML reports

## Contributing

When adding new tests:

1. Extend `BaseTest` for Selenium-based tests
2. Use AssertJ assertions for fluent, readable tests
3. Follow the naming convention: `test{Method}_{Scenario}_{ExpectedResult}`
4. Add corresponding documentation in this README

## License

This project is part of the Cal.com test suite.
