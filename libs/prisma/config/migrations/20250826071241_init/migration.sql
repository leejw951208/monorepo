/*
  Warnings:

  - You are about to drop the `jwt_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "base"."jwt_token" DROP CONSTRAINT "jwt_token_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "base"."jwt_token" DROP CONSTRAINT "jwt_token_user_id_fkey";

-- DropTable
DROP TABLE "base"."jwt_token";
