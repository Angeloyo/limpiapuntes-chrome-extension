//import { degrees, PDFDocument, rgb, StandardFonts } from './pdf-lib.js';

let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let numOfFiles = document.getElementById("num-of-files");
let saveButton = document.getElementById("save-button");
let saveButtonDiv = document.getElementById("save-button-div");

saveButton.style.visibility = 'hidden';

fileInput.addEventListener('change', async function () {
    const files = this.files;
    numOfFiles.textContent = `${fileInput.files.length} Archivos seleccionados`;
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
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = async function (event) {
        // Send file and receive the modified one
        const formData = new FormData();
        formData.append("file", files[i]);
  
        const response = await fetch("https://limitless-falls-79195.herokuapp.com/upload", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const blob = await response.blob();
  
          const url = URL.createObjectURL(blob);
  
          let fileName = files[i].name;
          const extension = fileName.split(".").pop();
          const name = fileName.split(".").shift();
          const newFileName = name + "_limpio." + extension;
  
          await downloadFile(newFileName, url);
        } else {
          console.error("Error uploading file:", response.statusText);
        }
      };
      reader.readAsArrayBuffer(files[i]);
    }
  }

//  async function removeAds(files) {
//     for (let i = 0; i < files.length; i++) {
//         const reader = new FileReader();
//         reader.onload = async function (event) {

//             // Send file and receive the modified one

//             const url = URL.createObjectURL(blob);

//             let fileName = files[i].name;
//             const extension = fileName.split('.').pop();
//             const name = fileName.split('.').shift();
//             const newFileName = name + '_mod.' + extension;

//             await downloadFile(newFileName, url);
//         };
//         reader.readAsArrayBuffer(files[i]);
//     }
// }


async function downloadFile(d_fileName, d_url) {
  chrome.downloads.download({
      url: d_url,
      filename: d_fileName,
      saveAs: false
  });
}



  