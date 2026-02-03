# Cal.com Selenium Automation Tests

Selenium-based automation test suite for testing the Bookings section of Cal.com application.

## Overview

This test suite covers the following functionalities in the Bookings > Upcoming section:

- **Tabs Navigation**: Tests for Upcoming, Unconfirmed, Recurring, Past, and Canceled tabs
- **Booking Links**: Tests for booking date/time and event name links navigation
- **Filter Button**: Tests for filter dropdown and filter options
- **Saved Button**: Tests for saved filters dropdown
- **Three Dots Menu**: Tests for booking action menu (Reschedule, Edit location, Add guests, Cancel)
- **Confirm/Reject Buttons**: Tests for unconfirmed booking actions
- **Attendee Buttons**: Tests for attendee name dropdown with email and copy options
- **Pagination**: Tests for page navigation and rows per page selector

## Project Structure

```
selenium-tests/
├── conftest.py              # Pytest fixtures and configuration
├── requirements.txt         # Python dependencies
├── README.md               # This file
├── pages/                  # Page Object Model classes
│   ├── __init__.py
│   ├── base_page.py        # Base page with common methods
│   ├── login_page.py       # Login page object
│   └── bookings_page.py    # Bookings page object
└── tests/                  # Test cases
    ├── __init__.py
    ├── test_bookings_tabs.py       # Tab navigation tests
    ├── test_bookings_links.py      # Booking links tests
    ├── test_bookings_buttons.py    # Button functionality tests
    └── test_bookings_pagination.py # Pagination tests
```

## Prerequisites

- Python 3.8 or higher
- Google Chrome browser installed
- Cal.com application running locally at http://localhost:3000

## Installation

1. Navigate to the selenium-tests directory:
   ```bash
   cd selenium-tests
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

The tests use the following default configuration (defined in `conftest.py`):

- **Base URL**: `http://localhost:3000`
- **Test User Email**: `pro@example.com`
- **Test User Password**: `pro`

To override these values, you can set environment variables:
- `CAL_BASE_URL`
- `CAL_TEST_EMAIL`
- `CAL_TEST_PASSWORD`

## Running Tests

### Run all tests
```bash
pytest tests/ -v
```

### Run specific test file
```bash
pytest tests/test_bookings_tabs.py -v
```

### Run specific test class
```bash
pytest tests/test_bookings_buttons.py::TestFilterButton -v
```

### Run specific test
```bash
pytest tests/test_bookings_tabs.py::TestBookingsTabs::test_upcoming_tab_is_default -v
```

### Run with HTML report
```bash
pytest tests/ -v --html=report.html --self-contained-html
```

### Run in headed mode (visible browser)
To run tests with a visible browser window, modify the `conftest.py` file and comment out the headless option:
```python
# chrome_options.add_argument("--headless")
```

## Test Categories

### Tab Tests (`test_bookings_tabs.py`)
- `test_upcoming_tab_is_default` - Verifies Upcoming tab is default
- `test_click_unconfirmed_tab` - Tests Unconfirmed tab navigation
- `test_click_recurring_tab` - Tests Recurring tab navigation
- `test_click_past_tab` - Tests Past tab navigation
- `test_click_canceled_tab` - Tests Canceled tab navigation
- `test_tab_navigation_cycle` - Tests cycling through all tabs
- `test_direct_url_navigation_*` - Tests direct URL access to each tab

### Link Tests (`test_bookings_links.py`)
- `test_booking_links_exist` - Verifies booking links are present
- `test_booking_link_has_correct_href` - Validates link href format
- `test_click_booking_link_navigates_to_detail` - Tests link navigation
- `test_booking_detail_page_url_format` - Validates detail page URL

### Button Tests (`test_bookings_buttons.py`)
- **Filter Button Tests**: Dropdown visibility, filter options
- **Saved Button Tests**: Saved filters dropdown
- **Three Dots Menu Tests**: Menu visibility, action options
- **Confirm/Reject Tests**: Button visibility, modal functionality
- **Attendee Button Tests**: Dropdown with email/copy options

### Pagination Tests (`test_bookings_pagination.py`)
- `test_pagination_info_is_displayed` - Verifies pagination info
- `test_rows_per_page_selector_*` - Tests rows per page options (10, 25, 50, 100)
- `test_next_page_button_works` - Tests next page navigation
- `test_pagination_updates_url` - Verifies URL updates with page parameter

## Page Object Model

The tests use the Page Object Model (POM) design pattern for better maintainability:

- **BasePage**: Contains common Selenium methods (wait_for_element, click_element, etc.)
- **LoginPage**: Handles authentication
- **BookingsPage**: Contains all locators and methods for the Bookings page

## Troubleshooting

### ChromeDriver issues
The tests use `webdriver-manager` to automatically download and manage ChromeDriver. If you encounter issues:
```bash
pip install --upgrade webdriver-manager
```

### Element not found errors
- Ensure the Cal.com application is running at the configured URL
- Check that you're logged in with valid credentials
- Some tests may be skipped if there's no test data (e.g., no unconfirmed bookings)

### Timeout errors
- Increase the implicit wait time in `conftest.py`
- Check your network connection
- Ensure the application is responding properly

## Contributing

When adding new tests:
1. Follow the existing Page Object Model pattern
2. Add new locators to the appropriate page object
3. Create descriptive test method names
4. Include docstrings explaining what each test verifies
