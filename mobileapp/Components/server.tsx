import Base64 from "./Base64";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return Base64.btoa(binary);
}

function ping(myip: string) {
  console.log("http://" + myip + ":8080/ping");
  fetch("http://" + myip + ":8080/ping").catch((e) => console.error(e));
}

async function cut(imageURI: string, myip: string) {
  const formData = new FormData();
  formData.append("data", {
    // @ts-ignore
    uri: imageURI,
    name: "photo",
    type: "image/jpg",
  });
  //ReactNative Fetch BLOB
  console.log("http://" + myip + ":8080/cut");
  const resp = await fetch("http://" + myip + ":8080/cut", {
    method: "post",
    body: formData,
  })
    .then(async (res) => {
      console.log("> converting...");
      const buffer = await res.arrayBuffer();
      const base64Flag = "data:image/png;base64,";
      const imageStr = arrayBufferToBase64(buffer);
      return base64Flag + imageStr;
    })
    .catch(function (error) {
      console.log("Cut Operation Error Message " + error.message);
      // ADD THIS THROW error
      throw error;
    });

  return resp;
}
async function paste(imageURI: string, myip: string) {
  console.log("Making Data for paste");
  const formData = new FormData();
  formData.append("data", {
    // @ts-ignore
    uri: imageURI,
    name: "photo",
    type: "image/jpg",
  });
  console.log("Calling Flask /paste");
  console.log("http://" + myip + ":8080/paste");
  const xhr = new XMLHttpRequest();

  // const resp = await fetch("http://" + myip + ":8080/paste", {
  //   method: "post",
  //   body: formData,
  // }).then((r) => r.json());

  console.log("Flask Paste Request sent");
  const resp = await new Promise((resolve, reject) => {
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject("Request Failed");
      }
    };
    xhr.open("POST", "http://" + myip + ":8080/paste", true);
    xhr.send(formData);
  });

  console.log("Flask Paste Request successfull");
  return resp;
}

export default {
  ping,
  cut,
  paste,
};
