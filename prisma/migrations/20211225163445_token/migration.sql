/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Application` ADD COLUMN `token` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Application_token_key` ON `Application`(`token`);
