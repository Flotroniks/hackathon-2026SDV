@ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION

SET BASE_DIR=%~dp0
SET WRAPPER_PROPERTIES=%BASE_DIR%\.mvn\wrapper\maven-wrapper.properties

FOR /F "tokens=1,* delims==" %%A IN (%WRAPPER_PROPERTIES%) DO (
  IF "%%A"=="distributionUrl" SET DIST_URL=%%B
)

FOR %%A IN ("%DIST_URL%") DO SET DIST_FILE=%%~nxA
SET DIST_NAME=%DIST_FILE:-bin.tar.gz=%
SET CACHE_DIR=%USERPROFILE%\.m2\wrapper\dists\%DIST_NAME%
SET MAVEN_HOME=%CACHE_DIR%\%DIST_NAME%
SET ARCHIVE_PATH=%CACHE_DIR%\%DIST_FILE%

IF NOT EXIST "%MAVEN_HOME%\bin\mvn.cmd" (
  IF NOT EXIST "%CACHE_DIR%" mkdir "%CACHE_DIR%"
  IF NOT EXIST "%ARCHIVE_PATH%" powershell -Command "Invoke-WebRequest '%DIST_URL%' -OutFile '%ARCHIVE_PATH%'"
  powershell -Command "tar -xzf '%ARCHIVE_PATH%' -C '%CACHE_DIR%'"
)

"%MAVEN_HOME%\bin\mvn.cmd" %*
