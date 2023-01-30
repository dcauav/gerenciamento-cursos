-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 30-Jan-2023 às 23:54
-- Versão do servidor: 10.4.24-MariaDB
-- versão do PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `grc_cursos`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbl_course`
--

CREATE TABLE `tbl_course` (
  `id_Cour` int(11) NOT NULL,
  `name_Cour` varchar(100) NOT NULL,
  `teacher_CourFK` int(11) NOT NULL,
  `category_Cour` varchar(40) NOT NULL,
  `desc_Cour` varchar(256) NOT NULL,
  `image_Cour` text DEFAULT NULL,
  `active_Cour` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `tbl_course`
--

INSERT INTO `tbl_course` (`id_Cour`, `name_Cour`, `teacher_CourFK`, `category_Cour`, `desc_Cour`, `image_Cour`, `active_Cour`) VALUES
(10, 'Desenvolvimento de Sistemas', 1, 'Técnico', 'Curso focado em desenvolvimento de sistemas e nas diversas áreas que o compõem.', '/assets/img/cursos/desenvolvimento_de_sistemas_2023/desenvolvimento_de_sistemas.jpg', 1),
(11, 'Desenvolvedor Flutter', 1, 'Profissionalizante', 'Curso de desenvolvimento mobile com Flutter.', '/assets/img/cursos/desenvolvedor_flutter_2023/desenvolvedor_flutter.jpg', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id_User` int(11) NOT NULL,
  `name_User` varchar(60) NOT NULL,
  `email_User` text NOT NULL,
  `password_User` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `tbl_users`
--

INSERT INTO `tbl_users` (`id_User`, `name_User`, `email_User`, `password_User`) VALUES
(1, 'Professor Teste', 'professor@teste.com', '$2b$10$4RQoSNsyGm9aeNJgNalc0.3p2FlBebNfllSc0UAbe2SKVRboR0v7u');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `tbl_course`
--
ALTER TABLE `tbl_course`
  ADD PRIMARY KEY (`id_Cour`),
  ADD KEY `fkteacher_Cour` (`teacher_CourFK`);

--
-- Índices para tabela `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id_User`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tbl_course`
--
ALTER TABLE `tbl_course`
  MODIFY `id_Cour` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id_User` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `tbl_course`
--
ALTER TABLE `tbl_course`
  ADD CONSTRAINT `tbl_course_ibfk_1` FOREIGN KEY (`teacher_CourFK`) REFERENCES `tbl_users` (`id_User`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
