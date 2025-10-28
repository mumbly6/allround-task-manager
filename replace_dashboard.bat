@echo off
setlocal enabledelayedexpansion

set "source=src\components\HappinessDashboard\HappinessDashboard.new.jsx"
set "target=src\components\HappinessDashboard\HappinessDashboard.jsx"

if exist "%source%" (
    echo Replacing %target% with updated version...
    move /Y "%source%" "%target%" >nul
    if !ERRORLEVEL! EQU 0 (
        echo Successfully updated HappinessDashboard.jsx
    ) else (
        echo Error: Failed to update HappinessDashboard.jsx
        exit /b 1
    )
) else (
    echo Error: Source file not found: %source%
    exit /b 1
)
