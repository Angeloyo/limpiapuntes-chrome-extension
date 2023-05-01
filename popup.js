const inputArchivo = document.getElementById('inputArchivo');
const botonCargar = document.getElementById('botonCargar');
const resultado = document.getElementById('resultado');
const spawner = require('child_process').spawn;

botonCargar.addEventListener('click', () => {
    const archivoSeleccionado = inputArchivo.files[0];
    if (archivoSeleccionado) {
        const reader = new FileReader();
        reader.onload = async function (event) {
            const pdfData = new Uint8Array(event.target.result);
            //const pdfDocument = await pdfjsLib.getDocument({data: pdfData}).promise;
            //resultado.textContent = 'Número de páginas: ' + pdfDocument.numPages;
            const python_process = spawner('python', ['./command_line.py', pdfData]);
            python_process.stdout.on('data', (data) => {
                console.log('data received', data)
            })
        };
        reader.readAsArrayBuffer(archivoSeleccionado);
    } else {
        console.log('No se ha seleccionado ningún archivo');
    }
});
