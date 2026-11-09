CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`author` text DEFAULT '' NOT NULL,
	`year` text DEFAULT '' NOT NULL,
	`url` text,
	`image` text,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`logo` text DEFAULT '' NOT NULL,
	`company` text NOT NULL,
	`company_url` text,
	`position` text DEFAULT '' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`duration` text DEFAULT '' NOT NULL,
	`display_name` text,
	`alt_company` text,
	`alt_company_url` text,
	`team` text,
	`contract` integer DEFAULT false NOT NULL,
	`project` text,
	`project_url` text,
	`project_company` text,
	`project_company_url` text,
	`round_logo` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`client` text DEFAULT '' NOT NULL,
	`year` text DEFAULT '' NOT NULL,
	`categories` text DEFAULT '[]' NOT NULL,
	`description` text,
	`image` text,
	`url` text,
	`embed` text,
	`images` text DEFAULT '[]' NOT NULL,
	`paragraphs` text DEFAULT '[]' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE TABLE `references` (
	`id` text PRIMARY KEY NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`linkedin_url` text DEFAULT '' NOT NULL,
	`initials` text DEFAULT '' NOT NULL,
	`quote` text DEFAULT '' NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
