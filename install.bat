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
rmdir /s /q "C:\Users\%USERNAME%\AppData\Roaming\ImprimePDF"
cd ..
Xcopy /E /I %CD%\resource C:\Users\%USERNAME%\AppData\Roaming\ImprimePDF
cd C:\Users\%USERNAME%\AppData\Roaming\ImprimePDF
copy %CD%\ImprimePDF.lnk \\metaro-server\UsuariosAD\%USERNAME%\Desktop
echo.

    choice /C SN /M "Instalar Dependencias?
    IF errorlevel=2 goto NAO
    IF errorlevel=1 goto SIM
    :SIM
    echo O usuario pressionou [S]
    echo.
    npm install && start explorer C:\Users\%USERNAME%\AppData\Roaming\ImprimePDF
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
