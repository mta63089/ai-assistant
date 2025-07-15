import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';

// ─── Projects ─────────────────────────────
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export type ProjectsSelect = InferSelectModel<typeof projects>;
export type ProjectsInsert = InferInsertModel<typeof projects>;

// ─── Assistants ───────────────────────────
export const assistants = pgTable('assistants', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: varchar('external_id', { length: 255 }).notNull(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  instructions: text('instructions'),
  model: varchar('model', { length: 64 }).notNull(),
  tools: jsonb('tools').$type<object[]>(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export type AssistantsSelect = InferSelectModel<typeof assistants>;
export type AssistantsInsert = InferInsertModel<typeof assistants>;

// ─── Threads ──────────────────────────────
export const threads = pgTable('threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: varchar('external_id', { length: 255 }).notNull(),
  assistantId: uuid('assistant_id')
    .notNull()
    .references(() => assistants.id),
  title: varchar('title', { length: 255 }),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export type ThreadsSelect = InferSelectModel<typeof threads>;
export type ThreadsInsert = InferInsertModel<typeof threads>;

// ─── Messages ─────────────────────────────
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id')
    .notNull()
    .references(() => threads.id),
  role: varchar('role', { length: 32 }).notNull(), // user | assistant | function
  content: text('content').notNull(),
  name: varchar('name', { length: 255 }),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export type MessagesSelect = InferSelectModel<typeof messages>;
export type MessagesInsert = InferInsertModel<typeof messages>;

// ─── Functions ────────────────────────────
export const functions = pgTable('functions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assistantId: uuid('assistant_id')
    .notNull()
    .references(() => assistants.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  parameters: jsonb('parameters').notNull(), // JSON Schema
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export type FunctionsSelect = InferSelectModel<typeof functions>;
export type FunctionsInsert = InferInsertModel<typeof functions>;

// ─── Runs ─────────────────────────────────
export const runs = pgTable('runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: varchar('external_id', { length: 255 }).notNull(),
  threadId: uuid('thread_id')
    .notNull()
    .references(() => threads.id),
  assistantId: uuid('assistant_id')
    .notNull()
    .references(() => assistants.id),
  status: varchar('status', { length: 64 }).notNull(), // queued, in_progress, completed
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export type RunsSelect = InferSelectModel<typeof runs>;
export type RunsInsert = InferInsertModel<typeof runs>;
