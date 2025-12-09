/*
  Warnings:

  - A unique constraint covering the columns `[documentId]` on the table `Case` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentId` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "documentId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Case_documentId_key" ON "Case"("documentId");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
