-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 06, 2026 at 08:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eureka`
--

-- --------------------------------------------------------

--
-- Table structure for table `buzzer`
--

CREATE TABLE `buzzer` (
  `id` bigint(20) NOT NULL,
  `player1_id` bigint(20) NOT NULL,
  `player2_id` bigint(20) DEFAULT NULL,
  `date_time` varchar(255) DEFAULT NULL,
  `current_question` int(11) DEFAULT NULL,
  `question_count` int(11) DEFAULT NULL,
  `secret_code` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `stream` varchar(255) DEFAULT NULL,
  `difficulty` varchar(255) DEFAULT NULL,
  `player1_score` int(11) DEFAULT NULL,
  `player2_score` int(11) DEFAULT NULL,
  `game_state` varchar(255) DEFAULT NULL,
  `player1score` int(11) DEFAULT NULL,
  `player2score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buzzer`
--

INSERT INTO `buzzer` (`id`, `player1_id`, `player2_id`, `date_time`, `current_question`, `question_count`, `secret_code`, `category`, `stream`, `difficulty`, `player1_score`, `player2_score`, `game_state`, `player1score`, `player2score`) VALUES
(1, 1, NULL, '2026-01-06 11:41 PM', 0, 10, 'Rl9wjgo7hb75hQKsJsGky-E=', 'Math', 'Science', 'Easy', NULL, NULL, 'ACTIVE', 0, 0),
(2, 1, 2, '2026-01-06 11:41 PM', 0, 10, 'ViHG_8eqTlfU837pO79Wo2g=', 'Math', 'Science', 'Easy', NULL, NULL, 'READY', 0, 0),
(3, 1, NULL, '2026-01-06 11:42 PM', 0, 10, 'FOv0C6ukedXsJhZhIcu8HOs=', 'Math', 'Science', 'Easy', NULL, NULL, 'ACTIVE', 0, 0),
(4, 1, NULL, '2026-01-06 11:50 PM', 0, 10, 'CY9bzurqCg9HnwAlzPoBc78=', 'Math', 'Science', 'Easy', NULL, NULL, 'ACTIVE', 0, 0),
(5, 1, NULL, '2026-01-06 11:50 PM', 0, 10, 'GRVhdOT2rUA7dUTwsfpFM_8=', 'Math', 'Science', 'Easy', NULL, NULL, 'ACTIVE', 0, 0),
(6, 1, NULL, '2026-01-06 11:50 PM', 0, 10, 'kGnJrWihEEgm2KAytz8cPLM=', 'Math', 'Science', 'Easy', NULL, NULL, 'ACTIVE', 0, 0),
(7, 1, NULL, '2026-01-06 11:50 PM', 0, 10, 'VYFOjShmEfmq_dX8OS2rqfw=', 'Math', 'Science', 'Easy', NULL, NULL, 'ACTIVE', 0, 0),
(8, 1, 2, '2026-01-07 12:04 AM', 1, 10, 'mw_sd2shcScK8g72urqRywo=', '%', 'Science', 'Easy', NULL, NULL, 'INACTIVE', 22, 0),
(9, 2, 1, '2026-01-07 12:13 AM', 1, 10, 'TGnCR65kX597cmvLFVHqRFI=', '%', 'Science', 'Easy', NULL, NULL, 'INACTIVE', 0, 17),
(10, 1, 2, '2026-01-07 12:57 AM', 4, 10, 'aqH2dKVYGqkjqE_M5268pII=', '%', 'Computer Science', 'Easy', NULL, NULL, 'INACTIVE', 64, 26),
(11, 1, 2, '2026-01-07 01:01 AM', 1, 10, 'E2AHbnGjIVx3WLnk0BEDqxA=', '%', 'Civil', 'Easy', NULL, NULL, 'IN_PROGRESS', 0, 0),
(12, 1, 2, '2026-01-07 01:03 AM', 3, 10, '7uEGU2YnEfxTue1wilYyuBE=', '%', 'Mechanical', 'Easy', NULL, NULL, 'INACTIVE', 42, 17);

-- --------------------------------------------------------

--
-- Table structure for table `buzzer_question`
--

CREATE TABLE `buzzer_question` (
  `buzzer_id` bigint(20) NOT NULL,
  `question_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buzzer_question`
--

INSERT INTO `buzzer_question` (`buzzer_id`, `question_id`) VALUES
(1, 3),
(2, 3),
(3, 3),
(4, 3),
(5, 3),
(6, 3),
(7, 3),
(8, 3),
(9, 3),
(10, 6),
(10, 12),
(10, 9),
(10, 5),
(11, 39),
(11, 41),
(11, 35),
(11, 40),
(12, 27),
(12, 30),
(12, 25);

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `id` bigint(20) NOT NULL,
  `text` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `stream` varchar(255) DEFAULT NULL,
  `difficulty` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`id`, `text`, `answer`, `category`, `stream`, `difficulty`) VALUES
(1, 'What is the capital of France?', 'Paris', 'Geography', 'General', 'Easy'),
(2, 'Who wrote Hamlet?', 'Shakespeare', 'Literature', 'Arts', 'Medium'),
(3, 'Value of Pi?', '3.14', 'Math', 'Science', 'Easy'),
(5, 'Which data structure follows LIFO principle?', 'Stack', 'Data Structures', 'Computer Science', 'Easy'),
(6, 'What does SQL stand for?', 'Structured Query Language', 'Databases', 'Computer Science', 'Easy'),
(7, 'Time complexity of binary search?', 'O(log n)', 'Algorithms', 'Computer Science', 'Medium'),
(8, 'Which protocol is used for secure web browsing?', 'HTTPS', 'Networking', 'Computer Science', 'Medium'),
(9, 'The main circuit board of a computer is called?', 'Motherboard', 'Hardware', 'Computer Science', 'Easy'),
(10, 'What represents a relation in RDBMS?', 'Table', 'Databases', 'Computer Science', 'Medium'),
(11, 'Which keyword makes a variable constant in Java?', 'final', 'Programming', 'Computer Science', 'Medium'),
(12, 'What is the binary equivalent of decimal 10?', '1010', 'Digital Logic', 'Computer Science', 'Easy'),
(13, 'Which layer describes the TCP/IP model?', '4 Layers', 'Networking', 'Computer Science', 'Hard'),
(14, 'What implies the concept of polymorphism?', 'Many Forms', 'OOP', 'Computer Science', 'Medium'),
(15, 'SI unit of electric charge?', 'Coulomb', 'Basic Physics', 'Electrical', 'Easy'),
(16, 'Which motor has the highest starting torque?', 'DC Series Motor', 'Machines', 'Electrical', 'Medium'),
(17, 'The knee voltage for a Silicon diode is approximately?', '0.7V', 'Electronics', 'Electrical', 'Easy'),
(18, 'Condition for maximum power transfer?', 'Load = Source', 'Network Theory', 'Electrical', 'Hard'),
(19, 'What measures the flow of current?', 'Ammeter', 'Instrumentation', 'Electrical', 'Easy'),
(20, 'Which device converts AC to DC?', 'Rectifier', 'Electronics', 'Electrical', 'Easy'),
(21, 'The reciprocal of resistance is called?', 'Conductance', 'Circuits', 'Electrical', 'Medium'),
(22, 'What is the frequency of DC supply?', '0Hz', 'Power Systems', 'Electrical', 'Easy'),
(23, 'Ideal internal resistance of a voltage source?', 'Zero', 'Circuits', 'Electrical', 'Medium'),
(24, 'Which loss occurs in a transformer core?', 'Hysteresis Loss', 'Machines', 'Electrical', 'Hard'),
(25, 'Newton\'s first law defines?', 'Inertia', 'Physics', 'Mechanical', 'Easy'),
(26, 'Ratio of lateral strain to linear strain?', 'Poisson Ratio', 'Materials', 'Mechanical', 'Medium'),
(27, 'The unit of Pressure is?', 'Pascal', 'Thermodynamics', 'Mechanical', 'Easy'),
(28, 'Carnot cycle consists of how many processes?', 'Four', 'Thermodynamics', 'Mechanical', 'Medium'),
(29, 'Which bearing is used for axial loads?', 'Thrust Bearing', 'Machine Design', 'Mechanical', 'Hard'),
(30, 'Product of mass and velocity is?', 'Momentum', 'Dynamics', 'Mechanical', 'Easy'),
(31, 'Main alloy in stainless steel besides iron?', 'Chromium', 'Materials', 'Mechanical', 'Medium'),
(32, 'What instrument measures fluid flow rate?', 'Venturimeter', 'Fluid Mechanics', 'Mechanical', 'Medium'),
(33, 'Zeroth Law of Thermodynamics deals with?', 'Temperature', 'Thermodynamics', 'Mechanical', 'Hard'),
(34, 'The ability of a material to deform without breaking?', 'Plasticity', 'Materials', 'Mechanical', 'Medium'),
(35, 'Main ingredient of concrete?', 'Cement', 'Materials', 'Civil', 'Easy'),
(36, 'Standard size of a modular brick?', '19x9x9 cm', 'Construction', 'Civil', 'Medium'),
(37, 'Instrument used for measuring angles?', 'Theodolite', 'Surveying', 'Civil', 'Medium'),
(38, 'Minimum grade of concrete for RCC?', 'M20', 'Concrete Tech', 'Civil', 'Medium'),
(39, 'What is a slump test used for?', 'Workability', 'Concrete Tech', 'Civil', 'Easy'),
(40, 'Force per unit area is called?', 'Stress', 'Structures', 'Civil', 'Easy'),
(41, 'The ratio of cement to sand in 1:3 mortar?', '1 to 3', 'Construction', 'Civil', 'Easy'),
(42, 'Specific gravity of standard cement?', '3.15', 'Materials', 'Civil', 'Hard'),
(43, 'Contour lines cross each other in case of?', 'Overhanging Cliff', 'Surveying', 'Civil', 'Hard'),
(44, 'Bending moment at a hinge is always?', 'Zero', 'Structure Analysis', 'Civil', 'Medium');

-- --------------------------------------------------------

--
-- Table structure for table `question_options`
--

CREATE TABLE `question_options` (
  `question_id` bigint(20) NOT NULL,
  `options` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question_options`
