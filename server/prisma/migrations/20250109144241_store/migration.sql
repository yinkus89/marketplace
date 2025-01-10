/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
-- Create Enum Type for Role
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER', 'VENDOR');

-- Alter Customer Table to Remove Default for updatedAt
ALTER TABLE "Customer" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- Alter Order Table to Remove Default for updatedAt
ALTER TABLE "Order" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- Alter Product Table to Remove Default for updatedAt
ALTER TABLE "Product" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- Alter User Table:
-- - Remove existing primary key constraint on "id"
-- - Add new "createdAt", "role", and "updatedAt" columns
-- - Drop old "id" column and add a new "id" column as SERIAL
-- - Set the new "id" as the primary key
ALTER TABLE "User" 
  DROP CONSTRAINT "User_pkey", -- Drop the old primary key constraint
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL,
  DROP COLUMN "id", -- Drop the old "id" column
  ADD COLUMN "id" SERIAL NOT NULL, -- Add a new "id" column with SERIAL
  ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id"); -- Set the new "id" as primary key
