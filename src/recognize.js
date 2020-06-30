const tesseract = require("node-tesseract-ocr");
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
 await tesseract.recognize(`../img/croped/${name}.jpg`, {lang: "eng",tessedit_char_whitelist: "abcdefghijklmnopqrstuvwxyz "})
  .then(text => {
     t = corrigir(text)
    })
  return t
 }


  function corrigir(text){
    const r = text.split("\r\n")
    
    const fil = r.filter(v =>  {
      for(var i = 0; i<excluir.length; i++){
        if(ss.compareTwoStrings(v, excluir[i]) > 0.3){
          return false;
        }
      }
      return true
    });
    const por = [0.9,0.5,0.3,0.2,0.1];
    var t = [];
for (var p = 0; p < por.length; p++) {
  comparepor(fil , por[p]);
}
    function comparepor(fil, por) {
      for (var i = 0; i < fil.length; i++) {
        if (compareateachar(fil[i], por)) {
          t.push(compareateachar(fil[i], por));
          fil.splice(i, 1);
          i--;
        }
      }
    }

    function compareateachar(fil, por) {
      for (var v = 0; v < esperado.length; v++) {
        if (ss.compareTwoStrings(fil, esperado[v]) > por) {
          return esperado[v];
        }
      }
      return false;
    }
    return t;
  }