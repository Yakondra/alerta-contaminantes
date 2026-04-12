# PLATAFORMA ALERTA CONTAMINANTES

Este es el proyecto sobre el registro y monitorización de contaminantes ambientales de Alexandra Castro Soplín.

## REQUISITOS PREVIOS

Para ejecutar el proyecto, solo necesitas una máquina con Docker y Docker Compose instalados.

## INSTALACIÓN

Para inicializar el proyecto, necesitas ejecutar el archivo Compose.yml en la raíz del proyecto, mediante el comando: 

`docker compose up -d`

## CONFIGURACIÓN

Para empezar a registrar valores, necesitas primero crear las tablas, entrando al contenedor de mariaDB, ejecutando el cliente SQL interno, y ejecutando las sentencias SQL del archivo db.sql en orden. Además, en el archivo se han incorporado 1 empresa y cliente de ejemplo para poder testar.