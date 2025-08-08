ALTER TABLE "counter" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "counter" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;