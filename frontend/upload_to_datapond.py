import os
import boto3
import mimetypes
import logging
from decouple import config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATAPOND_ACCESS_KEY_ID = config('DATAPOND_ACCESS_KEY_ID')
DATAPOND_SECRET_ACCESS_KEY = config('DATAPOND_SECRET_ACCESS_KEY')

upload_dir = r'public/'
website_bucket=r'cmo-salesprojection'
url = 'https://go.cnb/cmo-salesprojection'


def upload_files_with_metadata(website_bucket):
    """Upload directory with contents and meta data"""
    s3 = boto3.client('s3', aws_access_key_id=DATAPOND_ACCESS_KEY_ID, 
                            aws_secret_access_key=DATAPOND_SECRET_ACCESS_KEY)
    for root, dirs, files in os.walk(upload_dir):
        for filename in files:
            # construct the full local path
            local_path = os.path.join(root, filename)
            # construct the full S3 path
            relative_path = os.path.relpath(local_path)
            s3_path = relative_path.replace(os.path.sep,'/')
            # Get content type guess  (static webistes need content type: html/text)
            content_type = mimetypes.guess_type(filename)[0]
            if content_type is None: content_type = "html/text"
            s3.upload_file(
                Bucket=website_bucket,
                Filename=local_path, 
                Key=s3_path,
                ExtraArgs={'ContentType': content_type})
                #ExtraArgs={'ContentType': 'application/javascript'})
            #print(f'Uploaded: {s3_path}')

#copy_files_to_upload_dir()
print(os.getcwd())
os.system("npm run build")
os.system("mv public public_")
os.system("mv dist public")
upload_files_with_metadata(website_bucket)
os.system("mv public dist")
os.system("mv public_ public")
try:
    os.system("git push")
except Exception as e:
    logger.error(f"Error occurred while pushing to git: {e}")
logger.info(f"\n\033[1mUpload to \033[4m\033[34m{url}\033[0m completed successfully.\n✨ 🍰 ✨\033[0m")



# rename build to public and upload to folder public