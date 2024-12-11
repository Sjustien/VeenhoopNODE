-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 11 dec 2024 om 10:28
-- Serverversie: 10.4.32-MariaDB
-- PHP-versie: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cijfers`
--

CREATE TABLE `cijfers` (
  `CijferID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL,
  `VakID` int(11) NOT NULL,
  `Blok` varchar(50) NOT NULL,
  `Cijfer` decimal(4,2) NOT NULL,
  `IngevoerdDoorDocentID` int(11) NOT NULL,
  `IngevoerdOp` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `cijfers`
--

INSERT INTO `cijfers` (`CijferID`, `StudentID`, `VakID`, `Blok`, `Cijfer`, `IngevoerdDoorDocentID`, `IngevoerdOp`) VALUES
(1, 1, 1, 'Blok 1', 7.50, 1, '2024-12-02 09:27:58'),
(3, 1, 1, '1', 7.60, 1, '2024-12-02 09:27:58'),
(6, 1, 1, '1', 7.60, 1, NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `docenten`
--

CREATE TABLE `docenten` (
  `DocentID` int(11) NOT NULL,
  `Tussenvoegsel` varchar(50) NOT NULL,
  `Wachtwoord` varchar(255) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Voornaam` varchar(100) DEFAULT NULL,
  `Vakgebied` varchar(100) DEFAULT NULL,
  `Telefoonnummer` varchar(15) DEFAULT NULL,
  `Achternaam` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `docenten`
--

INSERT INTO `docenten` (`DocentID`, `Tussenvoegsel`, `Wachtwoord`, `Email`, `Voornaam`, `Vakgebied`, `Telefoonnummer`, `Achternaam`) VALUES
(1, '', '', NULL, 'dikke', NULL, NULL, ''),
(2, 'docent2', 'hashedpassword123', 'mama', 'dikke', 'Nederlands', '0687654321', 'dikke'),
(3, 'dirk', 'test123', 'jandirK@gmail.com', 'Jan', 'Wiskunde', '0610508972', 'Snel'),
(4, 'lamma', '$2b$10$ZD8dXXaAbtyyTgDm7MHaE.nO1rWq7Ll74s3LoSR8sheJ2YIApsqlC', 'jandirK@gmail.scom', 'Jan', 'Wiskunde', '0610508972', 'Snel'),
(7, 'lammda', '$2b$10$7r28OLHdtLYCmLUw6NHZeuG1l8zET41keck8qnROPkoS/CQCX4SQ.', 'testdocent@test.com', 'adsd', 'Wiskunde', '0610508972', 'Sndel');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `klassen`
--

CREATE TABLE `klassen` (
  `KlasID` int(11) NOT NULL,
  `KlasNaam` varchar(50) NOT NULL,
  `Leerjaar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `klassen`
--

INSERT INTO `klassen` (`KlasID`, `KlasNaam`, `Leerjaar`) VALUES
(1, '3A', 3),
(2, '4B', 4),
(4, '4g', 3);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `logs`
--

CREATE TABLE `logs` (
  `LogID` int(11) NOT NULL,
  `Gebruikersnaam` varchar(50) NOT NULL,
  `Actie` varchar(255) NOT NULL,
  `Tijdstip` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `logs`
--

INSERT INTO `logs` (`LogID`, `Gebruikersnaam`, `Actie`, `Tijdstip`) VALUES
(1, 'docent1', 'Cijfers ingevoerd voor Wiskunde.', '2024-12-02 09:27:58'),
(2, 'docent2', 'Cijfers ingevoerd voor Nederlands.', '2024-12-02 09:27:58');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `notificaties`
--

CREATE TABLE `notificaties` (
  `NotificatieID` int(11) NOT NULL,
  `Gebruikersnaam` varchar(50) NOT NULL,
  `NotificatieTekst` varchar(255) NOT NULL,
  `Gelezen` tinyint(1) DEFAULT 0,
  `AangemaaktOp` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `notificaties`
--

INSERT INTO `notificaties` (`NotificatieID`, `Gebruikersnaam`, `NotificatieTekst`, `Gelezen`, `AangemaaktOp`) VALUES
(1, 'student1', 'Je cijfer voor Wiskunde is toegevoegd: 7.5', 0, '2024-12-02 09:27:58'),
(2, 'student2', 'Je cijfer voor Wiskunde is toegevoegd: 8.0', 0, '2024-12-02 09:27:58'),
(3, 'student3', 'Je cijfer voor Nederlands is toegevoegd: 6.5', 0, '2024-12-02 09:27:58');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `pivot__docentvakken`
--

CREATE TABLE `pivot__docentvakken` (
  `docent_id` int(11) NOT NULL,
  `vak_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `rollen`
--

CREATE TABLE `rollen` (
  `RolID` int(11) NOT NULL,
  `RolNaam` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `rollen`
--

INSERT INTO `rollen` (`RolID`, `RolNaam`) VALUES
(1, 'Docent'),
(2, 'Student');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `studenten`
--

CREATE TABLE `studenten` (
  `StudentID` int(11) NOT NULL,
  `Voornaam` varchar(50) NOT NULL,
  `Wachtwoord` varchar(255) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Achternaam` varchar(100) DEFAULT NULL,
  `Geboortedatum` date DEFAULT NULL,
  `Adres` varchar(255) DEFAULT NULL,
  `KlasID` int(11) NOT NULL,
  `Tussenvoegsel` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `studenten`
--

INSERT INTO `studenten` (`StudentID`, `Voornaam`, `Wachtwoord`, `Email`, `Achternaam`, `Geboortedatum`, `Adres`, `KlasID`, `Tussenvoegsel`) VALUES
(1, 'student1', 'hashedpassword123', 'student1@school.nl', 'Piet Pietersen', '2008-04-15', 'Straat 1, Stad', 1, '0'),
(2, 'student2', 'hashedpassword123', 'student2@school.nl', 'Anna Janssen', '2007-11-02', 'Straat 2, Stad', 1, '0'),
(3, 'student3', 'hashedpassword123', 'student3@school.nl', 'Tim de Jong', '2006-08-19', 'Straat 3, Stad', 2, '0'),
(5, 'studentennaam', 'Wachtoowrd', 'Example@example.com', 'Add your name in the body', '0000-00-00', 'diddys huis', 1, 'studentennaam'),
(7, 'draamnaam', '$2b$10$NW8i.dCxG4cUprdYSjxUzOXbAxDt7Fa1eDZbDOwhaQQaUAcQ/usYa', 'Example@example.com', 'boktor', '0000-00-00', 'diddys huis', 1, ''),
(8, 'test', '$2b$10$m5nZ2uOU1M9/AMNTvgE6wOKHJTsRQ2jS0dVEgKY1IdRoKJu1g6Sua', 'test@test.com', 'boktor', '0000-00-00', 'diddys huis', 1, ''),
(11, 'tesst', '$2b$10$0gw/felwZMXSM4iOzXlFSuC7NHivOX35XL5pYu6HpavnfF4tHeX4q', 'test@1.com', 'bosaktor', '0000-00-00', 'diddys huis', 1, '');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `vakken`
--

CREATE TABLE `vakken` (
  `VakID` int(11) NOT NULL,
  `VakNaam` varchar(50) NOT NULL,
  `DocentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `vakken`
--

INSERT INTO `vakken` (`VakID`, `VakNaam`, `DocentID`) VALUES
(1, 'Wiskunde', 1),
(2, 'Nederlands', 2);

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `cijfers`
--
ALTER TABLE `cijfers`
  ADD PRIMARY KEY (`CijferID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `VakID` (`VakID`),
  ADD KEY `IngevoerdDoorDocentID` (`IngevoerdDoorDocentID`);

--
-- Indexen voor tabel `docenten`
--
ALTER TABLE `docenten`
  ADD PRIMARY KEY (`DocentID`),
  ADD UNIQUE KEY `Gebruikersnaam` (`Tussenvoegsel`);

--
-- Indexen voor tabel `klassen`
--
ALTER TABLE `klassen`
  ADD PRIMARY KEY (`KlasID`);

--
-- Indexen voor tabel `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`LogID`);

--
-- Indexen voor tabel `notificaties`
--
ALTER TABLE `notificaties`
  ADD PRIMARY KEY (`NotificatieID`);

--
-- Indexen voor tabel `rollen`
--
ALTER TABLE `rollen`
  ADD PRIMARY KEY (`RolID`),
  ADD UNIQUE KEY `RolNaam` (`RolNaam`);

--
-- Indexen voor tabel `studenten`
--
ALTER TABLE `studenten`
  ADD PRIMARY KEY (`StudentID`),
  ADD UNIQUE KEY `Gebruikersnaam` (`Voornaam`),
  ADD KEY `KlasID` (`KlasID`);

--
-- Indexen voor tabel `vakken`
--
ALTER TABLE `vakken`
  ADD PRIMARY KEY (`VakID`),
  ADD KEY `DocentID` (`DocentID`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `cijfers`
--
ALTER TABLE `cijfers`
  MODIFY `CijferID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT voor een tabel `docenten`
--
ALTER TABLE `docenten`
  MODIFY `DocentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT voor een tabel `klassen`
--
ALTER TABLE `klassen`
  MODIFY `KlasID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT voor een tabel `logs`
--
ALTER TABLE `logs`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT voor een tabel `notificaties`
--
ALTER TABLE `notificaties`
  MODIFY `NotificatieID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT voor een tabel `rollen`
--
ALTER TABLE `rollen`
  MODIFY `RolID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT voor een tabel `studenten`
--
ALTER TABLE `studenten`
  MODIFY `StudentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT voor een tabel `vakken`
--
ALTER TABLE `vakken`
  MODIFY `VakID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `cijfers`
--
ALTER TABLE `cijfers`
  ADD CONSTRAINT `Cijfers_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `studenten` (`StudentID`),
  ADD CONSTRAINT `Cijfers_ibfk_2` FOREIGN KEY (`VakID`) REFERENCES `vakken` (`VakID`),
  ADD CONSTRAINT `Cijfers_ibfk_3` FOREIGN KEY (`IngevoerdDoorDocentID`) REFERENCES `docenten` (`DocentID`);

--
-- Beperkingen voor tabel `studenten`
--
ALTER TABLE `studenten`
  ADD CONSTRAINT `Studenten_ibfk_1` FOREIGN KEY (`KlasID`) REFERENCES `klassen` (`KlasID`);

--
-- Beperkingen voor tabel `vakken`
--
ALTER TABLE `vakken`
  ADD CONSTRAINT `Vakken_ibfk_1` FOREIGN KEY (`DocentID`) REFERENCES `docenten` (`DocentID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
