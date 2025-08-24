CREATE TABLE "counterItem" (
	"id" text PRIMARY KEY NOT NULL,
	"counterId" text NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"value" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "counterItem" ADD CONSTRAINT "counterItem_counterId_counter_id_fk" FOREIGN KEY ("counterId") REFERENCES "public"."counter"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counterItem" ADD CONSTRAINT "counterItem_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;