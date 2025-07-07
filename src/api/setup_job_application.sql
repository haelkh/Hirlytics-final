-- SQL to set up the necessary database tables for job applications

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job_seeker table if it doesn't exist
CREATE TABLE IF NOT EXISTS `job_seeker` (
  `seeker_id` INT AUTO_INCREMENT PRIMARY KEY,
  `CurrentEmploymentStatus` VARCHAR(100),
  `SeekingPosition` VARCHAR(100),
  `InterestedIndustries` VARCHAR(255),
  `DesiredJobLocation` VARCHAR(100),
  `WorkLocationPreference` VARCHAR(50),
  `YearsExperience` VARCHAR(50),
  `Skills` TEXT,
  `Relocation` VARCHAR(10),
  `ExpectedSalary` VARCHAR(100),
  `AvailabilityToStart` VARCHAR(50),
  `CVUpload` VARCHAR(255),
  `Portfolio_Linkedin` VARCHAR(255),
  `AdditionalQuestions` TEXT,
  `user_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- Create notification table if it doesn't exist
CREATE TABLE IF NOT EXISTS `notification` (
  `notification_id` INT AUTO_INCREMENT PRIMARY KEY,
  `message` TEXT NOT NULL,
  `user_id` INT,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- Create job_application table for tracking applications to specific jobs
CREATE TABLE IF NOT EXISTS `job_application` (
  `application_id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT,
  `seeker_id` INT,
  `status` ENUM('Submitted', 'Under Review', 'Shortlisted', 'Rejected', 'Hired') DEFAULT 'Submitted',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`seeker_id`) REFERENCES `job_seeker`(`seeker_id`) ON DELETE CASCADE
);

-- Insert some test data
INSERT INTO `users` (`name`, `email`, `phone`) VALUES
('Test User', 'test@example.com', '1234567890'),
('Jane Smith', 'jane@example.com', '9876543210'); 