--

INSERT INTO `question_options` (`question_id`, `options`) VALUES
(1, 'London'),
(1, 'Paris'),
(1, 'Berlin'),
(1, 'Madrid'),
(2, 'Shakespeare'),
(2, 'Dickens'),
(2, 'Austen'),
(2, 'Hemingway'),
(3, '3.14'),
(3, '2.14'),
(3, '3.41'),
(3, '3.15'),
(5, 'Queue'),
(5, 'Stack'),
(5, 'Array'),
(5, 'Linked List'),
(6, 'Structured Question Language'),
(6, 'Structured Query Language'),
(6, 'Simple Query Language'),
(6, 'System Query Language'),
(7, 'O(n)'),
(7, 'O(n^2)'),
(7, 'O(log n)'),
(7, 'O(1)'),
(8, 'HTTP'),
(8, 'FTP'),
(8, 'HTTPS'),
(8, 'SMTP'),
(9, 'Motherboard'),
(9, 'CPU'),
(9, 'RAM'),
(9, 'Hard Drive'),
(10, 'Row'),
(10, 'Column'),
(10, 'Table'),
(10, 'Key'),
(11, 'static'),
(11, 'volatile'),
(11, 'final'),
(11, 'abstract'),
(12, '1001'),
(12, '1010'),
(12, '1100'),
(12, '1011'),
(13, '7 Layers'),
(13, '5 Layers'),
(13, '4 Layers'),
(13, '6 Layers'),
(14, 'Many Forms'),
(14, 'Data Hiding'),
(14, 'Inheritance'),
(14, 'Encapsulation'),
(15, 'Ampere'),
(15, 'Volt'),
(15, 'Coulomb'),
(15, 'Ohm'),
(16, 'Induction Motor'),
(16, 'DC Series Motor'),
(16, 'Shunt Motor'),
(16, 'Synchronous Motor'),
(17, '0.3V'),
(17, '0.7V'),
(17, '1.2V'),
(17, '0.5V'),
(18, 'Load > Source'),
(18, 'Load < Source'),
(18, 'Load = Source'),
(18, 'Load = 0'),
(19, 'Voltmeter'),
(19, 'Ammeter'),
(19, 'Ohmmeter'),
(19, 'Wattmeter'),
(20, 'Inverter'),
(20, 'Transformer'),
(20, 'Rectifier'),
(20, 'Amplifier'),
(21, 'Inductance'),
(21, 'Conductance'),
(21, 'Impedance'),
(21, 'Reactance'),
(22, '50Hz'),
(22, '60Hz'),
(22, '100Hz'),
(22, '0Hz'),
(23, 'Infinity'),
(23, 'Zero'),
(23, '100 Ohms'),
(23, '1 Mega Ohm'),
(24, 'Friction Loss'),
(24, 'Windage Loss'),
(24, 'Hysteresis Loss'),
(24, 'Copper Loss'),
(25, 'Force'),
(25, 'Inertia'),
(25, 'Momentum'),
(25, 'Energy'),
(26, 'Young Modulus'),
(26, 'Bulk Modulus'),
(26, 'Poisson Ratio'),
(26, 'Shear Modulus'),
(27, 'Joule'),
(27, 'Newton'),
(27, 'Pascal'),
(27, 'Watt'),
(28, 'Two'),
(28, 'Three'),
(28, 'Four'),
(28, 'Five'),
(29, 'Journal Bearing'),
(29, 'Thrust Bearing'),
(29, 'Needle Bearing'),
(29, 'Sleeve Bearing'),
(30, 'Force'),
(30, 'Work'),
(30, 'Power'),
(30, 'Momentum'),
(31, 'Copper'),
(31, 'Zinc'),
(31, 'Chromium'),
(31, 'Lead'),
(32, 'Manometer'),
(32, 'Barometer'),
(32, 'Venturimeter'),
(32, 'Thermometer'),
(33, 'Entropy'),
(33, 'Enthalpy'),
(33, 'Temperature'),
(33, 'Internal Energy'),
(34, 'Hardness'),
(34, 'Brittleness'),
(34, 'Plasticity'),
(34, 'Elasticity'),
(35, 'Wood'),
(35, 'Bitumen'),
(35, 'Cement'),
(35, 'Steel'),
(36, '19x9x9 cm'),
(36, '20x10x10 cm'),
(36, '22x11x7 cm'),
(36, '23x11x7 cm'),
(37, 'Dumpy Level'),
(37, 'Theodolite'),
(37, 'Chain'),
(37, 'Plumb Bob'),
(38, 'M10'),
(38, 'M15'),
(38, 'M20'),
(38, 'M25'),
(39, 'Strength'),
(39, 'Workability'),
(39, 'Durability'),
(39, 'Density'),
(40, 'Strain'),
(40, 'Stress'),
(40, 'Modulus'),
(40, 'Torque'),
(41, '1 to 3'),
(41, '3 to 1'),
(41, '1 to 4'),
(41, '1 to 2'),
(42, '2.50'),
(42, '3.15'),
(42, '2.15'),
(42, '1.50'),
(43, 'Hill'),
(43, 'Valley'),
(43, 'Ridge'),
(43, 'Overhanging Cliff'),
(44, 'Maximum'),
(44, 'Minimum'),
(44, 'Zero'),
(44, 'Infinite');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `graduation_year` bigint(20) DEFAULT NULL,
  `institute` varchar(255) DEFAULT NULL,
  `stream` varchar(255) DEFAULT NULL,
  `ratings` int(11) DEFAULT 1200,
  `brain_coins` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `name`, `profession`, `graduation_year`, `institute`, `stream`, `ratings`, `brain_coins`) VALUES
