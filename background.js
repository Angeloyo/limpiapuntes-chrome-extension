chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.action === 'browse')
    {
      var myForm=document.createElement("FORM");
      var myFile=document.createElement("INPUT");
      myFile.type="file";
      myFile.id="selectFile";
      myFile.onclick="openDialog()";
      myForm.appendChild(myFile);
      var myButton=document.createElement("INPUT");
      myButton.name="submit";
      myButton.type="submit";
      myButton.value="Submit";
      myForm.appendChild(myButton);
      document.body.appendChild(myForm);
    }
  });