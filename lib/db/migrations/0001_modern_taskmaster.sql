CREATE TABLE IF NOT EXISTS "shopping_lists" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"week_period" interval NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shopping_products" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"shopping_list_id" varchar(256) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "supermarkets" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_products" ADD CONSTRAINT "shopping_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopping_products" ADD CONSTRAINT "shopping_products_shopping_list_id_shopping_lists_id_fk" FOREIGN KEY ("shopping_list_id") REFERENCES "shopping_lists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
