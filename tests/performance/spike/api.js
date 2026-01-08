import { sleep } from "k6";

import { THRESHOLDS } from "../utils/config.js";
import { healthCheck, getPublicProfile, getAvailability } from "../utils/api-helpers.js";

export const options = {
  stages: [
    { duration: "1m", target: 500 }, // Baseline load
    { duration: "2m", target: 5000 }, // Rapid spike to 5000 VUs
    { duration: "5m", target: 5000 }, // Stay at 5000 VUs
    { duration: "2m", target: 500 }, // Scale back to baseline
    { duration: "1m", target: 0 }, // Scale down to 0
  ],
  thresholds: {
    http_req_failed: THRESHOLDS.HTTP_ERRORS,
    http_req_duration: THRESHOLDS.RESPONSE_TIME.SPIKE.p95,
  },
};

export default function () {
  const scenario = Math.random();

  if (scenario < 0.3) {
    healthCheck();
  } else if (scenario < 0.6) {
    getPublicProfile("pro");
  } else {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    getAvailability("pro", "30min", today.toISOString(), nextWeek.toISOString());
  }

  sleep(0.1);
}
