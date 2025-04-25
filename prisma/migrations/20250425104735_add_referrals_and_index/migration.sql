-- AlterTable
ALTER TABLE "ShortenedUrl" ADD COLUMN     "referrals" JSONB;

-- CreateIndex
CREATE INDEX "ShortenedUrl_shortCode_idx" ON "ShortenedUrl"("shortCode");
