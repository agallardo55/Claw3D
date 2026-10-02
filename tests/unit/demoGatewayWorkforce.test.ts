import { describe, expect, it } from "vitest";

const { handleMethod } = await import("../../server/demo-gateway-adapter.js");

describe("demo gateway CMIG workforce", () => {
  it("exposes the CMIG bot roster with Donna as the default agent", async () => {
    const response = (await handleMethod("agents.list", {}, "agents", () => {})) as any;

    expect(response.ok).toBe(true);
    expect(response.payload.defaultId).toBe("donna-coordinator");
    expect(response.payload.agents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "donna-coordinator", name: "Donna", role: "CMIG Coordinator" }),
        expect.objectContaining({ id: "claude-ui", name: "Claude", role: "UI / Frontend" }),
        expect.objectContaining({ id: "codex-engineer", name: "Codex", role: "Engineering / Code" }),
        expect.objectContaining({ id: "jev-risk", name: "Jev", role: "Risk + Confidence Scoring" }),
        expect.objectContaining({ id: "hermes-orchestrator", name: "Hermes", role: "Workflow Orchestration" }),
        expect.objectContaining({ id: "dealeros-bot", name: "DealerOS", role: "GM Knowledge System" }),
        expect.objectContaining({ id: "vato-bot", name: "VatoBot", role: "Vehicle Appraisal" }),
        expect.objectContaining({ id: "listingtracker-bot", name: "ListingTracker", role: "Listing Intelligence" }),
        expect.objectContaining({ id: "salesboard-bot", name: "Salesboard", role: "Sales Performance" }),
      ]),
    );
    expect(response.payload.agents).toHaveLength(9);
  });

  it("returns a CMIG-specific greeting from the default agent", async () => {
    const response = (await handleMethod(
      "chat.send",
      { sessionKey: "agent:donna-coordinator:main", message: "hello", idempotencyKey: "test-run" },
      "chat",
      () => {},
    )) as any;

    expect(response.ok).toBe(true);
    expect(response.payload.status).toBe("started");
  });
});
