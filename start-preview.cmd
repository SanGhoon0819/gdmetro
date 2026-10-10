@echo off
cd /d "%~dp0"
node build.mjs
if errorlevel 1 (
  pause
  exit /b 1
)
echo Open http://127.0.0.1:4173 in your browser.
node preview.mjs
pause

