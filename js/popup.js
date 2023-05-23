let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let numOfFiles = document.getElementById("num-of-files");
let saveButton = document.getElementById("save-button");
let loading = document.getElementById("loading");
let saveButtonDiv = document.getElementById("save-button-div");
let errormsg = document.getElementById("id-errormsg");
let errormsg2 = document.getElementById("id-errormsg2");
let errormsg3 = document.getElementById("id-errormsg3");
let divzip = document.getElementById("div_zip");
let cbx = document.getElementById("cbx");
let msg = document.getElementById("id-msg");
saveButton.style.visibility = 'hidden';
loading.style.visibility = 'hidden';
let numFiles = 0;
const zip = new JSZip();
window.addEventListener('load', loadmsg);
function loadmsg() {
  fetch("https://limpiapuntes.com/ext/msgv2.txt")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al obtener el mensaje");
      }
    })
    .then((data) => {
      msg.textContent = data.message;
      const style = data.style;
      Object.keys(style).forEach((property) => {
        msg.style[property] = style[property];
      });
    })
    .catch((error) => {
      console.error("Error al obtener el mensaje:", error);
    });
}
function verificarPDF(file) {
  var extension = file.name.split('.').pop().toLowerCase();
  if (extension === 'pdf') {
    return true;
  } else {
    return false;
  }
}
fileInput.addEventListener('change', async function () {
    let files = this.files;
    errormsg.textContent = "";
    errormsg2.textContent = "";
    errormsg3.textContent = "";
    numFiles += files.length;
    numOfFiles.textContent = `${numFiles} Archivos seleccionados`;
    if (numFiles > 1){
      divzip.style.visibility = 'visible'
    }
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = async function (event) {
            let listItem = document.createElement("li");
            let fileName = files[i].name;
            let fileSize = (files[i].size / 1024).toFixed(1);
            listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}KB</p>`;
            if (fileSize >= 1024) {
            fileSize = (fileSize / 1024).toFixed(1);
            listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}MB</p>`;
            }
            fileList.appendChild(listItem);
        };
        reader.readAsArrayBuffer(files[i]);
    }
    saveButton.style.visibility = 'visible';
    saveButton.addEventListener('click', async function () {
        await removeAds(files);
    });
});
async function removeAds(files) {
  let checked = false;
  if (numFiles > 1) {
    checked = cbx.checked;
  }
  loading.style.visibility = 'visible';
  const processFile = async (file) => {
    if (!verificarPDF(file)) {
      errormsg.textContent = 'Alguno de los archivos seleccionados no tiene extensión .pdf';
      numFiles--;
      return;
    }
    const reader = new FileReader();
    const fileLoaded = new Promise((resolve) => {
      reader.onload = resolve;
    });
    reader.readAsArrayBuffer(file);
    await fileLoaded;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("https://enigmatic-brushlands-61693.herokuapp.com/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const blob = await response.blob();
        let fileName = file.name;
        const extension = fileName.split(".").pop();
        const name = fileName.split(".").shift();
        const newFileName = name + "_limpiapuntes." + extension;
        if (numFiles > 1 && checked) {
          zip.file(newFileName, blob);
        } else {
          const url = URL.createObjectURL(blob);
          await downloadFile(newFileName, url);
        }
      } else {
        const contentType = response.headers.get("Content-Type");
        if (contentType.includes("application/json")) {
          const responseData = await response.json();
          errormsg3.textContent = responseData.Error;
        }
      }
    } catch (error) {
      errormsg2.textContent = "Parece que no tienes conexión a internet o el servidor no funciona correctamente.";
      console.log(error);
    }
  };
  const filesArray = Array.from(files);
  const promises = filesArray.map(file => processFile(file));
  await Promise.all(promises);
  if (checked) {
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const url_zip = URL.createObjectURL(content);
      downloadFile("procesados_limpiapuntes.zip", url_zip);
    });
  }
  loading.style.visibility = 'hidden';
}
async function downloadFile(d_fileName, d_url) {
  chrome.downloads.download({
      url: d_url,
      filename: d_fileName,
      saveAs: false
  });
}