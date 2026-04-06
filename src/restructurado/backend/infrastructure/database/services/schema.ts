import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password_hash: text('password_hash').notNull(),
    username: varchar('username', { length: 50 }).unique().notNull(),
    full_name: varchar('full_name', { length: 100 }),
    is_verified: boolean('is_verified').default(false),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
    last_login: timestamp('last_login'),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    usernameIdx: index('username_idx').on(table.username),
  })
);

export const sessions = pgTable(
  'sessions',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    session_token: varchar('session_token', { length: 255 })
      .unique()
      .notNull(),
    expires_at: timestamp('expires_at').notNull(),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    userIdx: index('session_user_idx').on(table.user_id),
    tokenIdx: index('session_token_idx').on(table.session_token),
  })
);

export const action_logs = pgTable(
  'action_logs',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' }),
    action_type: varchar('action_type', { length: 100 }).notNull(),
    action_details: text('action_details'),
    ip_address: varchar('ip_address', { length: 45 }),
    user_agent: text('user_agent'),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    userIdx: index('log_user_idx').on(table.user_id),
    typeIdx: index('log_type_idx').on(table.action_type),
    dateIdx: index('log_date_idx').on(table.created_at),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  logs: many(action_logs),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.user_id], references: [users.id] }),
}));

export const logsRelations = relations(action_logs, ({ one }) => ({
  user: one(users, {
    fields: [action_logs.user_id],
    references: [users.id],
  }),
}));

export const pokemon_collection = pgTable(
  'pokemon_collection',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    pokemon_id: integer('pokemon_id').notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    type: varchar('type', { length: 100 }),
    image_url: text('image_url').notNull(),
    weight: integer('weight'),
    height: integer('height'),
    stats_json: text('stats_json'), // Store {hp, attack, defense} as JSON string
    captured_at: timestamp('captured_at').defaultNow(),
  },
  (table) => ({
    userIdx: index('pokemon_user_idx').on(table.user_id),
  })
);

export const pokemonRelations = relations(pokemon_collection, ({ one }) => ({
  user: one(users, {
    fields: [pokemon_collection.user_id],
    references: [users.id],
  }),
}));
