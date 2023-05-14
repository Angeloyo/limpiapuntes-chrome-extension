import os
import boto3
import pikepdf
from pdfrw import PdfReader, PdfWriter
from pdfrw.findobjs import wrap_object, find_objects
from pdfrw.objects import PdfName

s3 = boto3.client('s3')

def clean_pdf(event, context):
    # Get the S3 bucket and object key from the Lambda event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    pdf_path = '/tmp/input.pdf'
    intermediate_pdf_path = '/tmp/intermediate.pdf'
    output_pdf_path = '/tmp/output.pdf'

    # Download the PDF file from S3
    s3.download_file(bucket, key, pdf_path)

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

        writer = PdfWriter(output_pdf_path)
        writer.addpages(pages)
        writer.write()

        os.remove(intermediate_pdf_path)

        # Upload the modified PDF file to S3
        output_key = key.replace('.pdf', '_clean.pdf')
        s3.upload_file(output_pdf_path, bucket, output_key)

        return {
            "Success": True,
            "Error": "",
        }
    except Exception as e:
        return {
            "Success": False,
            "Error": str(e),
        }
