import { describe, expect, it } from "vitest";
import { isSafeAppPath, normalizeHostname } from "@/lib/hosts";

describe("normalizeHostname", () => {
  it("maps 127.0.0.1 to localhost", () => {
    expect(normalizeHostname("127.0.0.1")).toBe("localhost");
    expect(normalizeHostname("127.0.0.1:3002")).toBe("localhost");
  });

  it("maps ::1 to localhost", () => {
    expect(normalizeHostname("::1")).toBe("localhost");
  });

  it("leaves other hosts unchanged", () => {
    expect(normalizeHostname("app.localhost")).toBe("app.localhost");
    expect(normalizeHostname("app.localhost:3002")).toBe("app.localhost");
  });
});

describe("isSafeAppPath", () => {
  it("allows relative app paths", () => {
    expect(isSafeAppPath("/dashboard")).toBe(true);
  });

  it("rejects open redirects", () => {
    expect(isSafeAppPath("//evil.com")).toBe(false);
    expect(isSafeAppPath("https://evil.com")).toBe(false);
  });
});
