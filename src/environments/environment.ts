
// const VERSION = 'tags/v1'
// const HTTP ='http://'
// const SERVER = '127.0.0.1'
// const PORT = ':3001/'
// const BASE_URL_APP = HTTP + SERVER + PORT + VERSION;
// const BASE_URL = HTTP + SERVER + PORT;
// const BASE_URL_LOGIN = BASE_URL + 'v1/'

// export const environment = {
//   production: false,
//   apiUrlApp: BASE_URL_APP,
//   apiUrlLogin: BASE_URL_LOGIN
// };


const VERSION = 'tags/v1'
const HTTP ='https://'
const SERVER = 'engendra.com.br/sinc/api/'
const PORT = ''
const BASE_URL_APP = HTTP + SERVER + PORT + VERSION;
const BASE_URL = HTTP + SERVER + PORT;
const BASE_URL_LOGIN = BASE_URL + 'v1/'

export const environment = {
  production: false,
  apiUrlApp: BASE_URL_APP,
  apiUrlLogin: BASE_URL_LOGIN
};

