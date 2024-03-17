CREATE TABLE IF NOT EXISTS "product_price_history" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"week_day_start" timestamp DEFAULT now() NOT NULL,
	"week_day_end" timestamp DEFAULT now() NOT NULL,
	"price" real NOT NULL,
	"old_price" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_price_history_product_id_week_day_start_week_day_end_unique" UNIQUE("product_id","week_day_start","week_day_end")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_price_history" ADD CONSTRAINT "product_price_history_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
