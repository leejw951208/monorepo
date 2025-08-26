/*
  Warnings:

  - You are about to drop the column `role_id` on the `permission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "base"."permission" DROP CONSTRAINT "permission_role_id_fkey";

-- AlterTable
ALTER TABLE "base"."permission" DROP COLUMN "role_id";
