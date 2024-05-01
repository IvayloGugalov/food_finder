CREATE TABLE IF NOT EXISTS "product_create_log" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"error_message" text,
	"product_name" varchar(256) NOT NULL,
	"product_price" real NOT NULL,
	"product_old_price" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_price_history_log" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"error_message" text,
	"product_id" varchar(256) NOT NULL,
	"product_week_day_start" timestamp NOT NULL,
	"product_week_day_end" timestamp NOT NULL,
	"product_price" real NOT NULL,
	"product_old_price" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
