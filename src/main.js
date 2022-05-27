var crypto = require("crypto");
var fs = require("fs");

function calculaHash(bloco) {

  var blocoBufferizado = new Uint8Array(bloco);
  var hash = crypto.createHash("sha256").update(blocoBufferizado);

  return hash;
}

function calculaH0(blocos) {

  var blocoInvertido = blocos.reverse();

  var blocoHash = [];
  blocoHash.push(calculaHash(blocoInvertido[0]));

  for (var i = 1; i < blocoInvertido.length; i++) {
    var blocoBufferizado = new Uint8Array(blocoInvertido[i]);
    var proximoBloco = Int8Array.from([
      ...blocoBufferizado,
      ...blocoHash[i - 1].digest(),
    ]);

    blocoHash.push(calculaHash(proximoBloco));
  }

  var H0 = blocoHash[blocoHash.length - 1].digest("hex");

  return H0;

}

function calculaBlocos(leitor) {

  var tamBloco = 1024;
  var blocos = Math.ceil(leitor.length / tamBloco);
  var vetorBlocos = [];
  var tamAtualBloco = 0;
  var j = 0;

  for (var i = 0; i < blocos; i++) {
    var bloco = [];
    for (j = 0; j < tamBloco; j++) {
      if (leitor[tamAtualBloco + j] !== undefined) {
        bloco.push(leitor[tamAtualBloco + j]);
      }
    }
    tamAtualBloco += j;
    vetorBlocos.push(bloco);
  }

  return vetorBlocos;

}

function main() {

  var aux = process.argv.slice(2);
  var nomeArquivo = aux[0];
  var leitor = fs.readFileSync(`./src/videos/${nomeArquivo}`);
  var blocos = calculaBlocos(leitor);

  console.log(`The hex encoded h0 for the video is: ${calculaH0(blocos)}`);

}

main();
