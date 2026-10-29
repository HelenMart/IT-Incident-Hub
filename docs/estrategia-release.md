\# Estrategia de lanzamiento — IT Incident Hub



\## Versionado



El proyecto utiliza Semantic Versioning con el formato MAYOR.MENOR.PARCHE.



La versión estable publicada es `v1.0.0`.



\## Integración continua



Azure Pipelines ejecuta las comprobaciones y genera un artefacto del frontend denominado `frontend-compilado`.



GitHub Actions proporciona validaciones complementarias del repositorio.



\## Ambiente de preproducción



Se creó el ambiente `Preproduccion` en Azure DevOps.



Este ambiente cuenta con una comprobación de aprobación que exige la autorización de los responsables configurados.



\## Estrategia propuesta



1\. Integrar los cambios mediante Pull Requests.

2\. Ejecutar las validaciones automáticas.

3\. Generar y revisar el artefacto.

4\. Solicitar aprobación antes del despliegue a preproducción.

5\. Verificar el funcionamiento de la aplicación.

6\. Autorizar el lanzamiento cuando se cumplan los criterios establecidos.



\## Estado del lanzamiento



El Release `v1.0.0` está publicado en GitHub.



El ambiente de preproducción y su control de aprobación están configurados. No se ha demostrado todavía un despliegue automatizado a dicho ambiente.



\## Evidencias



\- Release `v1.0.0` publicado.

\- Pipeline fallido `#20261029.3`.

\- Pipeline exitoso `#20261029.4`.

\- Pipeline exitoso `#20261029.13` con artefacto publicado.

\- Agente autohospedado `Helen-Agent`.

\- Ambiente `Preproduccion` con aprobación configurada.

