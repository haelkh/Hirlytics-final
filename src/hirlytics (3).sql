-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2025 at 11:11 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hirlytics`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `Appointment_ID` int(11) NOT NULL,
  `User_ID` int(11) DEFAULT NULL,
  `Appointment_DateTime` datetime DEFAULT NULL,
  `Appointment_Type` varchar(255) DEFAULT NULL,
  `Appointment_Status` varchar(50) DEFAULT NULL,
  `Notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog`
--

CREATE TABLE `blog` (
  `BlogID` int(11) NOT NULL,
  `BlogPublisherID` int(11) DEFAULT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Body` text DEFAULT NULL,
  `Genre` varchar(100) DEFAULT NULL,
  `BriefBody` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `CompanyID` int(11) NOT NULL,
  `CompanyName` varchar(255) DEFAULT NULL,
  `CompanySize` varchar(50) DEFAULT NULL,
  `ContactPerson` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `CompanyLocationCity` varchar(100) DEFAULT NULL,
  `CompanyLocationState` varchar(100) DEFAULT NULL,
  `CompanyLocationCountry` varchar(100) DEFAULT NULL,
  `CompanyAddress` varchar(255) DEFAULT NULL,
  `Website` varchar(255) DEFAULT NULL,
  `date_joined` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companyapplication`
--

CREATE TABLE `companyapplication` (
  `ID` int(11) NOT NULL,
  `CompanyID` int(11) DEFAULT NULL,
  `JobTitle` varchar(255) DEFAULT NULL,
  `JobType` varchar(255) DEFAULT NULL,
  `ExperienceRequired` varchar(255) DEFAULT NULL,
  `SalaryMin` decimal(10,2) DEFAULT NULL,
  `SalaryMax` decimal(10,2) DEFAULT NULL,
  `ContractType` varchar(255) DEFAULT NULL,
  `AdditionalCompensation` text DEFAULT NULL,
  `Benefits` text DEFAULT NULL,
  `JobLocationCity` varchar(255) DEFAULT NULL,
  `JobLocationState` varchar(255) DEFAULT NULL,
  `JobLocationCountry` varchar(255) DEFAULT NULL,
  `JobLocation` varchar(255) DEFAULT NULL,
  `HiresRequired` int(11) DEFAULT NULL,
  `Urgency` varchar(255) DEFAULT NULL,
  `AdditionalDetails` text DEFAULT NULL,
  `FullyRemote` tinyint(1) DEFAULT NULL,
  `FullJobDescription` text DEFAULT NULL,
  `SeeVideoInterviews` tinyint(1) DEFAULT NULL,
  `VideoCalling` tinyint(1) DEFAULT NULL,
  `EmailContact` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `CountryID` int(11) NOT NULL,
  `CountryName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `EventID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `StartDate` date NOT NULL,
  `StartTime` time NOT NULL,
  `EndDate` date NOT NULL,
  `EndTime` time NOT NULL,
  `MeetingLink` varchar(500) DEFAULT NULL,
  `HostedBy` varchar(255) DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_application`
--

