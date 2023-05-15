from flask import Flask, request, send_file
from flask_cors import CORS
import os
import pikepdf
from pdfrw import PdfReader, PdfWriter
from pdfrw.findobjs import wrap_object, find_objects
from pdfrw.objects import PdfName
import tempfile

app = Flask(__name__)
CORS(app)

def procesar_archivo_pdf(pdf_path):
    
    intermediate_pdf_path = pdf_path[:-4] + "_inter.pdf"
    try:
        with pikepdf.Pdf.open(pdf_path) as pdf:
            pdf.save(intermediate_pdf_path)

        pdf = PdfReader(intermediate_pdf_path)
        xobjs = list(find_objects(pdf.pages, valid_subtypes=(PdfName.Form, PdfName.Dummy)))
        pages = [wrap_object(item, 1000, 0.5 * 72) for item in xobjs]

        if not xobjs:
            os.remove(intermediate_pdf_path)
            return {
                "Success": False,
                "return_path": "",
                "Error": "No embedded pages found.",
            }

        output = pdf_path[:-4] + ("_clean.pdf")
        writer = PdfWriter(output)
        writer.addpages(pages)
        writer.write()

        os.remove(intermediate_pdf_path)

        return {
            "Success": True,
            "return_path": output,
            "Error": "",
        }
    except Exception as e:
        return {
            "Success": False,
            "return_path": "",
            "Error": str(e),
        }

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return {"Success": False, "Error": "No file part in the request."}, 400

        file = request.files['file']
        if file.filename == '':
            return {"Success": False, "Error": "No file selected."}, 400

        if file:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
                file.save(temp_pdf.name)
                result = procesar_archivo_pdf(temp_pdf.name)
                temp_pdf.close()  # Close the file before removing it
                os.remove(temp_pdf.name)

            if result["Success"]:
                return send_file(result["return_path"], as_attachment=True, download_name=os.path.basename(result["return_path"]))
            else:
                return {"Success": False, "Error": result["Error"]}, 500

    return {"Success": False, "Error": "Invalid request method."}, 405

if __name__ == '__main__':
    app.run()
