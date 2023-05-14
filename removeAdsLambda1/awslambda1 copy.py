import json
import base64
import pikepdf
from pdfrw import PdfReader, PdfWriter
from pdfrw.findobjs import wrap_object, find_objects
from pdfrw.objects import PdfName
from io import BytesIO

def lambda_handler(event, context):
    try:
        # Decodifica el archivo PDF adjunto de la petición API
        pdf_data = base64.b64decode(event['body'])
        pdf_path = BytesIO(pdf_data)

        intermediate_pdf_path = BytesIO()

        with pikepdf.Pdf.open(pdf_path) as pdf:
            
            pdf.save(intermediate_pdf_path)

        intermediate_pdf_path.seek(0)
        pdf = PdfReader(intermediate_pdf_path)
        xobjs = list(find_objects(pdf.pages, valid_subtypes=(PdfName.Form, PdfName.Dummy)))
        pages = [wrap_object(item, 1000, 0.5 * 72) for item in xobjs]

        if not xobjs:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "Success": False,
                    "Error": "No embedded pages found.",
                }),
            }

        output = BytesIO()
        writer = PdfWriter(output)
        writer.addpages(pages)
        writer.write()

        # Codifica el archivo PDF procesado en base64
        processed_pdf_data = base64.b64encode(output.getvalue()).decode('utf-8')

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/pdf",
            },
            "isBase64Encoded": True,
            "body": processed_pdf_data,
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "Success": False,
                "Error": str(e),
            }),
        }