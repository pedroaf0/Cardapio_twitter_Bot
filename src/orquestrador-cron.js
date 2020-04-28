const fs = require('fs');

const cron = require('node-cron');

const dateFormat = require('dateformat');
const { days, ref } = require('../consts');
const { Post, PostImg } = require('../twitterTimeline');
const { crop } = require('./croper');
const { recognize } = require('./recognize');
const { ImgGet } = require('./ImgGet');
//const { GetWeather } = require('./GetWeather');

(async () => {
  // await ImgGet()
  // await crop()
  // await recognize()
  await console.log(
    `
${ref[0]} - ${days[dateFormat('',"N")-1]} ${dateFormat('', "d/mm")}\n
${GetText(0, dateFormat('',"N")-1)}
    `
  )
})()

cron.schedule('30 6 * * 1', async () => {
      await ImgGet()
      await croper();
      await recognize();
      const prev = await GetWeather();
      await PostImg(
        `
Bom dia!\n
prontos pra mais uma semana?\n

essa é a previsão do tempo para essa semana:\n
${prev}\n

E como sempre o cardapio dessa semana:
        `,
      '/original/img.jpg'
      )

});
// Almoço
cron.schedule('30 11 * * 1-5', () => {
  Post(
    `
${ref[0]} - ${days[dateFormat('',"N")-1]} ${dateFormat('', "d/mm")}\n
${GetText(0, dateFormat('',"N")-1)}
    `
  )
});
// Janta 
 cron.schedule('0 18 * * 1-4', () => {
  Post(
    `
${ref[1]} - ${days[dateFormat('',"N")-1]} ${dateFormat('', "d/mm")}\n
${GetText(1, dateFormat('',"N")-1)}
    `
  );
});

function GetText(refN, dayN){
  var data = JSON.parse(fs.readFileSync('cardapio.json').toString())
  var tex = '';
      for(var i = 0; i<data[ref[refN]][days[dayN]].length; i++){
          tex += data[ref[refN]][days[dayN]][i]+'\n'
      } 
  return tex
}