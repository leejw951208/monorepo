/*
  Warnings:

  - You are about to drop the column `site` on the `role` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Owner" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."TokenType" AS ENUM ('JWT', 'FCM');

-- AlterTable
ALTER TABLE "base"."role" DROP COLUMN "site",
ADD COLUMN     "owner" "public"."Owner" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "public"."Site";

-- CreateTable
CREATE TABLE "base"."token" (
    "id" SERIAL NOT NULL,
    "token_hash" TEXT NOT NULL,
    "token_type" "public"."TokenType" NOT NULL,
    "owner" "public"."Owner" NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."token_jwt" (
    "id" SERIAL NOT NULL,
    "token_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "token_jwt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_jwt_token_id_key" ON "base"."token_jwt"("token_id");

-- AddForeignKey
ALTER TABLE "base"."token_jwt" ADD CONSTRAINT "token_jwt_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "base"."token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
