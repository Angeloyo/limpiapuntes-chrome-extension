let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let eList = document.getElementById("e-list");
let numOfFiles = document.getElementById("num-of-files");
let saveButton = document.getElementById("save-button");
let loading = document.getElementById("loading");
let saveButtonDiv = document.getElementById("save-button-div");
let errormsg = document.getElementById("id-errormsg");
let errormsg2 = document.getElementById("id-errormsg2");
let divzip = document.getElementById("div_zip");
let cbx = document.getElementById("cbx");
let msg = document.getElementById("id-msg");
let infomsg = document.getElementById("info-msg");
saveButton.style.visibility = 'hidden';
loading.style.visibility = 'hidden';
let numFiles = 0;
const zip = new JSZip();
window.addEventListener('load', loadmsg);
function loadmsg() {
  const now = Date.now();
  fetch(`https://limpiapuntes.com/ext/msgv2.txt?${now}`)
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
function buy(height){
  return height * 0.86308;
}
function bux(width){
  return width * 0.144;
}
function bly(height){
  return height * 0.027;
}
function blx(width){
  return width * 0.982;
}
function auy(height){
  return height * 0.985;
}
function aux(width){
  return width * 0.02;
}
function aly(height){
  return height * 0.05;
}
function alx(width){
  return width * 0.955
}
function cola_paginas(num_paginas){
  let cola = [];
  if (num_paginas <= 10) {
    cola.push('P'); // 1
    cola.push('B'); // 2
    if (num_paginas > 2) {
      cola.push('A'); // 3
      if (num_paginas > 3) {
        if (num_paginas === 4) {
          cola.push('A') // 4
        } else {
          cola.push('P'); // 4
          cola.push('A'); // 5
          cola.push('B'); // 6
          if (num_paginas > 6) { // no existen de 5
            cola.push('A'); // 7
            if (num_paginas > 7) {
              cola.push('A'); // 8
              if (num_paginas > 8) {
                cola.push('B'); // 9
                if (num_paginas > 9) { // es 10
                  cola.push('A'); // 10
                }
              }
            }
          }
        }
      }
    }
  } else { // 11 pages or more
    if (num_paginas >= 101){ //101 pages or more
      cola.push('P'); // 1
      for(var i = 0 ; i < num_paginas - 1 ; i++){
        cola.push('A')
      }
    }
    else{ //between 11 and 101
      cola.push('P'); // 1
      cola.push('B'); // 2
      cola.push('A'); // 3
      cola.push('P'); // 4
      cola.push('A'); // 5
      cola.push('A'); // 6
      cola.push('B'); // 7
      cola.push('A'); // 8
      cola.push('A'); // 9
      cola.push('A'); // 10
      cola.push('B'); // 11
      let cont = 11;
      let restan = num_paginas - cont;
      while (restan >= 4) {
        cola.push('A');
        cola.push('A');
        cola.push('A');
        cola.push('B');
        restan = restan - 4;
      }
      if (restan === 1) {
        cola.push('A');
      } else if (restan === 2) {
        cola.push('A');
        cola.push('A');
      } else if (restan === 3) {
        cola.push('A');
        cola.push('A');
        cola.push('A');
      }
    }
  }
  return cola;
}
async function removeAds(files) {
  let checked = false;
  if (numFiles > 1) {
    checked = cbx.checked;
  }
  loading.style.visibility = 'visible';
  const processFile = async (file) => {
    try{
      if (!verificarPDF(file)) {
        errormsg.textContent = 'Alguno de los archivos seleccionados no tiene extensión .pdf';
        numFiles--;
        return;
      }
      infomsg.textContent = "Procesando " + file.name;
      const reader = new FileReader();
      const fileLoaded = new Promise((resolve) => {
        reader.onload = resolve;
      });
      reader.readAsArrayBuffer(file);
      await fileLoaded;
      const pdfData = new Uint8Array(reader.result);
      const pdfDoc = await PDFLib.PDFDocument.load(pdfData);
      const pages = pdfDoc.getPages();
      const numpaginas_original = pages.length;
      let cola = cola_paginas(numpaginas_original);
      for (const page of pages) {
        let nueva_accion = cola.shift();
        if(nueva_accion != 'P'){
          const xObjects = page.node
          .Resources()
          .lookup(PDFLib.PDFName.of('XObject'), PDFLib.PDFDict);
          const targetWidth = 390;
          const targetHeight = 71;
          let targetKey = null;
          const xObjectsArray = Array.from(xObjects.dict);
          xObjectsArray.forEach(([key, value]) => {
            if (value instanceof PDFLib.PDFRef) {
              const xObject = pdfDoc.context.lookup(value);
              if (xObject instanceof PDFLib.PDFStream) {
                const subtype = xObject.dict.lookup(PDFLib.PDFName.of('Subtype'));
                if (subtype === PDFLib.PDFName.of('Image')) {
                  const width = xObject.dict.lookup(PDFLib.PDFName.of('Width'));
                  const height = xObject.dict.lookup(PDFLib.PDFName.of('Height'));
                  console.log("wid: " + width);
                  console.log("height: " + height);
                  if (width == targetWidth && height == targetHeight) {
                    targetKey = key;
                    const imageRef = xObjects.get(targetKey);
                    pdfDoc.context.delete(imageRef);
                  }
                }
              }
            }
          });
          const { width, height } = page.getSize();
          if(nueva_accion == 'B'){
            const scaleFactor = 1.117;
            page.scale(scaleFactor, scaleFactor);
            const n_x = bux(width*scaleFactor);
            const n_y = bly(height*scaleFactor);
            const n_height = buy(height*scaleFactor)-bly(height*scaleFactor);
            const n_width = blx(width*scaleFactor)-bux(width*scaleFactor);
            page.setMediaBox(n_x, n_y, n_width, n_height);
            page.setBleedBox(n_x, n_y, n_width, n_height);
            page.setArtBox(n_x, n_y, n_width, n_height);
            page.setTrimBox(n_x, n_y, n_width, n_height);
            page.setCropBox(n_x, n_y, n_width, n_height);

          }
          else if(nueva_accion == 'A'){
            const n_x = aux(width);
            const n_y = aly(height);
            const n_height = auy(height)-aly(height);
            const n_width = alx(width)-aux(width);
            page.setMediaBox(n_x, n_y, n_width, n_height);
            page.setBleedBox(n_x, n_y, n_width, n_height);
            page.setArtBox(n_x, n_y, n_width, n_height);
            page.setTrimBox(n_x, n_y, n_width, n_height);
            page.setCropBox(n_x, n_y, n_width, n_height);
          }
        }
      }
      pdfDoc.removePage(0);
      if(numpaginas_original > 4){
        pdfDoc.removePage(2);
      }
      if(numpaginas_original == 101){
        errormsg2.textContent = 'Has adjuntado un archivo que tiene exactamente 101 páginas, y hay un error conocido para archivos con este numero de paginas en concreto, por lo que es posible que no se haya procesado correctamente. Disculpa las molestias.';
      }
      for (const page of pdfDoc.getPages()) {
        const annotationsRef = page.node.Annots();
        if (annotationsRef === undefined) continue;
        const annotations = pdfDoc.context.lookup(annotationsRef);
        const annotationsArray = annotations.asArray();
        annotationsArray.forEach((annotationRef) => {
            const annotation = pdfDoc.context.lookup(annotationRef);
            if (annotation && annotation.get(PDFLib.PDFName.of('Subtype')) === PDFLib.PDFName.of('Link')) {
              pdfDoc.context.delete(annotationRef);
            }
        });
      }
      const pdfBytes = await pdfDoc.save();
      const elblob = new Blob([pdfBytes], { type: "application/pdf" });
      let fileName = file.name;
      const extension = fileName.split(".").pop();
      const name = fileName.split(".").shift();
      const newFileName = name + "_limpiapuntes." + extension;
      if (numFiles > 1 && checked) {
        zip.file(newFileName, elblob);
      } else {
        const url = URL.createObjectURL(elblob);
        await downloadFile(newFileName, url);
      }
  } catch (error) {
    console.log(error);
    let listItem = document.createElement("li");
    listItem.innerHTML = `<p class="errormsg"> No podemos procesar el archivo: ${file.name} </p>`;
    eList.appendChild(listItem);
  }
  };
  const filesArray = Array.from(files);
  for (const file of filesArray) {
    await processFile(file);
  }
  if (checked) {
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const url_zip = URL.createObjectURL(content);
      downloadFile("procesados_limpiapuntes.zip", url_zip);
    });
  }
  loading.style.visibility = 'hidden';
  infomsg.textContent = ""
}
async function downloadFile(d_fileName, d_url) {
  chrome.downloads.download({
      url: d_url,
      filename: d_fileName,
      saveAs: false
  });
}