CREATE TABLE `job_application` (
  `ApplicationId` int(11) NOT NULL,
  `JobSeekerID` int(11) DEFAULT NULL,
  `JobID` int(11) DEFAULT NULL,
  `ApplicationDate` date DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_application`
--

INSERT INTO `job_application` (`ApplicationId`, `JobSeekerID`, `JobID`, `ApplicationDate`, `Status`) VALUES
(1, 1, 1, '2025-04-05', 'pending'),
(2, 2, 1, '2025-04-06', 'pending'),
(3, 3, 1, '2025-04-07', 'under review'),
(4, 4, 1, '2025-04-08', 'pending'),
(5, 5, 1, '2025-04-09', 'under review'),
(6, 1, 2, '2025-04-10', 'pending'),
(7, 3, 2, '2025-04-11', 'under review'),
(8, 4, 2, '2025-04-12', 'pending'),
(9, 2, 3, '2025-04-13', 'pending'),
(10, 5, 3, '2025-04-14', 'under review'),
(11, 1, 4, '2025-04-15', 'pending'),
(12, 3, 5, '2025-04-16', 'pending'),
(13, 4, 5, '2025-04-17', 'under review'),
(14, 2, 6, '2025-04-18', 'pending'),
(15, 5, 7, '2025-04-19', 'under review'),
(16, 1, 7, '2025-04-20', 'pending'),
(17, 3, 7, '2025-04-21', 'under review'),
(18, 4, 8, '2025-04-22', 'pending'),
(19, 2, 9, '2025-04-23', 'pending'),
(20, 5, 10, '2025-04-24', 'under review'),
(21, 1, 10, '2025-04-25', 'pending'),
(22, 3, 10, '2025-04-26', 'under review'),
(23, 4, 1, '2025-04-27', 'pending'),
(24, 2, 1, '2025-04-28', 'under review'),
(25, 5, 2, '2025-04-29', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `job_board`
--

CREATE TABLE `job_board` (
  `ID` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `JobTitle` varchar(255) DEFAULT NULL,
  `JobType` varchar(100) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date_posted` date DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_board`
--

INSERT INTO `job_board` (`ID`, `image`, `JobTitle`, `JobType`, `expiry_date`, `status`, `description`, `date_posted`, `country_id`) VALUES
(1, '', 'Senior Software Developer', 'Full-time', '2025-07-30', 'active', 'We are looking for an experienced software developer with 5+ years of experience in web development.', '2025-04-01', 1),
(2, '', 'Marketing Manager', 'Full-time', '2025-06-25', 'active', 'Looking for a marketing professional with experience in digital marketing campaigns and team management.', '2025-04-05', 1),
(3, '', 'Data Analyst', 'Part-time', '2025-06-15', 'active', 'Seeking a skilled data analyst to help with market research and customer insights.', '2025-04-10', 2),
(4, '', 'Administrative Assistant', 'Contract', '2025-05-30', 'active', 'Administrative support needed for a busy office environment.', '2025-04-12', 1),
(5, '', 'Graphic Designer', 'Freelance', '2025-07-15', 'active', 'Creative designer needed for branding and marketing materials.', '2025-04-15', 3),
(6, '', 'Customer Service Representative', 'Full-time', '2025-06-10', 'active', 'Customer-focused individual needed to handle inquiries and resolve issues.', '2025-04-18', 2),
(7, '', 'Sales Associate', 'Full-time', '2025-07-01', 'active', 'Enthusiastic sales professional needed to drive business growth.', '2025-04-20', 1),
(8, '', 'Web Designer', 'Contract', '2025-06-30', 'active', 'Creative web designer needed for multiple projects.', '2025-04-22', 2),
(9, '', 'HR Specialist', 'Part-time', '2025-06-20', 'active', 'HR professional needed to assist with recruitment and employee relations.', '2025-04-25', 3),
(10, '', 'Project Manager', 'Full-time', '2025-07-31', 'active', 'Experienced project manager to lead cross-functional teams and deliver successful projects.', '2025-04-28', 1);

-- --------------------------------------------------------

--
-- Table structure for table `job_seeker`
--

CREATE TABLE `job_seeker` (
  `JOBSeekerID` int(11) NOT NULL,
  `CurrentEmploymentStatus` varchar(255) DEFAULT NULL,
  `SeekingPosition` varchar(255) DEFAULT NULL,
  `InterestedIndustries` varchar(255) DEFAULT NULL,
  `DesiredJobLocation` varchar(255) DEFAULT NULL,
  `WorkLocationPreference` varchar(255) DEFAULT NULL,
  `YearsExperience` decimal(3,1) DEFAULT NULL,
  `Skills` text DEFAULT NULL,
  `Relocation` tinyint(1) DEFAULT NULL,
  `ExpectedSalary` decimal(10,2) DEFAULT NULL,
  `AvailabilityToStart` date DEFAULT NULL,
  `CVUpload` varchar(255) DEFAULT NULL,
  `Portfolio_Linkedin` varchar(255) DEFAULT NULL,
  `AdditionalQuestions` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date_created` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_seeker`
--

INSERT INTO `job_seeker` (`JOBSeekerID`, `CurrentEmploymentStatus`, `SeekingPosition`, `InterestedIndustries`, `DesiredJobLocation`, `WorkLocationPreference`, `YearsExperience`, `Skills`, `Relocation`, `ExpectedSalary`, `AvailabilityToStart`, `CVUpload`, `Portfolio_Linkedin`, `AdditionalQuestions`, `user_id`, `date_created`) VALUES
(1, 'Employed', 'Part-time', 'Healthcare,Education,Finance,Other', 'Maxime culpa consec', 'Hybrid', 6.0, 'Ut ipsum enim ut ex', 0, 0.00, '0000-00-00', '', 'In praesentium est ', 'Rerum id aut accusa', NULL, NULL),
(2, 'Freelancer', 'Part-time', 'Healthcare,Education', 'Ipsum maxime culpa d', 'Hybrid', 0.0, 'Voluptatem Beatae l', 0, 0.00, '0000-00-00', '', 'Aliqua Voluptas nih', 'Quia fugiat vitae ut', NULL, NULL),
(3, 'Freelancer', 'Part-time', 'Healthcare,Education', 'Ipsum maxime culpa d', 'Hybrid', 0.0, 'Voluptatem Beatae l', 0, 0.00, '0000-00-00', '', 'Aliqua Voluptas nih', 'Quia fugiat vitae ut', NULL, NULL),
(4, 'Freelancer', 'Part-time', 'Healthcare,Education', 'Ipsum maxime culpa d', 'Hybrid', 0.0, 'Voluptatem Beatae l', 0, 0.00, '0000-00-00', '', 'Aliqua Voluptas nih', 'Quia fugiat vitae ut', NULL, NULL),
(5, 'Freelancer', 'Part-time', 'Healthcare,Education', 'Ipsum maxime culpa d', 'Hybrid', 0.0, 'Voluptatem Beatae l', 0, 0.00, '0000-00-00', '', 'Aliqua Voluptas nih', 'Quia fugiat vitae ut', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subs`
--

CREATE TABLE `newsletter_subs` (
  `subscription_id` int(11) NOT NULL,
  `newsletter_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subscription_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `ID` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`ID`, `message`, `created_at`) VALUES
(1, 'Your job application for the position of Part-time has been successfully submitted.', '2025-05-01 18:14:14');

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `Id` int(11) NOT NULL,
  `TeamMemberName` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `LinkedIn_profile` varchar(255) DEFAULT NULL,
  `date_registered` datetime DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `Email_address` varchar(255) DEFAULT NULL,
  `account_status` varchar(50) DEFAULT NULL,
  `Full_Name` varchar(255) DEFAULT NULL,
  `token_expiry` datetime DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `google_id`, `avatar_url`, `reset_token`, `last_login`, `LinkedIn_profile`, `date_registered`, `phone_number`, `Email_address`, `account_status`, `Full_Name`, `token_expiry`, `password`, `role`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'zicy@mailinator.com', NULL, 'Dana Watkins', NULL, '$2y$10$JVOYvNi6C8mzRAfgNuINpu3K4QmNs07dggbhYEyjkt593TqnGI1wu', 'admin'),
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'cudu@mailinator.com', NULL, 'Aretha Mitchell', NULL, '$2y$10$zsp8ruZVeDhFz/XdJvw3Z.QeblHQ8T6BcoCZUx.UgU6n/6YPVuTxC', 'user'),
(3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'togole@mailinator.com', NULL, 'Daquan Fleming', NULL, '$2y$10$9xewVC8BNalfC5uU.dq2ruG8CA9lMAmuGM8DiCJeU./D/OdAFrPoi', 'user'),
(4, NULL, NULL, NULL, '2025-05-01 15:08:09', NULL, '2025-05-01 15:08:09', NULL, 'nylivyla@mailinator.com', NULL, 'Shannon Fox', NULL, '$2y$10$e5zL8dGikDGiyIN0jMIV1.udeGa86hYq8S4tFfWb5V5pzuXrF2TXm', 'user'),
(5, NULL, NULL, NULL, '2025-05-01 15:08:56', NULL, '2025-05-01 15:08:56', NULL, 'cuzogyf@mailinator.com', NULL, 'Hasad Weber', NULL, '$2y$10$tn4zpcZaC3Mw5xrJVkr33Oe5RKRN.45ZD4U.yLHXQzLdei2T5sSpK', 'user'),
(6, NULL, NULL, NULL, '2025-05-01 15:14:33', NULL, '2025-05-01 15:14:33', NULL, 'byxireh@mailinator.com', NULL, 'Charity English', NULL, '$2y$10$1XfqDRUBI4goKSOUmGr6c.EHckaFBALtGdbOYTYjtR5RRwd4zOoSK', 'user'),
(7, NULL, NULL, NULL, '2025-05-01 15:28:48', NULL, '2025-05-01 15:28:48', NULL, 'jizatoc@mailinator.com', NULL, 'Jael Mccarthy', NULL, '$2y$10$oGNejMDIhyC9dwvSQdpPWOgxX9aq8LcNj6kQ9L0VpZXLOnzjxyB8y', 'user'),
(8, NULL, NULL, NULL, '2025-05-09 13:02:38', NULL, '2025-05-09 13:02:38', NULL, 'testuser@example.com', NULL, 'Test User', NULL, '$2y$10$mtzQizaNK.GSxo3g7g37sOFWvdBAMMqr4qE.aazMtOKP9ZlqMAkDa', 'user'),
(9, NULL, NULL, NULL, '2025-05-09 13:16:28', NULL, '2025-05-09 13:16:28', NULL, 'testuser3@example.com', NULL, 'Test User', NULL, '$2y$10$pVw2Xt5KfaHiDfnpLteZZO.w.Wc9BXIDwTq9jjL4DlSocTDO9dLgK', 'user'),
(10, NULL, NULL, NULL, '2025-05-09 13:45:29', NULL, '2025-05-09 13:45:29', NULL, 'testuser2@example.com', NULL, 'Test User', NULL, '$2y$10$OqCT.E7DVab4DhV/W5OFT.YpKugpsp71bnxyzbmlE9EdRaRstq.9e', 'user'),
(11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'testuser5@example.com', NULL, 'Test User', NULL, '$2y$10$BFeJ/K9b7UTJZZPpwOMFMe8k98JXtC6R74PoiSrOdX1lDBcXgadL6', 'user'),
(12, NULL, NULL, NULL, '2025-05-15 22:37:33', NULL, '2025-05-15 22:37:33', NULL, 'elkhatibhassan42@gmail.com', NULL, 'hassan elkhatib', NULL, '$2y$10$3hYQfzLor5XvYWDITFbVZugDX7FITIMy9oVu.Lqh8GUN.rBLb7HLS', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`Appointment_ID`);

--
-- Indexes for table `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`BlogID`),
  ADD KEY `IX_Blog_BlogPublisherID` (`BlogPublisherID`),
  ADD KEY `IX_Blog_Genre` (`Genre`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`CompanyID`);

--
-- Indexes for table `companyapplication`
--
ALTER TABLE `companyapplication`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`CountryID`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`EventID`);

