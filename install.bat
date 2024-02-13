@echo off
title ImprimePDF

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
echo Selecione os apps que deseja instalar:

choice /C SN /M "Instalar Node.js?
IF errorlevel=2 goto NAO
IF errorlevel=1 goto SIM
:SIM
echo O usuario pressionou [S]
echo.
start bin/node-v21.6.1-x64.msi
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
echo.
start bin/AdbeRdr920_pt_BR.exe
goto fim
:NAO
echo O usuario pressionou [N]
echo.
goto fim
:fim

choice /C SN /M "Instalar Dependencias?
IF errorlevel=2 goto NAO
IF errorlevel=1 goto SIM
:SIM
echo O usuario pressionou [S]
echo.
npm install
goto fim
:NAO
echo O usuario pressionou [N]
echo.
goto fim
:fim

timeout 1
