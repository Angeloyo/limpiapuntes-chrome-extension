import os
import pikepdf
from pdfrw import PdfReader, PdfWriter
from pdfrw.findobjs import wrap_object, find_objects
from pdfrw.objects import PdfName

def main(pdf_data, replace=True):
    
    intermediate_pdf_path = "intermediate.pdf"
    try:
        with pikepdf.Pdf.open(io.BytesIO(pdf_data)) as pdf:
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
                "Meta": metadict
            }

        output = pdf_path[:-4] + (".pdf" if replace else "_clean.pdf")
        writer = PdfWriter(output)
        writer.addpages(pages)
        writer.write()

        # os.rename(output, output.replace('wuolah-free-', ''))
        os.remove(intermediate_pdf_path)

        return {
            "Success": True,
            "return_path": output,
            "Error": "",
            "Meta": metadict
        }
    except Exception as e:
        return {
            "Success": False,
            "return_path": "",
            "Error": str(e),
            "Meta": {}
        }
    
main()