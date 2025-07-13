ALTER TABLE `blog` 
ADD COLUMN `ImagePath` varchar(255) DEFAULT NULL,
ADD COLUMN `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp();

-- Update existing rows to have a CreatedAt value
UPDATE `blog` SET `CreatedAt` = NOW() WHERE `CreatedAt` IS NULL; 