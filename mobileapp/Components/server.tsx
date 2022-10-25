import Base64 from './Base64'

const URL = 'http://192.168.0.101:8080'

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = [].slice.call(new Uint8Array(buffer))
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return Base64.btoa(binary)
}

function ping() {
  fetch(URL + '/ping').catch((e) => console.error(e))
}

async function cut(imageURI: string) {
  const formData = new FormData()
  formData.append('data', {
    // @ts-ignore
    uri: imageURI,
    name: 'photo',
    type: 'image/jpg',
  })
  //ReactNative Fetch BLOB
  const resp = await fetch('http://192.168.0.101:8080/cut', {
    method: 'POST',
    body: formData,
  }).then(async (res) => {
    console.log('> converting...')
    const buffer = await res.arrayBuffer()
    const base64Flag = 'data:image/png;base64,'
    const imageStr = arrayBufferToBase64(buffer)
    return base64Flag + imageStr
  })

  return resp
}
async function paste(imageURI: string) {
  console.log('Making Data for paste')
  const formData = new FormData()
  formData.append('data', {
    // @ts-ignore
    uri: imageURI,
    name: 'photo',
    type: 'image/jpg',
  })
  console.log('Calling Flask /paste')

  const resp = await fetch('http://192.168.0.101:8080/paste', {
    method: 'POST',
    body: formData,
  }).then((r) => r.json())
  console.log('Flask Paste Request successfull')
  return resp
}

export default {
  ping,
  cut,
  paste,
}
