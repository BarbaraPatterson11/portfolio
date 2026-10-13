@echo off
setlocal
title Frank Martin Portfolio - Local Server

cd /d "C:\Users\Frank\Documents\portfolio"

echo ===================================================
echo     Frank Glen Martin - Portfolio Local Server
echo ===================================================
echo.
echo [1/4] Checking Node.js environment...

where npm.cmd >nul 2>nul
if errorlevel 1 (
  where npm >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] npm was not found on your system!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
  )
)

echo [2/4] Checking project dependencies...
if not exist "node_modules\vite\bin\vite.js" (
  echo Installing missing dependencies... This may take a moment.
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [ERROR] Failed to install npm packages.
    pause
    exit /b 1
  )
)

echo [3/4] Ensuring clean state and freeing port 5173...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>nul

echo [4/4] Starting Vite dev server...
echo.
echo ---------------------------------------------------
echo  Local URL:  http://localhost:5173/portfolio/
echo  Status:     LIVE (Hot-reload + auto cache-refresh)
echo ---------------------------------------------------
echo.
echo Waiting for server to initialize, browser will open automatically...
echo Keep this command window open while viewing.
echo Press Ctrl+C in this window to stop the server when done.
echo.

:: Background watcher: Waits until port 5173 is actively listening before launching browser,
:: with a cache-busting timestamp so the latest code changes always show fresh!
start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "for ($i = 0; $i -lt 60; $i++) { try { $tcp = New-Object System.Net.Sockets.TcpClient; $tcp.Connect('127.0.0.1', 5173); $tcp.Close(); Start-Process ('http://localhost:5173/portfolio/?t=' + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()); break } catch { Start-Sleep -Milliseconds 500 } }"

:: Start Vite dev server with host flag, force-clearing dependency cache and strictly locking port 5173
call npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort --force

echo.
echo Portfolio server stopped.
pause
