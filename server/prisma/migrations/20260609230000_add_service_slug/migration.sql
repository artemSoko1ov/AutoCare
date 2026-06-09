ALTER TABLE "Service"
ADD COLUMN "slug" TEXT;

UPDATE "Service"
SET "slug" = 'service-' || substring(md5(lower(btrim("title")) || '|' || lower(btrim("category"))) from 1 for 16)
WHERE "slug" IS NULL;

ALTER TABLE "Service"
ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
