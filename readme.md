## Como criar instalador:

- rode o comando `npm run build` no terminal;
- crie uma pasta destinada ao instalador;
- Copie todos os arquivos da pasta dentro de `dist` para `resource`, na raiz do instalador;
- Copie o arquivo `example/install.bat` para a raiz do instalador;
- Apague os seguintes arquivos:
  - `LICENSE`
  - `LICENSES.chromium.html`
  - `resources/app/bin`
  - `resources/app/example`
  - `resources/app/.gitignore`
  - `resources/app/readme.md`
- Por fim, copie a pasta `bin` para a pasta `resource` dentro da raiz do instalador.

## Como usar:

- Inicie o arquivo `install.bat` para instalar o Node.js;
- Inicie o arquivo `install.bat` novamente para instalar o Adobe e copiar os arquivos para a pasta AppData;
- crie um atalho do arquivo `ImprimePDF.exe` para a área de trabalho.

## Opcional:

- crie um atalho do arquivo `ImprimePDF.exe` para o caminho `C:\ProgramData\Microsoft\Windows\Start Menu\Programs`.
