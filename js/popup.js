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

            const pdfData = new Uint8Array(event.target.result);
            const pdfDoc = await PDFLib.PDFDocument.load(pdfData);
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
            
            //fileName = fileName + "_limpiapuntes";
            const extension = fileName.split(".").pop();
            const name = fileName.split(".").shift();
            const newFileName = name + "_modificado." + extension;

            chrome.downloads.download({
                url: url,
                filename: newFileName,
                saveAs: false
            });
        };
        reader.readAsArrayBuffer(files[i]);
    }

    //saveButtonDiv.classList.add('container');
    saveButton.style.visibility = 'visible';
    //saveButton.classList.add('class-save-button');
    //saveButton.classList.add('button');

});