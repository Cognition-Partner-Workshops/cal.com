import { sleep } from "k6";

import { THRESHOLDS } from "../utils/config.js";
import { healthCheck, getPublicProfile, getAvailability } from "../utils/api-helpers.js";

export const options = {
  vus: 10,
  duration: "2m",
  thresholds: {
    http_req_failed: THRESHOLDS.HTTP_ERRORS,
    http_req_duration: THRESHOLDS.RESPONSE_TIME.SMOKE.p95,
  },
};

export default function () {
  healthCheck();
  sleep(0.5);

  getPublicProfile("pro");
  sleep(0.5);

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  getAvailability("pro", "30min", today.toISOString(), nextWeek.toISOString());
  sleep(0.5);
}
