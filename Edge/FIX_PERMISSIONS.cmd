REM Grant necessary fs permissions to the Edge sandbox user to allow access to the extension's directory
cd /d %~dp0
SET "InstallFolder=."

icacls "%InstallFolder%" /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)" >> "%Logfile%"
icacls "%InstallFolder%" /grant "*S-1-15-2-3624051433-2125758914-1423191267-1740899205-1073925389-3782572162-737981194":"(OI)(CI)(WDAC,WO,GE)" >> "%Logfile%"
