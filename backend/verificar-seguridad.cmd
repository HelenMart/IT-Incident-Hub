@echo off
echo ======================================
echo Verificacion de seguridad del backend
echo ======================================

cd /d "%~dp0"

call npm audit --omit=dev --audit-level=high

if errorlevel 1 (
    echo ERROR: Se detectaron problemas de seguridad.
    exit /b 1
)

echo Seguridad verificada correctamente.
exit /b 0