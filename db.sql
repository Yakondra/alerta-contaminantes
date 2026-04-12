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
    fecha DATE NOT NULL,
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