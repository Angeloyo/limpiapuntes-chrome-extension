let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let numOfFiles = document.getElementById("num-of-files");
let saveButton = document.getElementById("save-button");
let loading = document.getElementById("loading");
let saveButtonDiv = document.getElementById("save-button-div");
let errormsg = document.getElementById("id-errormsg");
saveButton.style.visibility = 'hidden';
loading.style.visibility = 'hidden';
let numFiles = 0;
fileInput.addEventListener('change', async function () {
    let files = this.files;
    errormsg.textContent = "";
    numFiles += files.length;
    numOfFiles.textContent = `${numFiles} Archivos seleccionados`;
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
  let cont = 0;
    loading.style.visibility = 'visible';
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const formData = new FormData();
        formData.append("file", files[i]);
        // http://localhost:5000/upload
        // https://enigmatic-brushlands-61693.herokuapp.com/upload
        try{
          const response = await fetch("https://enigmatic-brushlands-61693.herokuapp.com/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            let fileName = files[i].name;
            const extension = fileName.split(".").pop();
            const name = fileName.split(".").shift();
            const newFileName = name + "_limpiapuntes." + extension;
            await downloadFile(newFileName, url);
          } else {
            const contentType = response.headers.get("Content-Type");
            if (contentType.includes("application/json")) {
              const responseData = await response.json();
              errormsg.textContent = responseData.Error;
            }
          }

          cont++;
          if(cont==files.length){
            loading.style.visibility = 'hidden';
          }

        }catch(error){
          errormsg.textContent = "Parece que no tienes conexión a internet o el servidor no funciona correctamente.";
        }
        
      };
      reader.readAsArrayBuffer(files[i]);
    }
}
async function downloadFile(d_fileName, d_url) {
  chrome.downloads.download({
      url: d_url,
      filename: d_fileName,
      saveAs: false
  });
}