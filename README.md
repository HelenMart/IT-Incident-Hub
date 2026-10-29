# IT Incident Hub

## Descripcion

Este proyecto consiste en crear un sistema web para
registrar y dar seguimiento a incidentes de TI.

La idea es que los usuarios puedan reportar problemas
y que los tecnicos puedan atenderlos de forma organizada.

## Funciones

- Registrar incidentes
- Consultar incidentes
- Asignar tecnicos
- Cambiar estados
- Agregar comentarios
- Filtrar incidentes
- Mostrar estadisticas

## Tecnologias

- React y TypeScript
- Node.js y Express
- PostgreSQL
- Git y GitHub
- Azure DevOps
- Docker

## Tecnologías utilizadas

- Frontend: React y Vite.
- Backend: Node.js y Express.
- Base de datos: PostgreSQL.
- Contenedores: Docker.
- Control de versiones: Git y GitHub.
- Integración continua: GitHub Actions y Azure Pipelines.

## Funcionalidades

El sistema permite registrar, consultar, actualizar y eliminar incidentes de TI.

También incluye asignación de técnicos, seguimiento de estados,
comentarios, búsqueda, filtros y estadísticas.

## Pruebas

Se implementaron seis pruebas básicas para verificar la estructura
del backend y la presencia de las operaciones principales.

Ejecutar:

cd backend
node --test pruebas.test.js

## Integración continua

El proyecto utiliza GitHub Actions y Azure Pipelines para realizar
validaciones automáticas.

Se configuró un agente self-hosted llamado Helen-Agent,
perteneciente al grupo Default de Azure DevOps.

La ejecución #20261029.4 completó correctamente las tareas
de instalación, validación, auditoría de dependencias,
compilación de React y publicación del artefacto.

## Versión

v1.0.0 - Primera entrega estable del sistema.
