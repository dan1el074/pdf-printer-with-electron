@echo off
title ImprimePDF
cd %CD%/resource

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

choice /C SN /M "Instalar Adobe Reader?
IF errorlevel=2 goto NAO
IF errorlevel=1 goto SIM
:SIM
echo O usuario pressionou [S]
start bin/reader_br_install.exe
echo.
echo Nao se esqueca de iniciar o Adobe pela primeira vez antes de testar o aplicativo!
echo.
goto fim
:NAO
echo O usuario pressionou [N]
echo.
goto fim
:fim

choice /C SN /M "Copiar Aplicativo para a pasta AppData?"
IF errorlevel=2 goto NAO
IF errorlevel=1 goto SIM
:SIM
echo O usuario pressionou [S]
echo.
rmdir /s /q "C:\Users\%USERNAME%\AppData\Roaming\ImprimePDF"
cd ..
Xcopy /E /I %CD%\resource C:\Users\%USERNAME%\AppData\Roaming\ImprimePDF
cd C:\Users\%USERNAME%\AppData\Roaming\ImprimePDF
rmdir /s /q bin
start explorer C:\Users\%USERNAME%\AppData\Roaming\ImprimePDF
echo.
goto fim
:NAO
echo O usuario pressionou [N]
echo.
goto fim
:fim

timeout 2
exit
