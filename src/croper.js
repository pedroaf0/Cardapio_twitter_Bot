var Jimp = require('jimp');

const { days, ref } = require('../consts');

const y = [248, 395]
const w = [116, 140]
const x = [ 163, 315, 468, 620, 773];

module.exports.crop = async function crop(){
for(var r = 0;r<2;r++){
  for(var i = 0;i<5;i++){
    console.log(`crop: ${days[i]} ${ref[r]}` )
 await croop(`${days[i]}-${ref[r]}`, x[i], y[r], w[r])
 
  }
}
}
const croop = (name, x, y, w) => new Promise((re,err) =>{
 Jimp.read('img/original/img.jpg', (err, img) => {
    if (err) throw err;
    img
      .crop( x, y, 153, w )  
      .write(`img/croped/${name}.jpg`); // save
  })
  setTimeout(() => re(), 0) // é assim e é pq é, se não acredita em mim tira e veja o erro
});