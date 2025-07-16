import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createAssistant,
  deleteAssistant,
  deleteAssistantsWithProjectId,
  getAssistantById,
  getAssistantsByProjectId,
  updateAssistant
} from '.';
import { db } from '../client';
import { assistants, AssistantsInsert, projects } from '../schema';

describe('Assistants DB Queries', () => {
  let testProjectId: string;
  let testAssistantId: string;
  let testAssistantData: AssistantsInsert;

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
    testAssistantData = {
      externalId: 'asst_123',
      name: 'HelperBot',
      description: 'A helpful assistant',
      instructions: 'Be helpful',
      model: 'gpt-4',
      projectId: testProjectId,
      tools: [{ type: 'code_interpreter' }]
    };
    const [assistant] = await createAssistant(testAssistantData);

    expect(assistant).toBeDefined();
    expect(assistant.createdAt).toBeDefined();
    expect(assistant.metadata).toBeDefined();
    expect(assistant.name).toBe(testAssistantData.name);
    expect(assistant.externalId).toEqual(testAssistantData.externalId);
    testAssistantId = assistant.id;
  });

  it('should select assistant from id', async () => {
    const [assistant] = await getAssistantById(testAssistantId);
    expect(assistant.id).to.eq(testAssistantId);
    expect(assistant.name).to.eq(testAssistantData.name);
    expect(assistant.description).to.eq(testAssistantData.description);
  });

  it('should get assistants by project id', async () => {
    const assistants = await getAssistantsByProjectId(testProjectId);
    expect(assistants.length).toBeGreaterThan(0);
    expect(assistants[0].projectId).toBe(testProjectId);
  });

  it('should update an assistant', async () => {
    const [updated] = await updateAssistant(testAssistantId, {
      name: 'UpdatedBot'
    });
    expect(updated.name).toBe('UpdatedBot');
  });

  it('should return null when updating non-existent assistant', async () => {
    const [result] = await updateAssistant(
      '11111111-1111-1111-1111-111111111111',
      {
        name: "Doesn't Matter"
      }
    );

    expect(result).toBeUndefined();
  });

  it('should delete an assistant', async () => {
    const [deleted] = await deleteAssistant(testAssistantId);
    expect(deleted.id).toBe(testAssistantId);

    const [check] = await getAssistantById(testAssistantId);
    expect(check).toBeUndefined();
  });

  it('should return null when deleting non-existent assistant', async () => {
    const [deleted] = await deleteAssistant(
      '11111111-1111-1111-1111-111111111111'
    );
    expect(deleted).toBeUndefined();
  });

  it('should handle long instructions and metadata', async () => {
    const longText = 'A'.repeat(10000);
    testAssistantData = {
      externalId: 'asst_long',
      name: 'LongBot',
      description: longText,
      instructions: longText,
      model: 'gpt-4',
      projectId: testProjectId,
      tools: [{ type: 'retrieval' }]
    };
    const [assistant] = await createAssistant(testAssistantData);

    expect(assistant.instructions).toHaveLength(10000);
    expect(assistant.description).toHaveLength(10000);
    expect(assistant.externalId).to.eq(testAssistantData.externalId);
    expect(assistant.name).to.eq(testAssistantData.name);
    await deleteAssistant(assistant.id);
  });

  (it('should delete all assistants with given project id'),
    async () => {
      let data;
      const testAssistant1: AssistantsInsert = {
        externalId: 'asst_projiddelete',
        name: 'Thing 1',
        description: 'Thing 1 is a thing',
        instructions: 'You are thing 1, the cat in the hats sidekick',
        model: 'gpt-4o',
        projectId: testProjectId,
        tools: [{ type: 'retrieval' }]
      };

      const testAssistant2: AssistantsInsert = {
        externalId: 'asst_projiddelete',
        name: 'Thing 2',
        description: 'Thing 2 is a thing',
        instructions: 'You are thing 2, the cat in the hats sidekick',
        model: 'gpt-4o',
        projectId: testProjectId,
        tools: [{ type: 'retrieval' }]
      };

      const [thing1] = await createAssistant(testAssistant1);
      const [thing2] = await createAssistant(testAssistant2);

      // Check if we can find our assistants
      [data] = await getAssistantById(thing1.id);
      expect(data.name).to.eq(thing1.name);

      [data] = await getAssistantById(thing2.id);
      expect(data.name).to.eq(thing2.name);

      // delete assistants
      await deleteAssistantsWithProjectId(testProjectId);

      // Make sure assistants no longer exist
      [data] = await getAssistantById(thing1.id);
      expect(data).toBeUndefined();

      [data] = await getAssistantById(thing2.id);
      expect(data).toBeUndefined();
    });
});
