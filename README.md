
 <h1 align="center">  Cardapio-Bot </h1>

<p align="center">
  <a href="https://twitter.com/Cardapio_IF_bot">
    <img src='https://img.shields.io/twitter/url?label=%40Cardapio_IF_bot&url=https%3A%2F%2Ftwitter.com%2FCardapio_IF_bot'></img>
  </a>
  <img src="https://img.shields.io/badge/heroku-success-green?logo=heroku"></img> <br>
Bot que posta semanalmente o cardápio do refeitório do IFRS campus sertão.
</p>

# Módulos

- [ImgGeter](#ImgGeter) 
- [Croper](#Croper)
- [Recognizer](#Recognizer)

# Bibliotecas reutilizáveis

- [GetWeather](#GetWeather)
- [twitterTimeline](#twitterTimeline)
- [Telegram.js](#Telegram)

--------------------------------------------------------------------------------------------------------------


# Orquestrador

Usa o [cron-job.org](https://cron-job.org/) para agendar os posts

![Capturar](https://user-images.githubusercontent.com/54213349/80440021-33b77600-88de-11ea-9293-5d3ec17a6fde.PNG)


```javascript
 app.get('/new/'+process.env.SECRET_TOKEN,async (req, res) => {
    res.write('');
    const imgLink = await ImgGet()
    await crop();
    await recognize();
    const prev = await GetWeather();
    const message =`Bom dia!\nprontos pra mais uma semana?\nessa é a previsão do tempo para essa semana:\n${prev}\nE como sempre o cardapio dessa semana:`
    await PostImg(message,'./img/original/img.jpg') 
    res.write(message); 
    res.end();

    await SendMessage(message);
    await sendPhoto(imgLink);
   });
 app.get('/almoco/'+process.env.SECRET_TOKEN,async (req, res) => {
    const message = `${ref[0]} - ${days[dateFormat('',"N")-1]} ${dateFormat('', "d/mm")}\n`+
                    `${GetText(0, dateFormat('',"N")-1)}`
    await Post(message)
    await SendMessage(message);
    res.write(message); 
    res.end();
});
```
--------------------------------------------------------------------------------------------------------------

# ImgGeter

O processo começa quando o `ImgGeter` usa a API json do WordPress para pesquisar imagens com o nome 'cardapio' e pegando o primeiro resultado e fazendo o download
[Acesse o arquivo original](blob/master/src/ImgGet.js "/src/ImgGet.js")
```javascript
module.exports.ImgGet = ()=> new Promise((re,err)=>{
request("https://ifrs.edu.br/sertao/wp-json/wp/v2/media?search=cardapio", function (error, response, body) {
   download(JSON.parse(body)[0].guid.rendered, './img/original/img.jpg', () => re(JSON.parse(body)[0].guid.rendered))
	})
})
```

--------------------------------------------------------------------------------------------------------------

# Croper
Esse modulo é responsável por cortar a imagem original em pequenas imagens para facilitar o trabalho do ocr (recognizer) para isso é usado o modulo [Jimp](https://www.npmjs.com/package/jimp) desse modo:
```javascript
var Jimp =  require('jimp');
const { days, ref } =  require('../consts'); // importa os valores constantes presentes na maioria dos modulos
const y = [248, 395] // array com os valores possiveis de y em pixels
const x = [ 163, 315, 468, 620, 773]; // array com os valores de x em pixels
const w = [116, 140] //array com os valores de w(idth) tmb em pixels
module.exports.crop  =  async  function  crop(){ // exporta o modulo asincrono
	for(var r =  0;r<2;r++){
		for(var i =  0;i<5;i++){
			await  croop(`${days[i]}-${ref[r]}`, x[i], y[r], w[r])
		}
	}
}

const  croop  = (name, x, y, w) =>  new  Promise((re,err) =>{
	Jimp.read('img/original/img.jpg', (err, img) => {
	if (err) throw err;
	img
	.crop( x, y, 153, w )
	.write(`img/croped/${name}.jpg`); // save
	})
	setTimeout(() =>  re(), 0) // aguarda 0 milissegundos e resolve a promisse (não me pergunte pq tem q "esperar" 0 milissegundos)
});
```

--------------------------------------------------------------------------------------------------------------

# Recognizer
Esse modulo é responsável  por reconhecer os caracteres nas imagens cortadas usando o modulo [node-tesseract-ocr](https://www.npmjs.com/package/node-tesseract-ocr) desse modo:
```javascript
const tesseract =  require("node-tesseract-ocr");
const fs =  require('fs');
var ss =  require('string-similarity');
const { days, ref, esperado, excluir } =  require('../consts');
var result = {};
module.exports.recognize  =  async  function  recognize() {
	for(var r =  0;r <  2;r++){
		var json = {};
		for(var i =  0;i<5;i++){
		console.log('recognize: ', days[i],'  ',ref[r])
		json[days[i]] =  await  recognizee(`${days[i]}-${ref[r]}`)
	}
result[ref[r]] = json;
}
fs.writeFile("./cardapio.json", JSON.stringify(result), function(err) {
	console.log("cardapio.json was saved!"); // retorna a promisse pelo fim da função
});
}
async  function  recognizee(name){
var t;
await tesseract.recognize(`img/croped/${name}.jpg`, {lang:  "eng",oem:  1,psm:  3})
.then(text  => {t =  corrigir(text)})
return t
}
```
A função ``corrigir(text)`` recebe uma string toda bagunçada e a divide em uma matriz de substrings com base na quebra de linha representada digitalmente por ``\r\n`` depois filtra a matriz com base na matriz de exclusão usando o [string-similarity](www.npmjs.com/package/string-similarity)
```json
excluir = [ '','   ','\f','a'];
```
```javascript
function  corrigir(text){
	const r = text.split("\r\n")
	const fil = r.filter(v  => {
		for(var i =  0; i<excluir.length; i++){
			if(ss.compareTwoStrings(v, excluir[i]) >  0.3){
			return  false;
		}
	}
	return  true
});
```
e por fim ele substitui as palavras com algum erro de reconhecimento por uma palavra parecida na matriz de palavras esperadas também usando o [string-similarity](www.npmjs.com/package/string-similarity)
```javascript
for(var i =  0; i<fil.length; i++){
	for(var v =  0; v<esperado.length; v++) {
		if(ss.compareTwoStrings(fil[i], esperado[v]) >  0.3) {
		fil.splice(i, 1, esperado[v]);
		}
	}
}
return fil;
}
```

--------------------------------------------------------------------------------------------------------------

# GetWeather
De longe o modulo mais simples ele utiliza o modulo [Request](https://www.npmjs.com/package/request) que consulta a api [hgbrasil.com/status/weather](https://hgbrasil.com/status/weather) desse modo:
```javascript
const request =  require('request');
const { daysBrev, ConditionToEmoji } =  require('../consts');
var text =  '';
module.exports.GetWeather  = () =>  new  Promise((re,err)=>{
	request('https://api.hgbrasil.com/weather?format=json-cors&key=dc818b04&woeid=461260', function (error, response, body) {
	for(var i =  0;i <  5; i++){
	text +=  `${daysBrev[i]}: ${ConditionToEmoji[JSON.parse(body).results.forecast[i].condition]} `
	}
	re(text);
	});
})
```
o ConditionToEmoji é um objeto q converte de forma literal a condição do clima em um emoji assim:
```json
ConditionToEmoji = {
	"cloudly_day":  "⛅",
	"cloud":  "☁️",
	"clear_day":  "☀️",
	"rain":  "🌧️",
	"storm":  "⛈️",
	"snow":  "🌨️",
	"fog":  "☁️☁️",
	"cloudly_night":  "☁️🌙"
}
```