(1, 'mahir817', '12345678', 'Mahir Ahmed', 'Student', 2025, 'United International University ', 'CSE', 1272, 100),
(2, 'alice', 'password123', 'Alice Wonderland', 'Student', 2024, 'Science Institute', 'Physics', 1178, 50);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buzzer`
--
ALTER TABLE `buzzer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `player1_id` (`player1_id`),
  ADD KEY `player2_id` (`player2_id`);

--
-- Indexes for table `buzzer_question`
--
ALTER TABLE `buzzer_question`
  ADD KEY `buzzer_id` (`buzzer_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question_options`
--
ALTER TABLE `question_options`
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buzzer`
--
ALTER TABLE `buzzer`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `buzzer`
--
ALTER TABLE `buzzer`
  ADD CONSTRAINT `buzzer_ibfk_1` FOREIGN KEY (`player1_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `buzzer_ibfk_2` FOREIGN KEY (`player2_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `buzzer_question`
--
ALTER TABLE `buzzer_question`
  ADD CONSTRAINT `buzzer_question_ibfk_1` FOREIGN KEY (`buzzer_id`) REFERENCES `buzzer` (`id`),
  ADD CONSTRAINT `buzzer_question_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`);

--
-- Constraints for table `question_options`
--
ALTER TABLE `question_options`
  ADD CONSTRAINT `question_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
