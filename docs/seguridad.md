\# Seguridad — IT Incident Hub



\## Gestión de credenciales



Las contraseñas, tokens y claves de acceso no deben publicarse en GitHub.



La configuración sensible debe mantenerse fuera del control de versiones y administrarse mediante variables de entorno o mecanismos de secretos protegidos.



\## Dependencias



Se utiliza `npm audit` para identificar vulnerabilidades conocidas en las dependencias del backend.



Se incorporó el archivo `backend/verificar-seguridad.cmd` para facilitar esta revisión.



\## Validaciones



El proyecto utiliza comprobaciones automáticas mediante GitHub Actions y Azure Pipelines.



\## Recomendaciones



\- Mantener las dependencias actualizadas.

\- Revisar periódicamente los resultados de seguridad.

\- Evitar incluir credenciales en capturas y documentación.

\- Aplicar controles de acceso adecuados antes de publicar el sistema en producción.

