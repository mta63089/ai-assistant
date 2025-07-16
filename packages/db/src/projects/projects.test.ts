import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db } from '../client';
import { projects } from '../schema';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject
} from './';

describe('Projects DB Queries', () => {
  let testProjectId: string;
  const testProjectData = {
    name: 'Test Project',
    description: 'Project for testing'
  };

  beforeAll(async () => {
    const [created] = await createProject(testProjectData);
    testProjectId = created.id;
  });

  afterAll(async () => {
    await db.delete(projects).where(eq(projects.id, testProjectId));
  });

  it('should create a project', async () => {
    const [project] = await createProject({
      name: 'Another Project',
      description: 'Another test project'
    });
    expect(project.id).toBeDefined();
    expect(project.name).toBe('Another Project');
    expect(project.description).toBe('Another test project');
    await deleteProject(project.id);
  });

  it('should get project by id', async () => {
    const [found] = await getProjectById(testProjectId);
    expect(found).toBeDefined();
    expect(found?.name).toBe(testProjectData.name);
  });

  it('should return undefined for non-existent id', async () => {
    const [found] = await getProjectById(
      '11111111-1111-1111-1111-111111111111'
    );
    expect(found).toBeUndefined();
  });

  it('should return all projects (at least one)', async () => {
    const all = await getAllProjects();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  it('should update a project', async () => {
    const [updated] = await updateProject(testProjectId, {
      name: 'Updated Name'
    });
    expect(updated.name).toBe('Updated Name');
  });

  it('should return undefined when updating nonexistent project', async () => {
    const [updated] = await updateProject(
      '11111111-1111-1111-1111-111111111111',
      {
        name: 'Should not update'
      }
    );
    expect(updated).toBeUndefined();
  });

  it('should delete a project', async () => {
    const [created] = await createProject({
      name: 'To Be Deleted',
      description: 'This will be deleted'
    });
    const [deleted] = await deleteProject(created.id);
    expect(deleted.id).toBe(created.id);

    const [check] = await getProjectById(created.id);
    expect(check).toBeUndefined();
  });

  it('should return undefined when deleting non-existent project', async () => {
    const [deleted] = await deleteProject(
      '11111111-1111-1111-1111-111111111111'
    );
    expect(deleted).toBeUndefined();
  });
});
