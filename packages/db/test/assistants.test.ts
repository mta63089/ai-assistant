import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAssistant } from '../src/assistants';
import { db } from '../src/client';
import { assistants, projects } from '../src/schema';

describe('DB Integration', () => {
  let testProjectId: string;
  let testAssistantId: string;
  beforeAll(async () => {
    const [project] = await db
      .insert(projects)
      .values({
        name: 'Test Project',
        description: 'Project for Assistant tests'
      })
      .returning();

    testProjectId = project.id;
  });

  afterAll(async () => {
    await db.delete(assistants).where(eq(assistants.projectId, testProjectId));
    await db.delete(projects).where(eq(projects.id, testProjectId));
  });

  it('should create an assistant', async () => {
    const [assistant] = await createAssistant({
      externalId: 'asst_123',
      name: 'HelperBot',
      description: 'A helpful assistant',
      instructions: 'Be helpful',
      model: 'gpt-4',
      projectId: testProjectId,
      tools: [{ type: 'code_interpreter' }]
    });

    expect(assistant).toBeDefined();
    expect(assistant.name).toBe('HelperBot');
    testAssistantId = assistant.id;
  });
});
