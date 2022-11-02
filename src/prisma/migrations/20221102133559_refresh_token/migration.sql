-- CreateTable
CREATE TABLE "UserTokens" (
    "user_id" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expire_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTokens_pkey" PRIMARY KEY ("user_id","refresh_token")
);

-- AddForeignKey
ALTER TABLE "UserTokens" ADD CONSTRAINT "UserTokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
