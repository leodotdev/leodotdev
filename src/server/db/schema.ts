// D1 schema for the site's content, edited at /admin. Nested lists (project
// images, paragraphs, categories) are JSON columns: they are always read and
// written whole with their row, so separate tables would buy nothing.
import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import type { Img } from "@/lib/image"

export type ProjectImage = { key: string; image: Img; alt?: string }

const updatedAt = () =>
  integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  client: text("client").notNull().default(""),
  year: text("year").notNull().default(""),
  categories: text("categories", { mode: "json" })
    .$type<Array<string>>()
    .notNull()
    .default(sql`'[]'`),
  description: text("description"),
  image: text("image", { mode: "json" }).$type<Img>(),
  url: text("url"),
  embed: text("embed"),
  images: text("images", { mode: "json" })
    .$type<Array<ProjectImage>>()
    .notNull()
    .default(sql`'[]'`),
  paragraphs: text("paragraphs", { mode: "json" })
    .$type<Array<string>>()
    .notNull()
    .default(sql`'[]'`),
  // Tie-breaker within a year (the list is ordered by year, newest first).
  sort: integer("sort").notNull().default(0),
  updatedAt: updatedAt(),
})

export const experiences = sqliteTable("experiences", {
  id: text("id").primaryKey(),
  sort: integer("sort").notNull().default(0),
  logo: text("logo").notNull().default(""),
  company: text("company").notNull(),
  companyUrl: text("company_url"),
  position: text("position").notNull().default(""),
  location: text("location").notNull().default(""),
  duration: text("duration").notNull().default(""),
  displayName: text("display_name"),
  altCompany: text("alt_company"),
  altCompanyUrl: text("alt_company_url"),
  team: text("team"),
  contract: integer("contract", { mode: "boolean" }).notNull().default(false),
  project: text("project"),
  projectUrl: text("project_url"),
  projectCompany: text("project_company"),
  projectCompanyUrl: text("project_company_url"),
  roundLogo: integer("round_logo", { mode: "boolean" }).notNull().default(false),
  updatedAt: updatedAt(),
})

export const references = sqliteTable("references", {
  id: text("id").primaryKey(),
  sort: integer("sort").notNull().default(0),
  name: text("name").notNull(),
  title: text("title").notNull().default(""),
  company: text("company").notNull().default(""),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  initials: text("initials").notNull().default(""),
  quote: text("quote").notNull().default(""),
  updatedAt: updatedAt(),
})

export const books = sqliteTable("books", {
  id: text("id").primaryKey(),
  sort: integer("sort").notNull().default(0),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  author: text("author").notNull().default(""),
  year: text("year").notNull().default(""),
  url: text("url"),
  image: text("image", { mode: "json" }).$type<Img>(),
  updatedAt: updatedAt(),
})

export type Project = typeof projects.$inferSelect
export type Experience = typeof experiences.$inferSelect
export type Reference = typeof references.$inferSelect
export type Book = typeof books.$inferSelect
