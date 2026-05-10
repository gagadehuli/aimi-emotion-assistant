@echo off
rem ============================================================
rem  Aimi local dev launcher
rem  - Auto-detects the current LAN IPv4
rem  - Syncs it into the frontend .env (EXPO_PUBLIC_AI_PROXY_URL)
rem  - Starts aimi-server (port 8787) in its own window
rem  - Starts Expo Metro with --clear (port 8081) in its own window
rem
rem  Double-click to run. Two new cmd windows will open.
rem  Keep them open while developing; close them to stop.
rem ============================================================

setlocal
cd /d "%~dp0"

echo ============================================
echo  Aimi dev launcher
echo ============================================
echo.

rem --- 1. Detect LAN IP via PowerShell ---------------------------------------
rem  Prefers the adapter that has the default route (the one used to reach
rem  the internet), and only accepts 192.168.* / 10.* private ranges so VPN
rem  / Hyper-V virtual adapters get filtered out.

for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-NetRoute -DestinationPrefix '0.0.0.0/0' | Sort-Object RouteMetric | Select-Object -First 1 | ForEach-Object { (Get-NetIPAddress -InterfaceIndex $_.InterfaceIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -match '^(192\.168\.|10\.)' } | Select-Object -First 1).IPAddress })"') do set "CURRENT_IP=%%i"

if "%CURRENT_IP%"=="" (
  echo [error] Could not auto-detect a LAN IPv4 address.
  echo All IPv4 addresses on this machine:
  ipconfig ^| findstr /C:"IPv4"
  echo.
  echo Edit .env manually with the right IP, then re-run this script.
  pause
  exit /b 1
)

echo Detected LAN IP: %CURRENT_IP%
echo.

rem --- 2. Sync .env (UTF-8 no BOM, preserves other lines) --------------------
powershell -NoProfile -Command "$ip='%CURRENT_IP%'; $url='EXPO_PUBLIC_AI_PROXY_URL=http://'+$ip+':8787'; $prov='EXPO_PUBLIC_AI_PROVIDER=proxy'; $envPath = Join-Path (Get-Location) '.env'; if (Test-Path $envPath) { $lines = Get-Content $envPath; $hasUrl=$false; $hasProv=$false; $out = @(); foreach ($l in $lines) { if ($l -match '^EXPO_PUBLIC_AI_PROXY_URL=') { $hasUrl=$true; $out += $url } elseif ($l -match '^EXPO_PUBLIC_AI_PROVIDER=') { $hasProv=$true; $out += $l } else { $out += $l } }; if (-not $hasUrl) { $out += $url }; if (-not $hasProv) { $out += $prov } } else { $out = @($url, $prov) }; [System.IO.File]::WriteAllLines($envPath, [string[]]$out, [System.Text.UTF8Encoding]::new($false)); Write-Host '.env synced.'"

echo.
echo Current .env:
type .env
echo.

rem --- 3. Stop any leftover aimi processes on 8787 / 8081 --------------------
rem  Avoids EADDRINUSE in the new windows. Only ports 8787 / 8081 are touched.
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8787 " ^| findstr "LISTENING"') do (
  echo Stopping existing process on port 8787 (PID %%p)...
  taskkill /PID %%p /F >nul 2>&1
)
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8081 " ^| findstr "LISTENING"') do (
  echo Stopping existing process on port 8081 (PID %%p)...
  taskkill /PID %%p /F >nul 2>&1
)

rem --- 4. Launch aimi-server in its own window -------------------------------
echo Launching aimi-server (port 8787) in a new window...
start "aimi-server" cmd /k "cd /d %~dp0server && npm run dev"
rem Give server a few seconds before Metro grabs CPU
timeout /t 3 /nobreak >nul

rem --- 5. Launch Expo Metro with --clear in its own window -------------------
rem  --clear is necessary because EXPO_PUBLIC_* are compile-time constants;
rem  every .env change must reload the bundler cache.
echo Launching aimi-metro (port 8081, --clear) in a new window...
start "aimi-metro" cmd /k "cd /d %~dp0 && npx expo start --clear"

echo.
echo ============================================
echo  Both windows are starting up.
echo
echo  Next:
echo  1. Wait for aimi-server to print "listening on ..."
echo  2. Wait for aimi-metro to print the QR code.
echo  3. Phone: same WiFi -> Expo Go -> scan that QR.
echo
echo  Optional health check from your phone browser:
echo    http://%CURRENT_IP%:8787/api/health
echo  Should return: {"ok":true,"hasKey":true,"model":"gemini-2.5-flash"}
echo
echo  Stop everything: close the two windows.
echo ============================================
echo.
pause
endlocal
