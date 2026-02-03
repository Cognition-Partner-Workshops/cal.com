import { randomString } from "@calcom/lib/random";
import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";
import { submitAndWaitForResponse } from "./lib/testUtils";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Event Type Title Validation", () => {
  test("should not allow creating event type with empty title", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await page.click("[data-testid=new-event-type]");
    await page.fill("[name=title]", "");
    await page.fill("[name=length]", "30");

    const submitButton = page.locator("[type=submit]");
    await submitButton.click();

    const titleInput = page.locator("[name=title]");
    const isInvalid = await titleInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});

test.describe("Event Type Duration Validation", () => {
  test("should not allow event duration of zero", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await page.click("[data-testid=new-event-type]");
    await page.fill("[name=title]", "Test Event");
    await page.fill("[name=length]", "0");

    const submitButton = page.locator("[type=submit]");
    await submitButton.click();

    const lengthInput = page.locator("[name=length]");
    const isInvalid = await lengthInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test("should not allow negative event duration", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await page.click("[data-testid=new-event-type]");
    await page.fill("[name=title]", "Test Event");
    await page.fill("[name=length]", "-15");

    const submitButton = page.locator("[type=submit]");
    await submitButton.click();

    const lengthInput = page.locator("[name=length]");
    const isInvalid = await lengthInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});

test.describe("Event Type Slug Handling", () => {
  test("should handle duplicate event type slug gracefully", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    const eventTitle = `duplicate-test-${randomString(5)}`;
    await page.click("[data-testid=new-event-type]");
    await page.fill("[name=title]", eventTitle);
    await page.fill("[name=length]", "30");
    await page.click("[type=submit]");

    await page.waitForURL((url) => url.pathname !== "/event-types");

    await page.goto("/event-types");
    await page.click("[data-testid=new-event-type]");
    await page.fill("[name=title]", eventTitle);
    await page.fill("[name=length]", "30");
    await page.click("[type=submit]");

    await page.waitForURL((url) => url.pathname !== "/event-types");

    const slugInput = page.locator("[name=slug]");
    const slugValue = await slugInput.inputValue();
    expect(slugValue).not.toBe(eventTitle.toLowerCase().replace(/\s+/g, "-"));
  });
});

test.describe("Event Type Advanced Settings", () => {
  test("should validate minimum booking notice", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    const $eventTypes = page.locator("[data-testid=event-types] > li a");
    await $eventTypes.first().click();

    await page.waitForURL((url) => !!url.pathname.match(/\/event-types\/.+/));

    await page.click("[data-testid=vertical-tab-event_advanced_tab_title]");

    const minimumNoticeInput = page.locator("[data-testid=minimum-booking-notice]");
    if (await minimumNoticeInput.isVisible()) {
      await minimumNoticeInput.fill("-1");

      await submitAndWaitForResponse(page, "/api/trpc/eventTypesHeavy/update?batch=1", {
        action: () => page.locator("[data-testid=update-eventtype]").click(),
        expectedStatusCode: 400,
      });
    }
  });
});
