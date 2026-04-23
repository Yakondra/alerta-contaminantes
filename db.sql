mysql -u yak -p

USE contaminantes;

CREATE TABLE IF NOT EXISTS empresas (
    nombre_empresa VARCHAR(100) PRIMARY KEY
);


CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    empresa VARCHAR(100) NOT NULL,
    
    FOREIGN KEY (empresa) REFERENCES empresas(nombre_empresa) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mediciones (
    id_medicion INT AUTO_INCREMENT PRIMARY KEY, 
    empresa VARCHAR(100) NOT NULL,
    fecha DATETIME NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    contaminante VARCHAR(50) NOT NULL,
    tipo_area ENUM('Urbana', 'Rural', 'Suburbana') NOT NULL,
    tipo_estacion ENUM('Tráfico', 'Fondo', 'Industrial') NOT NULL,
    valor_contaminante DECIMAL(10, 2) NOT NULL,
    resultados VARCHAR(50) NOT NULL,
    
    FOREIGN KEY (empresa) REFERENCES empresas(nombre_empresa) ON DELETE CASCADE
);

INSERT INTO empresas (nombre_empresa) VALUES ('Weezing');

INSERT INTO usuarios (id_usuario, password, empresa) VALUES ('ditto', '1234', 'Weezing');

INSERT INTO mediciones (empresa, fecha, municipio, contaminante, tipo_area, tipo_estacion, valor_contaminante, resultados) VALUES

('Weezing', '2026-04-21 08:00:00', 'MADRID', 'NO2', 'Urbana', 'Tráfico', 45.20, 'NORMAL'),
('Weezing', '2026-04-21 09:30:00', 'MADRID', 'O3', 'Urbana', 'Fondo', 120.50, 'ALTO'),
('Weezing', '2026-04-21 12:00:00', 'ALCOBENDAS', 'SO2', 'Suburbana', 'Industrial', 8.15, 'BAJO'),
('Weezing', '2026-04-21 15:45:00', 'GETAFE', 'CO', 'Urbana', 'Tráfico', 0.85, 'BAJO'),
('Weezing', '2026-04-21 20:00:00', 'MADRID', 'NO2', 'Urbana', 'Tráfico', 65.00, 'ALTO'),

('Weezing', '2026-04-22 07:15:00', 'ALCALÁ DE HENARES', 'NO2', 'Rural', 'Fondo', 12.30, 'BAJO'),
('Weezing', '2026-04-22 10:00:00', 'ALCALÁ DE HENARES', 'PM10', 'Rural', 'Fondo', 25.00, 'NORMAL'),
('Weezing', '2026-04-22 14:30:00', 'MÓSTOLES', 'O3', 'Urbana', 'Tráfico', 95.40, 'NORMAL'),
('Weezing', '2026-04-22 18:00:00', 'MÓSTOLES', 'NO2', 'Urbana', 'Tráfico', 30.20, 'NORMAL'),
('Weezing', '2026-04-22 23:45:00', 'GETAFE', 'SO2', 'Suburbana', 'Industrial', 15.60, 'NORMAL'),

('Weezing', '2026-04-23 07:00:00', 'MADRID', 'NO2', 'Urbana', 'Tráfico', 80.00, 'ALTO'),
('Weezing', '2026-04-23 08:30:00', 'MADRID', 'PM10', 'Urbana', 'Tráfico', 45.10, 'NORMAL'),
('Weezing', '2026-04-23 10:15:00', 'ALCORCÓN', 'CO', 'Urbana', 'Fondo', 0.40, 'BAJO'),
('Weezing', '2026-04-23 11:30:00', 'ALCORCÓN', 'NO2', 'Urbana', 'Fondo', 22.00, 'BAJO'),
('Weezing', '2026-04-23 12:05:00', 'MADRID', 'O3', 'Urbana', 'Tráfico', 55.20, 'BAJO');