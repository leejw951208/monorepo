-- DropForeignKey
ALTER TABLE "base"."token_jwt" DROP CONSTRAINT "token_jwt_token_id_fkey";

-- AddForeignKey
ALTER TABLE "base"."token_jwt" ADD CONSTRAINT "token_jwt_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "base"."token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
