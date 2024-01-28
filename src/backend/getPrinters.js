const { exec } = require("child_process");

// Comando para listar impressoras no Windows
const command = "wmic printer get name";

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar o comando: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Erro no comando: ${stderr}`);
    return;
  }

  // stdout contém a saída do comando
  console.log("Impressoras disponíveis:");
  console.log(stdout);
});
