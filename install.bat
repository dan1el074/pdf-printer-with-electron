@echo off
:init
setlocal DisableDelayedExpansion
set cmdInvoke=1
set winSysFolder=System32
set "batchPath=%~0"
for %%k in (%0) do set batchName=%%~nk
set "vbsGetPrivileges=%temp%\OEgetPriv_%batchName%.vbs"
setlocal EnableDelayedExpansion

:checkPrivileges
NET FILE 1>NUL 2>NUL
if '%errorlevel%' == '0' ( goto gotPrivileges ) else ( goto getPrivileges )

:getPrivileges
if '%1'=='ELEV' (echo ELEV & shift /1 & goto gotPrivileges)
echo.
echo **************************************
echo Invoking UAC for Privilege Escalation
echo **************************************

echo Set UAC = CreateObject^("Shell.Application"^) > "%vbsGetPrivileges%"
echo args = "ELEV " >> "%vbsGetPrivileges%"
echo For Each strArg in WScript.Arguments >> "%vbsGetPrivileges%"
echo args = args ^& strArg ^& " "  >> "%vbsGetPrivileges%"
echo Next >> "%vbsGetPrivileges%"

if '%cmdInvoke%'=='1' goto InvokeCmd 

echo UAC.ShellExecute "!batchPath!", args, "", "runas", 1 >> "%vbsGetPrivileges%"
goto ExecElevation

:InvokeCmd
echo args = "/c """ + "!batchPath!" + """ " + args >> "%vbsGetPrivileges%"
echo UAC.ShellExecute "%SystemRoot%\%winSysFolder%\cmd.exe", args, "", "runas", 1 >> "%vbsGetPrivileges%"

:ExecElevation
"%SystemRoot%\%winSysFolder%\WScript.exe" "%vbsGetPrivileges%" %*
exit /B

:gotPrivileges
setlocal & cd /d %~dp0
if '%1'=='ELEV' (del "%vbsGetPrivileges%" 1>nul 2>nul  &  shift /1)

::::::::::::::::::::::::::::
::START
::::::::::::::::::::::::::::

@echo off
title ImprimePDF
cd resource

echo Instalador de ImprimePDF, uso exclusivo de:
echo.
echo       ___           ___                       ___           ___           ___
echo      /__/\         /  /\          ___        /  /\         /  /\         /  /\
echo     ^|  ^|::\       /  /:/_        /  /\      /  /::\       /  /::\       /  /::\
echo     ^|  ^|:^|:\     /  /:/ /\      /  /:/     /  /:/\:\     /  /:/\:\     /  /:/\:\
echo   __^|__^|:^|\:\   /  /:/ /:/_    /  /:/     /  /:/~/::\   /  /:/~/:/    /  /:/  \:\
echo  /__/::::^| \:\ /__/:/ /:/ /\  /  /::\    /__/:/ /:/\:\ /__/:/ /:/___ /__/:/ \__\:\
echo  \  \:\~~\__\/ \  \:\/:/ /:/ /__/:/\:\   \  \:\/:/__\/ \  \:\/:::::/ \  \:\ /  /:/
echo   \  \:\        \  \::/ /:/  \__\/  \:\   \  \::/       \  \::/~~~~   \  \:\  /:/
echo    \  \:\        \  \:\/:/        \  \:\   \  \:\        \  \:\        \  \:\/:/
echo     \  \:\        \  \::/          \__\/    \  \:\        \  \:\        \  \::/
echo      \__\/         \__\/                     \__\/         \__\/         \__\/
echo.
echo.
echo Selecione os apps que ainda nao possui em seu computador com as teclas "S" e "N":

choice /C SN /M "Instalar Node.js?
IF errorlevel=2 goto NAO
IF errorlevel=1 goto SIM
:SIM
echo O usuario pressionou [S]
start bin/node-v21.6.1-x64.msi
echo.
exit
goto fim
:NAO
echo O usuario pressionou [N]
echo.
goto fim
:fim

choice /C SN /M "Instalar Adobe Reader 9?
IF errorlevel=2 goto NAO
IF errorlevel=1 goto SIM
:SIM
echo O usuario pressionou [S]
start bin/AdbeRdr920_pt_BR.exe
echo.
goto fim
:NAO
echo O usuario pressionou [N]
echo.
goto fim
:fim

choice /C SN /M "Copiar Aplicativo para C:\Program Files\ImprimePDF?
IF errorlevel=2 goto NAO
IF errorlevel=1 goto SIM
:SIM
echo O usuario pressionou [S]
echo.
rmdir /s /q "C:/Program Files/ImprimePDF"
cd ..
Xcopy /E /I resource "C:\Program Files\ImprimePDF"
cd C:/Program Files/ImprimePDF
echo.

    choice /C SN /M "Instalar Dependencias?
    IF errorlevel=2 goto NAO
    IF errorlevel=1 goto SIM
    :SIM
    echo O usuario pressionou [S]
    echo.
    npm install && start explorer "C:\Program Files\ImprimePDF"
    goto fim3
    :NAO
    echo O usuario pressionou [N]
    echo.
    goto fim3
    :fim3

goto fim2
:NAO
echo O usuario pressionou [N]
echo.
attrib +s +h ImprimePDF.lnk

    choice /C SN /M "Instalar Dependencias?
    IF errorlevel=2 goto NAO
    IF errorlevel=1 goto SIM
    :SIM
    echo O usuario pressionou [S]
    echo.
    npm install
    goto fim3
    :NAO
    echo O usuario pressionou [N]
    echo.
    goto fim3
    :fim3

goto fim2
:fim2

timeout 2
exit
