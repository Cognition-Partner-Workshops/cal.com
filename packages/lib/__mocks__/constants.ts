import { vi, beforeEach } from "vitest";

import type * as constants from "@calcom/lib/constants";

const initialConstants = {
  IS_PRODUCTION: false,
  IS_TEAM_BILLING_ENABLED: false,
  WEBSITE_URL: "",
  PUBLIC_INVALIDATE_AVAILABLE_SLOTS_ON_BOOKING_FORM: true,
  CLOUDFLARE_SITE_ID: "test-site-id",
  CLOUDFLARE_USE_TURNSTILE_IN_BOOKER: "1",
  DEFAULT_LIGHT_BRAND_COLOR: "#292929",
  DEFAULT_DARK_BRAND_COLOR: "#fafafa",
  CALCOM_VERSION: "0.0.0",
  IS_SELF_HOSTED: false,
  SEO_IMG_DEFAULT: "https://cal.com/og-image.png",
  SEO_IMG_OGIMG: "https://cal.com/og-image-wide.png",
  CURRENT_TIMEZONE: "Europe/London",
  APP_NAME: "Cal.com",
  BOOKER_NUMBER_OF_DAYS_TO_LOAD: 14,
  PUBLIC_QUICK_AVAILABILITY_ROLLOUT: 100,
  SINGLE_ORG_SLUG: "",
  DEFAULT_GROUP_ID: "default_group_id",
} as Partial<typeof constants>;

const _mockedConstants: Partial<typeof constants> = { ...initialConstants };

vi.mock("@calcom/lib/constants", () => _mockedConstants);

beforeEach(() => {
  Object.assign(_mockedConstants, initialConstants);
});

const _constantsScenarios = {
  enableTeamBilling: (): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    _mockedConstants.IS_TEAM_BILLING_ENABLED = true;
  },
  setWebsiteUrl: (url: string): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    _mockedConstants.WEBSITE_URL = url;
  },
  set: (envVariables: Record<string, string>): void => {
    Object.entries(envVariables).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      _mockedConstants[key] = value;
    });
  },
};

export const mockedConstants: Partial<typeof constants> = _mockedConstants;
export const constantsScenarios: typeof _constantsScenarios = _constantsScenarios;
