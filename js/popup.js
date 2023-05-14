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

            // enviar pdf a función lambda y obtener nuevo pdf
            const url = URL.createObjectURL(blob);

            let fileName = files[i].name;
            const extension = fileName.split(".").pop();
            const name = fileName.split(".").shift();
            const newFileName = name + "_modificado." + extension;

            await downloadFile(newFileName, url);
        };
        reader.readAsArrayBuffer(files[i]);
    }
}

async function editFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = async function (event) {

            let fileName = files[i].name;
            const pdfData = new Uint8Array(event.target.result);

            const pdfDoc = await PDFLib.PDFDocument.load(pdfData);
            //const pdfDoc = await PDFLib.PDFDocument.load(pdfData, {ignoreEncryption: true });

            const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica)
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            const { width, height } = firstPage.getSize()
            firstPage.drawText('This text was added with JavaScript!', {
                x: 5,
                y: height / 2 + 300,
                size: 50,
                font: helveticaFont,
                color: PDFLib.rgb(0.95, 0.1, 0.1),
                rotate: PDFLib.degrees(-45),
            });                     
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            
            const extension = fileName.split(".").pop();
            const name = fileName.split(".").shift();
            const newFileName = name + "_modificado." + extension;

            // chrome.downloads.download({
            //     url: url,
            //     filename: newFileName,
            //     saveAs: false
            // });

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
  