// packages/db/src/projects.ts
import { eq } from 'drizzle-orm';
import { db } from '../client';
import { projects } from '../schema';

type CreateProjectInput = {
  name: string;
  description?: string;
};

export async function createProject(data: CreateProjectInput) {
  return db.insert(projects).values(data).returning();
}

export async function getProjectById(id: string) {
  return db.select().from(projects).where(eq(projects.id, id));
}

export async function getAllProjects() {
  return db.select().from(projects);
}

export async function updateProject(
  id: string,
  updates: Partial<{ name: string; description: string }>
) {
  return db
    .update(projects)
    .set(updates)
    .where(eq(projects.id, id))
    .returning();
}

export async function deleteProject(id: string) {
  return db.delete(projects).where(eq(projects.id, id)).returning();
}
