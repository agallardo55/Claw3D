// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { resolveStudioProxyGatewayUrl } from "@/lib/gateway/proxy-url";

describe("resolveStudioProxyGatewayUrl", () => {
  it("uses loopback gateway URLs directly so the demo backend can connect", () => {
    expect(resolveStudioProxyGatewayUrl("ws://localhost:18789")).toBe("ws://localhost:18789");
    expect(resolveStudioProxyGatewayUrl("ws://127.0.0.1:18789")).toBe("ws://127.0.0.1:18789");
  });

  it("uses the Studio proxy for remote gateway URLs", () => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const expected = `${protocol}://${window.location.host}/api/gateway/ws`;

    expect(resolveStudioProxyGatewayUrl("wss://gateway.example.com/ws")).toBe(expected);
  });
});
