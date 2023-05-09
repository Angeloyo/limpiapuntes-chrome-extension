const inputArchivo = document.getElementById('inputArchivo');
const resultado = document.getElementById('resultado');

// inputArchivo.addEventListener('change', async function (event) {
//     const archivoSeleccionado = event.target.files[0];
//     if (archivoSeleccionado) {
//       const reader = new FileReader();
//       reader.onload = async function (event) {
//         const pdfData = new Uint8Array(event.target.result);
//         const pdfDocument = await pdfjsLib.getDocument({data: pdfData}).promise;
//         resultado.textContent = 'Número de páginas: ' + pdfDocument.numPages;
//       };
//       reader.readAsArrayBuffer(archivoSeleccionado);
//     } else {
//       console.log('No se ha seleccionado ningún archivo');
//     }
//   });



let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let numOfFiles = document.getElementById("num-of-files");

fileInput.addEventListener("change", () => {
  fileList.innerHTML = "";
  numOfFiles.textContent = `${fileInput.files.length} Files Selected`;

  for (i of fileInput.files) {
    let reader = new FileReader();
    let listItem = document.createElement("li");
    let fileName = i.name;
    let fileSize = (i.size / 1024).toFixed(1);
    listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}KB</p>`;
    if (fileSize >= 1024) {
      fileSize = (fileSize / 1024).toFixed(1);
      listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}MB</p>`;
    }
    fileList.appendChild(listItem);
  }
});

let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let numOfFiles = document.getElementById("num-of-files");

inputArchivo.addEventListener('change', async function () {
    const files = this.files;
    let text = '';
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = async function (event) {
            const pdfData = new Uint8Array(event.target.result);
            const pdfDocument = await pdfjsLib.getDocument({data: pdfData}).promise;
            text += `Archivo ${i + 1}: Número de páginas: ${pdfDocument.numPages}\n`;
            if (i === files.length - 1) {
                resultado.textContent = text;
            }
        };
        reader.readAsArrayBuffer(files[i]);
    }
});

fileInput.addEventListener('change', async function () {
  const files = this.files;
  numOfFiles.textContent = `${fileInput.files.length} Files Selected`;
  for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = async function (event) {
          const pdfData = new Uint8Array(event.target.result);
          const pdfDocument = await pdfjsLib.getDocument({data: pdfData}).promise;
          let listItem = document.createElement("li");
          let numPag = document.createElement("li");
          numPag.innerHTML = `<p>Número de páginas: ${pdfDocument.numPages}</p>`;
          let fileName = files[i].name;
          let fileSize = (files[i].size / 1024).toFixed(1);
          listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}KB</p>`;
          if (fileSize >= 1024) {
          fileSize = (fileSize / 1024).toFixed(1);
          listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}MB</p>`;
          }
          fileList.appendChild(listItem);
          fileList.appendChild(numPag);
      };
      reader.readAsArrayBuffer(files[i]);
  }
});