CREATE TABLE clasificaciones (
    id_clasificacion INT AUTO_INCREMENT PRIMARY KEY,
    dorsal INT,
    tiempo TIME NOT NULL,
    ritmo TIME NOT NULL,
    id_categoria INT NOT NULL,
    masculino INT NULL,
    femenino INT NULL,
    general INT NULL
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE clasificaciones
ADD CONSTRAINT fk_dorsal FOREIGN KEY (dorsal) REFERENCES inscripciones(dorsal);

ALTER TABLE clasificaciones
ADD CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria);
