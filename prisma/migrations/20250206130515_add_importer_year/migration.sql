/*
  Warnings:

  - Added the required column `latitude` to the `Importer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Importer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_mt` to the `Importer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Importer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Importer" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity_mt" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
