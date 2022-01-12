/*
  Warnings:

  - The values [CREATE_USER,UPDATE_USER,DELETE_USER] on the enum `Activity_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Activity` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `type` ENUM('CUSTOM', 'CREATE_BUSINESS_USER', 'UPDATE_BUSINESS_USER', 'DELETE_BUSINESS_USER', 'CREATE_BUSINESS', 'UPDATE_BUSINESS', 'DELETE_BUSINESS', 'CREATE_APPLICATION', 'UPDATE_APPLICATION', 'DELETE_APPLICATION') NOT NULL;

-- AlterTable
ALTER TABLE `Application` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Business` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `UserRole` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Invite` (
    `id` VARCHAR(191) NOT NULL,
    `inviteType` ENUM('BUSINESS', 'USER') NOT NULL,
    `role` ENUM('ADMIN', 'DEVELOPER', 'MARKETING', 'OPERATIONS', 'SUPPLYCHAIN', 'USER') NOT NULL,
    `businessId` VARCHAR(191) NOT NULL,
    `applicationId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `inviteStatus` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `inviteExpiry` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invite_email_key`(`email`),
    UNIQUE INDEX `Invite_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
