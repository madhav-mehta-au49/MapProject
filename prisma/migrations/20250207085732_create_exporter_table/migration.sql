/*
  Warnings:

  - Added the required column `quantity_mt` to the `Exporter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Exporter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exporter" ADD COLUMN     "quantity_mt" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
