
CREATE TABLE `tallas_camisetas` (
  `id_talla` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `talla` varchar(35) NOT NULL,
  PRIMARY KEY (`id_talla`)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla user2daw_BD1-17.tallas_camisetas: ~6 rows
INSERT INTO `tallas_camisetas` (`id_talla`, `talla`) VALUES
  (1, 'Sin Camiseta'),
  (2, 'XS'),
  (3, 'S'),
  (4, 'M'),
  (5, 'L'),
  (6, 'XL');

-- Modificando la tabla user2daw_BD1-17.inscripciones para agregar la clave foránea
ALTER TABLE `inscripciones` 
ADD COLUMN `id_talla` tinyint unsigned NULL,
ADD CONSTRAINT `FK_inscripciones_tallas_camisetas` FOREIGN KEY (`id_talla`) REFERENCES `tallas_camisetas` (`id_talla`);


-- Eliminar la restricción de clave externa existente
ALTER TABLE `inscripciones`
DROP FOREIGN KEY `FK_inscripciones_tallas_camisetas`;

-- Crear una nueva restricción de clave externa que apunte a `id_talla`
ALTER TABLE `inscripciones`
ADD CONSTRAINT `FK_inscripciones_tallas_camisetas` FOREIGN KEY (`id_talla`) REFERENCES `id_talla` (`id_talla`);
