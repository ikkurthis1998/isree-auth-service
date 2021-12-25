/*
  Warnings:

  - You are about to drop the column `companyId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `businessId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Application` DROP COLUMN `companyId`,
    ADD COLUMN `businessId` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` ENUM('DASHBOARD', 'WEB', 'MOBILE') NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `companyId`,
    ADD COLUMN `businessId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Company`;

-- CreateTable
CREATE TABLE `Business` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `token` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,

    UNIQUE INDEX `Business_code_key`(`code`),
    UNIQUE INDEX `Business_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
