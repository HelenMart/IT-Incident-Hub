\# Arquitectura del sistema — IT Incident Hub



\## Descripción



IT Incident Hub es una aplicación web para registrar, consultar y administrar incidentes de tecnología.



\## Componentes principales



\*\*Frontend:\*\* desarrollado con React y Vite. Permite visualizar los incidentes, utilizar formularios, aplicar filtros y consultar estadísticas.



\*\*Backend:\*\* desarrollado con Node.js y Express. Proporciona una API REST para gestionar la información de los incidentes.



\*\*Base de datos:\*\* PostgreSQL, ejecutado mediante Docker. Almacena la información utilizada por la aplicación.



\## Flujo de funcionamiento



Usuario → Frontend React → API REST Express → PostgreSQL



El usuario realiza una operación desde el navegador. El frontend envía la solicitud al backend, que procesa la información y consulta o actualiza la base de datos.



\## Automatización



El proyecto utiliza GitHub Actions para las comprobaciones automáticas y Azure Pipelines para ejecutar validaciones, compilar el frontend y publicar artefactos.



También cuenta con un agente autohospedado llamado Helen-Agent.

