import { check, group } from "k6";
import http from "k6/http";

import { randomSleep, BASE_URL, randomQueryParam } from "./config.js";

export function getAvailability(username, eventSlug, dateFrom, dateTo) {
  return group("Get Availability", () => {
    const url = `${BASE_URL}/api/trpc/public/slots.getSchedule?input=${encodeURIComponent(
      JSON.stringify({
        json: {
          usernameList: [username],
          eventTypeSlug: eventSlug,
          startTime: dateFrom,
          endTime: dateTo,
          timeZone: "UTC",
        },
      })
    )}&${randomQueryParam()}`;

    const response = http.get(url, {
      tags: { name: "Get Availability" },
      timeout: "30s",
    });

    check(response, {
      "Availability loaded": (r) => r.status === 200,
      "Has slots data": (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.result !== undefined;
        } catch {
          return false;
        }
      },
      "Response time acceptable": (r) => r.timings.duration < 5000,
    });

    randomSleep();
    return response;
  });
}

export function getEventTypes() {
  return group("Get Event Types", () => {
    const url = `${BASE_URL}/api/trpc/public/event-types.list?${randomQueryParam()}`;

    const response = http.get(url, {
      tags: { name: "Get Event Types" },
      timeout: "30s",
    });

    check(response, {
      "Event types loaded": (r) => r.status === 200 || r.status === 401,
      "Response time acceptable": (r) => r.timings.duration < 3000,
    });

    randomSleep();
    return response;
  });
}

export function getTags() {
  return group("Get Tags", () => {
    const url = `${BASE_URL}/api/trpc/public/tags?${randomQueryParam()}`;

    const response = http.get(url, {
      tags: { name: "Get Tags" },
      timeout: "30s",
    });

    check(response, {
      "Tags loaded": (r) => r.status === 200 || r.status === 401,
      "Response time acceptable": (r) => r.timings.duration < 2000,
    });

    randomSleep();
    return response;
  });
}

export function healthCheck() {
  return group("Health Check", () => {
    const url = `${BASE_URL}/api/health?${randomQueryParam()}`;

    const response = http.get(url, {
      tags: { name: "Health Check" },
      timeout: "10s",
    });

    check(response, {
      "Health check passed": (r) => r.status === 200,
      "Response time acceptable": (r) => r.timings.duration < 1000,
    });

    return response;
  });
}

export function getPublicProfile(username) {
  return group("Get Public Profile", () => {
    const url = `${BASE_URL}/${username}?${randomQueryParam()}`;

    const response = http.get(url, {
      tags: { name: "Public Profile" },
      timeout: "30s",
    });

    check(response, {
      "Profile loaded": (r) => r.status === 200,
      "Has profile content": (r) => r.body.includes(username) || r.body.includes("booking"),
      "Response time acceptable": (r) => r.timings.duration < 5000,
    });

    randomSleep();
    return response;
  });
}
