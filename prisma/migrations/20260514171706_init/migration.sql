-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isCode" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);
