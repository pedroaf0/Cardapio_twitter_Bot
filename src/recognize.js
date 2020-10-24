const tesseract = require("node-tesseract-ocr");
const {resolve} = require("path");
const fs = require('fs');

var ss = require('string-similarity');
const { days, ref, esperado, excluir } = require('../consts');

var result = {};

module.exports.recognize = async function recognize() {
  for(var r = 0;r < 2;r++){
    var json = {};
      for(var i = 0;i<5;i++){
        console.log('recognize: ', days[i],' ',ref[r])
        json[days[i]] = await recognizee(`${days[i]}-${ref[r]}`)
      }
    result[ref[r]] = json;
    
  } 
    fs.writeFile("./cardapio.json", JSON.stringify(result), function(err) {
    if(err) console.log(err);
    
    console.log("cardapio.json was saved!");
}); 
}


async function recognizee(name){
  var t;
 await tesseract.recognize(resolve(`./img/croped/${name}.jpg`), {lang: "eng",oem: 3,psm: 3})
  .then(text => {
     t = corrigir(text)
    })
  return t
 }


  function corrigir(text){
    // 1ª Etapa: transformar o texto bruto em um array de strings
    const r = text.split("\r\n")

    // 2ª Etapa: excluir strings sem conteudo
    const fil = r.filter(v =>  {
      for(var i = 0; i<excluir.length; i++){
        if(ss.compareTwoStrings(v, excluir[i]) > 0.3){
          return false;
        }
      }
      return true
    });

    // 3ª etapa: achar a palavra mais parecida e sobre escrever no banco 
    for (let index = 0; index < fil.length; index++) {
      var palavra = fil[index];

        var valorDaMaiorPalavra = 0;
        var valorDaPalavraAtual = 0;
        var palavraCerta = "";
        var resultado = "";

          for (let indexInterno = 0; indexInterno < esperado.length; indexInterno++) {
            var palavraCerta = esperado[indexInterno];

            var valorDaPalavraAtual = ss.compareTwoStrings(palavra, palavraCerta);

            if (valorDaPalavraAtual > valorDaMaiorPalavra) {
                
                valorDaMaiorPalavra = valorDaPalavraAtual;
                resultado = palavraCerta;
 
            }
            
          }
        fil[index] = resultado;
      
    }
    return fil;
  }