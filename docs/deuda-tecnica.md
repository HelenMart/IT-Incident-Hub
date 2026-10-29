\# Registro de deuda técnica — IT Incident Hub



Este documento presenta las principales limitaciones técnicas identificadas durante el desarrollo del sistema de gestión de incidentes.



| ID | Deuda técnica | Estado | Acción |

|---|---|---|---|

| DT-01 | El proyecto no contaba inicialmente con pruebas automáticas del backend. | Resuelta | Se incorporaron seis pruebas automáticas. |

| DT-02 | El proceso de compilación y validación dependía inicialmente de ejecuciones manuales. | Resuelta | Se configuraron GitHub Actions y Azure Pipelines. |

| DT-03 | La aplicación todavía no cuenta con un sistema completo de autenticación y roles. | Pendiente | Incorporar inicio de sesión y permisos por usuario. |

| DT-04 | El registro de cambios de estado todavía puede mejorarse con un historial de auditoría. | Pendiente | Registrar quién realizó cada modificación y cuándo. |

| DT-05 | El sistema necesita ampliar sus pruebas de integración con PostgreSQL. | Pendiente | Incorporar pruebas que validen las operaciones contra una base de datos de prueba. |



\## Seguimiento



Se identificaron cinco deudas técnicas. Dos fueron atendidas durante el desarrollo mediante la incorporación de pruebas automáticas y la automatización del proceso de integración continua.



Las tres restantes se consideran oportunidades de mejora para futuras versiones del proyecto.

