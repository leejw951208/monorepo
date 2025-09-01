/*
  Warnings:

  - You are about to drop the `token_jwt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "base"."token_jwt" DROP CONSTRAINT "token_jwt_token_id_fkey";

-- DropTable
DROP TABLE "base"."token_jwt";

-- DropEnum
DROP TYPE "public"."Client";

-- DropEnum
DROP TYPE "public"."JwtType";

-- CreateTable
CREATE TABLE "base"."token_fcm" (
    "id" SERIAL NOT NULL,
    "token_id" INTEGER NOT NULL,
    "platform" "public"."Platform" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "token_fcm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "base"."token_fcm" ADD CONSTRAINT "token_fcm_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "base"."token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
