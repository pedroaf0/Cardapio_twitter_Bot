// Use esse arquivo para testar os modulos separadamente

const { ImgGet } = require('./src/ImgGet');
//ImgGet()

const { crop } = require('./src/croper');
//crop()

const { recognize } = require('./src/recognize');
//recognize()

const { GetWeather } = require('./src/GetWeather');
//GetWeather()

const { SendMessage, sendPhoto } = require('./libs/Telegram');
