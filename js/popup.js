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
            const arrayBuffer = event.target.result;
            const base64Pdf = arrayBufferToBase64(arrayBuffer);

            // Enviar PDF a la función Lambda y obtener el nuevo PDF
            const lambdaUrl = 'https://8r3gwub4ne.execute-api.eu-south-2.amazonaws.com/default/removeAdsLambda';
            const response = await fetch(lambdaUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ body: base64Pdf }),
            });

            if (!response.ok) {
                console.error('Error al procesar el PDF:', response.statusText);
                return;
            }

            const responseData = await response.json();
            const processedPdfBase64 = responseData.body;
            const processedPdfArrayBuffer = base64ToArrayBuffer(processedPdfBase64);
            const blob = new Blob([processedPdfArrayBuffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            let fileName = files[i].name;
            const extension = fileName.split('.').pop();
            const name = fileName.split('.').shift();
            const newFileName = name + '_mod.' + extension;

            await downloadFile(newFileName, url);
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


function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

  