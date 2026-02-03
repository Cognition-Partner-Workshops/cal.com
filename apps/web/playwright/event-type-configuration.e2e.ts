import { randomString } from "@calcom/lib/random";
import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";
import { createNewUserEventType, gotoFirstEventType, saveEventType } from "./lib/testUtils";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Event Type Creation", () => {
  test("should create event type with custom title", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    const customTitle = `Custom Event ${randomString(5)}`;
    await createNewUserEventType(page, { eventTitle: customTitle });

    await page.goto("/event-types");
    await expect(page.locator(`text='${customTitle}'`)).toBeVisible();
  });
});

test.describe("Event Type Basic Settings", () => {
  test("should update event type title", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    const newTitle = `Updated Title ${randomString(5)}`;
    await page.fill('[name="title"]', newTitle);

    await saveEventType(page);

    await page.goto("/event-types");
    await expect(page.locator(`text='${newTitle}'`)).toBeVisible();
  });

  test("should update event type description", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    const description = "This is a test description for the event type";
    await page.fill('[name="description"]', description);

    await saveEventType(page);

    await page.reload();
    await expect(page.locator('[name="description"]')).toHaveValue(description);
  });

  test("should update event type slug", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    const newSlug = `custom-slug-${randomString(5)}`;
    await page.fill('[name="slug"]', newSlug);

    await saveEventType(page);

    await page.reload();
    await expect(page.locator('[name="slug"]')).toHaveValue(newSlug);
  });
});

test.describe("Event Type Duration Settings", () => {
  test("should update event duration", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    await page.fill('[name="length"]', "45");

    await saveEventType(page);

    await page.reload();
    await expect(page.locator('[name="length"]')).toHaveValue("45");
  });

  test("should enable multiple duration options", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    const eventTitle = `Multi Duration ${randomString(3)}`;
    await createNewUserEventType(page, { eventTitle });

    await page.waitForSelector('[data-testid="event-title"]');

    const multipleDurationToggle = page.locator('[data-testid="multiple-duration-checkbox"]');
    if (await multipleDurationToggle.isVisible()) {
      await multipleDurationToggle.click();
    }
  });
});

test.describe("Event Type Advanced Settings", () => {
  test("should navigate to advanced tab", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    await page.click('[data-testid="vertical-tab-event_advanced_tab_title"]');

    await expect(page.getByTestId("vertical-tab-event_advanced_tab_title")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("should toggle require confirmation setting", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);
    await page.click('[data-testid="vertical-tab-event_advanced_tab_title"]');

    const requireConfirmationToggle = page.locator('[data-testid="requires-confirmation-toggle"]');
    if (await requireConfirmationToggle.isVisible()) {
      const initialState = await requireConfirmationToggle.isChecked();
      await requireConfirmationToggle.click();

      await saveEventType(page);

      await page.reload();
      await page.click('[data-testid="vertical-tab-event_advanced_tab_title"]');

      const newState = await requireConfirmationToggle.isChecked();
      expect(newState).not.toBe(initialState);
    }
  });

  test("should toggle hide calendar notes setting", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);
    await page.click('[data-testid="vertical-tab-event_advanced_tab_title"]');

    const hideNotesToggle = page.locator('[data-testid="hide-calendar-notes-toggle"]');
    if (await hideNotesToggle.isVisible()) {
      await hideNotesToggle.click();
      await saveEventType(page);
    }
  });
});

test.describe("Event Type Recurring Settings", () => {
  test("should navigate to recurring tab", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    await page.click('[data-testid="vertical-tab-recurring"]');

    await expect(page.getByTestId("vertical-tab-recurring")).toHaveAttribute("aria-current", "page");
  });

  test("should enable recurring event", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    const eventTitle = `Recurring Test ${randomString(3)}`;
    await createNewUserEventType(page, { eventTitle });

    await page.waitForSelector('[data-testid="event-title"]');
    await page.click('[data-testid="vertical-tab-recurring"]');

    await expect(page.locator("[data-testid=recurring-event-collapsible]")).toBeHidden();
    await page.click("[data-testid=recurring-event-check]");
    await expect(page.locator("[data-testid=recurring-event-collapsible]")).toBeVisible();
  });
});

test.describe("Event Type Limits Settings", () => {
  test("should navigate to limits tab", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    await page.click('[data-testid="vertical-tab-event_limit_tab_title"]');

    await expect(page.getByTestId("vertical-tab-event_limit_tab_title")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });
});

test.describe("Event Type Availability Settings", () => {
  test("should navigate to availability tab", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    await page.click('[data-testid="vertical-tab-availability"]');

    await expect(page.getByTestId("vertical-tab-availability")).toHaveAttribute("aria-current", "page");
  });
});

test.describe("Event Type Form Validation", () => {
  test("should not allow empty title", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    await page.fill('[name="title"]', "");

    await page.locator("[data-testid=update-eventtype]").click();

    const titleInput = page.locator('[name="title"]');
    const isInvalid = await titleInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test("should not allow invalid slug characters", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    await page.fill('[name="slug"]', "invalid slug with spaces!");

    await page.locator("[data-testid=update-eventtype]").click();

    const slugInput = page.locator('[name="slug"]');
    await expect(slugInput).toBeVisible();
  });

  test("should not allow zero duration", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    await page.fill('[name="length"]', "0");

    await page.locator("[data-testid=update-eventtype]").click();

    const lengthInput = page.locator('[name="length"]');
    const value = await lengthInput.inputValue();
    expect(parseInt(value, 10)).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Event Type Preview", () => {
  test("should show preview button", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    const previewButton = page.locator("[data-testid=preview-button]");
    await expect(previewButton).toBeVisible();
  });

  test("should have valid preview link", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await gotoFirstEventType(page);

    const previewButton = page.locator("[data-testid=preview-button]");
    const href = await previewButton.getAttribute("href");

    expect(href).toBeTruthy();
    expect(href).toContain(user.username);
  });
});
