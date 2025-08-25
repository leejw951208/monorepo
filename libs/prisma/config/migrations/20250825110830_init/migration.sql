/*
  Warnings:

  - You are about to drop the column `token_id` on the `jwt_token` table. All the data in the column will be lost.
  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "base"."jwt_token" DROP CONSTRAINT "jwt_token_token_id_fkey";

-- DropForeignKey
ALTER TABLE "base"."token" DROP CONSTRAINT "token_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "base"."token" DROP CONSTRAINT "token_user_id_fkey";

-- DropIndex
DROP INDEX "base"."jwt_token_token_id_key";

-- AlterTable
ALTER TABLE "base"."jwt_token" DROP COLUMN "token_id",
ADD COLUMN     "admin_id" INTEGER,
ADD COLUMN     "site" "public"."Site" NOT NULL DEFAULT 'ADMIN',
ADD COLUMN     "user_id" INTEGER;

-- DropTable
DROP TABLE "base"."token";

-- DropEnum
DROP TYPE "public"."TokenKind";

-- CreateTable
CREATE TABLE "base"."admin_role" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "admin_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_role_admin_id_role_id_key" ON "base"."admin_role"("admin_id", "role_id");

-- CreateIndex
CREATE INDEX "jwt_token_site_user_id_idx" ON "base"."jwt_token"("site", "user_id");

-- CreateIndex
CREATE INDEX "jwt_token_site_admin_id_idx" ON "base"."jwt_token"("site", "admin_id");

-- CreateIndex
CREATE INDEX "jwt_token_jwt_type_idx" ON "base"."jwt_token"("jwt_type");

-- AddForeignKey
ALTER TABLE "base"."admin_role" ADD CONSTRAINT "admin_role_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "base"."admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."admin_role" ADD CONSTRAINT "admin_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "base"."role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."jwt_token" ADD CONSTRAINT "jwt_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "base"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."jwt_token" ADD CONSTRAINT "jwt_token_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "base"."admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
