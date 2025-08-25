/*
  Warnings:

  - You are about to drop the column `user_id` on the `jwt_token` table. All the data in the column will be lost.
  - The `site` column on the `role` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[token_id]` on the table `jwt_token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token_id` to the `jwt_token` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "public"."Site" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."TokenKind" AS ENUM ('JWT', 'FCM');

-- CreateEnum
CREATE TYPE "public"."JwtType" AS ENUM ('ACCESS', 'REFRESH');

-- CreateEnum
CREATE TYPE "public"."Platform" AS ENUM ('ANDROID', 'IOS', 'WEB');

-- DropForeignKey
ALTER TABLE "base"."jwt_token" DROP CONSTRAINT "jwt_token_user_id_fkey";

-- DropIndex
DROP INDEX "base"."jwt_token_user_id_idx";

-- AlterTable
ALTER TABLE "base"."jwt_token" DROP COLUMN "user_id",
ADD COLUMN     "jwt_type" "public"."JwtType" NOT NULL DEFAULT 'ACCESS',
ADD COLUMN     "token_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "base"."role" DROP COLUMN "site",
ADD COLUMN     "site" "public"."Site" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "base"."user" DROP COLUMN "status",
ADD COLUMN     "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "base"."SiteType";

-- DropEnum
DROP TYPE "base"."UserStatus";

-- CreateTable
CREATE TABLE "base"."admin" (
    "id" SERIAL NOT NULL,
    "login_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "admin_id" INTEGER,
    "token_kind" "public"."TokenKind" NOT NULL DEFAULT 'JWT',
    "site" "public"."Site" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_login_id_key" ON "base"."admin"("login_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "base"."admin"("email");

-- CreateIndex
CREATE INDEX "token_site_user_id_idx" ON "base"."token"("site", "user_id");

-- CreateIndex
CREATE INDEX "token_site_admin_id_idx" ON "base"."token"("site", "admin_id");

-- CreateIndex
CREATE INDEX "token_token_kind_idx" ON "base"."token"("token_kind");

-- CreateIndex
CREATE UNIQUE INDEX "jwt_token_token_id_key" ON "base"."jwt_token"("token_id");

-- AddForeignKey
ALTER TABLE "base"."token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "base"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."token" ADD CONSTRAINT "token_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "base"."admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."jwt_token" ADD CONSTRAINT "jwt_token_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "base"."token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
