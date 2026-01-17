-- AlterTable
ALTER TABLE "AppSession" ADD COLUMN     "serviceId" TEXT;

-- AddForeignKey
ALTER TABLE "AppSession" ADD CONSTRAINT "AppSession_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
