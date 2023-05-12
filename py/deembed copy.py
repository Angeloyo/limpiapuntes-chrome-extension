import sys
import os
import pikepdf
from pdfrw import PdfReader, PdfWriter
from pdfrw.findobjs import wrap_object, find_objects
from pdfrw.objects import PdfName

def main():
    
    # Get the filename argument
    if len(sys.argv) < 2:
        print('no file provided!')
        return
    pdf_path = sys.argv[-1]

    replace=True

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
                "Error": "No embedded pages found.",
            }

        output = pdf_path[:-4] + (".pdf" if replace else "_clean.pdf")
        writer = PdfWriter(output)
        writer.addpages(pages)
        writer.write()

        os.rename(output, output.replace('wuolah-free-', ''))
        os.remove(intermediate_pdf_path)

        return {
            "Success": True,
            "Error": "",
        }
    except Exception as e:
        return {
            "Success": False,
            "Error": str(e),
        }

main()