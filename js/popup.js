let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let numOfFiles = document.getElementById("num-of-files");

fileInput.addEventListener('change', async function () {
    const files = this.files;
    numOfFiles.textContent = `${fileInput.files.length} Files Selected`;
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
});