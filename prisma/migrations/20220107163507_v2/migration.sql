/*
  Warnings:

  - You are about to drop the column `token` on the `Business` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Business_token_key` ON `Business`;

-- AlterTable
ALTER TABLE `Business` DROP COLUMN `token`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `lastSignin` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `Activity` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('CUSTOM', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'CREATE_BUSINESS', 'UPDATE_BUSINESS', 'DELETE_BUSINESS', 'CREATE_APPLICATION', 'UPDATE_APPLICATION', 'DELETE_APPLICATION') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `data` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
