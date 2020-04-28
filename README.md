
 <h1 align="center">  Cardapio-Bot </h1>

<p align="center">
  <a href="https://twitter.com/Cardapio_IF_bot">
    <img src='https://img.shields.io/twitter/url?label=%40Cardapio_IF_bot&url=https%3A%2F%2Ftwitter.com%2FCardapio_IF_bot'></img>
  </a>

  <a href="https://gitlab.sertao.ifrs.edu.br/2019309735/Cardapio-Bot">
    <img src='https://img.shields.io/badge/%20%20view%20it%20on-gitlab.sertão.ifrs.edu.br-orange?logo=gitlab'></img>
  </a>
  <img src="https://img.shields.io/badge/heroku-success-green?logo=heroku"></img> <br>
Bot que posta semanalmente o cardápio do refeitório do IFRS campus sertão.
</p>



# indice
### módulos
O bot é dividido em x módulos:
- [ImgGeter](#ImgGeter) 
- [Croper](#Croper)
- [Recognizer](#Recognizer)
- [GetWeather](#GetWeather)

Esses módulos podem ser orquestrados de duas formas:
- [orquestrador-web](#web) 
- [orquestrador-cron](#cron)

## ImgGeter

Esse modulo é responsável por obter o imagem do cardápio do site do campus (no caso: [ifrs.edu.br/sertao/assistencia-estudantil/restaurante/cardapio/](https://ifrs.edu.br/sertao/assistencia-estudantil/restaurante/cardapio/))  para tal ele usa o modulo [Puppeteer](https://www.npmjs.com/package/puppeteer) desse modo:
```javascript
const puppeteer =  require('puppeteer');
const fs =  require('fs');
const  ImgGet  = () =>  new  Promise(async(re,err)=>{ // inicia uma promise (função asincrona)
	const browser =  await puppeteer.launch(); 
	const page =  await browser.newPage();
	await page.goto('https://ifrs.edu.br/sertao/assistencia-estudantil/restaurante/cardapio/');
	var imgsrc =  await page.evaluate("document.querySelector('body > section > div > div.col-12.col-lg-10 > main > article > div:nth-child(3) > div > div > p > img').src;");
	viewSource =  await page.goto(imgsrc); // acessa o caminho absoluto da imagem
	fs.writeFile("./img/original/img.jpg", await viewSource.buffer(),  err => {
		console.log("Cardapio.jpg was saved!");
		re(); // resove a promise
	});
	browser.close();
});
module.exports.ImgGet = ImgGet; // Exporta o modulo
```
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
# Orquestradores
### web
Utiliza o http e o express para fazer um servidor padrão e dispara as funções conforme a rota acessada + token de usando o [cron-job.org](https://cron-job.org/)

![Capturar](https://user-images.githubusercontent.com/54213349/80440021-33b77600-88de-11ea-9293-5d3ec17a6fde.PNG)


```javascript
// require tudo

const app =  express();
const port =  process.env.PORT  ||  3333;
app.set('port', port);
const server = http.createServer(app);
//rotas
app.get('/',async (req, res) => { // não precisa de autenticação
	return res.json( JSON.parse(fs.readFileSync('cardapio.json').toString()) );
});

app.get('/new/'+process.env.SECRET_TOKEN,async (req, res) => {
	res.write('');
	await  ImgGet()
	await  crop();
	await  recognize();
	const prev =  await  GetWeather();
	await  PostImg(
					`Bom dia!
					prontos pra mais uma semana?
					essa é a previsão do tempo para essa semana:
					${prev}
					E como sempre o cardapio dessa semana:`
					,'./img/original/img.jpg'
				)
	res.end();
});

app.get('/almoco/'+process.env.SECRET_TOKEN,async (req, res) => {
	Post(
	`${ref[0]} - ${days[dateFormat('',"N")-1]}  ${dateFormat('', "d/mm")}\n
	${GetText(0, dateFormat('',"N")-1)}`
	)
res.write('');
res.end();
});
// o mesmo se repete para a janta

function  GetText(refN, dayN){
	var data =  JSON.parse(fs.readFileSync('cardapio.json').toString())
	var tex =  '';
	for(var i =  0; i<data[ref[refN]][days[dayN]].length; i++){
		tex += data[ref[refN]][days[dayN]][i]+'\n'
		// ex: data.almoço.segunda = []
	}
	return tex
}
server.listen(port); // inicia o server padrão
```

### Cron
Utilisa o [Node-cron](https://www.npmjs.com/package/node-cron) para agendar os post
```javascript
//require tudo

cron.schedule('30 6 * * 1', async () => {
	await  ImgGet()
	await  croper();
	await  recognize();
	const prev =  await  GetWeather();
	await  PostImg(`Bom dia!\n
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
	`${ref[0]} - ${days[dateFormat('',"N")-1]}  ${dateFormat('', "d/mm")}\n
	${GetText(0, dateFormat('',"N")-1)}`
	)
});
```
