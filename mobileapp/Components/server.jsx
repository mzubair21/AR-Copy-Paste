const URL = 'http://192.168.0.103:8080'
function ping() {
  fetch(URL + '/ping').catch((e) => console.error(e))
}

export default {
  ping,
}
