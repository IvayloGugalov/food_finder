DROP INDEX IF EXISTS "product_name_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_name_idx" ON "products" ("name","supermarket_id");