--
-- Indexes for table `job_application`
--
ALTER TABLE `job_application`
  ADD PRIMARY KEY (`ApplicationId`),
  ADD KEY `idx_JobSeekerID` (`JobSeekerID`),
  ADD KEY `idx_JobID` (`JobID`);

--
-- Indexes for table `job_board`
--
ALTER TABLE `job_board`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `job_seeker`
--
ALTER TABLE `job_seeker`
  ADD PRIMARY KEY (`JOBSeekerID`),
  ADD KEY `idx_SeekingPosition` (`SeekingPosition`),
  ADD KEY `idx_InterestedIndustries` (`InterestedIndustries`),
  ADD KEY `idx_DesiredJobLocation` (`DesiredJobLocation`),
  ADD KEY `fk_job_seeker_user` (`user_id`);

--
-- Indexes for table `newsletter_subs`
--
ALTER TABLE `newsletter_subs`
  ADD PRIMARY KEY (`subscription_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `google_id` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `EventID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_seeker`
--
ALTER TABLE `job_seeker`
  MODIFY `JOBSeekerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `newsletter_subs`
--
ALTER TABLE `newsletter_subs`
  MODIFY `subscription_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `job_seeker`
--
ALTER TABLE `job_seeker`
  ADD CONSTRAINT `fk_job_seeker_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
