import { eq } from 'drizzle-orm';
import { db } from '../client';
import { assistants, AssistantsInsert } from '../schema';

export async function createAssistant(data: AssistantsInsert) {
  return await db.insert(assistants).values(data).returning();
}

export async function getAssistantById(id: string) {
  return db.select().from(assistants).where(eq(assistants.id, id)).limit(1);
}

export async function getAssistantsByProjectId(projectId: string) {
  return db
    .select()
    .from(assistants)
    .where(eq(assistants.projectId, projectId));
}

export async function updateAssistant(
  id: string,
  data: Partial<AssistantsInsert>
) {
  return db
    .update(assistants)
    .set(data)
    .where(eq(assistants.id, id))
    .returning();
}

export async function deleteAssistant(id: string) {
  return db.delete(assistants).where(eq(assistants.id, id)).returning();
}

export async function deleteAssistantsWithProjectId(projectId: string) {
  return await db
    .delete(assistants)
    .where(eq(assistants.projectId, projectId))
    .returning();
}
