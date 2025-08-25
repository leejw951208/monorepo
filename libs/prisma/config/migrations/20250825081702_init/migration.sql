/*
  Warnings:

  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[scope,action]` on the table `permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,role_id]` on the table `user_role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "base"."token" DROP CONSTRAINT "token_user_id_fkey";

-- DropIndex
DROP INDEX "base"."permission_role_id_idx";

-- DropIndex
DROP INDEX "base"."user_role_role_id_idx";

-- DropIndex
DROP INDEX "base"."user_role_user_id_idx";

-- DropIndex
DROP INDEX "base"."user_role_user_id_key";

-- DropTable
DROP TABLE "base"."token";

-- CreateTable
CREATE TABLE "base"."jwt_token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "jwt_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."role_permission" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jwt_token_user_id_idx" ON "base"."jwt_token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_role_id_permission_id_key" ON "base"."role_permission"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_scope_action_key" ON "base"."permission"("scope", "action");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_user_id_role_id_key" ON "base"."user_role"("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "base"."jwt_token" ADD CONSTRAINT "jwt_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "base"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "base"."role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "base"."permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
