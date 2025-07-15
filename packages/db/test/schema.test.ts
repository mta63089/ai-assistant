import { beforeAll, describe, expect, it } from "vitest";
import { db } from "../src/client";
import { assistants, projects } from "../src/schema";

describe("DB Schema", () => {
  let projectId: string;

  beforeAll(async () => {
    const result = await db
      .insert(projects)
      .values({
        name: "Test Project",
        description: "Integration test project",
      })
      .returning();

    projectId = result[0].id;
  });

  it("should insert and query an assistant", async () => {
    const inserted = await db
      .insert(assistants)
      .values({
        externalId: "asst_test",
        projectId,
        name: "Test Assistant",
        description: "An assistant used in tests",
        instructions: "Just be helpful.",
        model: "gpt-4",
      })
      .returning();

    const found = await db.query.assistants.findFirst({
      where: (a, { eq }) => eq(a.id, inserted[0].id),
    });

    expect(found?.name).toBe("Test Assistant");
  });
});
