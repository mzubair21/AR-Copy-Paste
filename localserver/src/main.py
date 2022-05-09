from stat import filemode
from statistics import mode
from tkinter import Image
from flask import Flask , jsonify , request , send_file
from PIL import Image
from flask_cors import CORS
import logging
import requests
import time
import io
import os
 #------------------------------------#
app = Flask(__name__)
CORS(app)

LOG_FORMATE = "%(levelname)s - %(asctime)s - %(message)s"
logging.basicConfig(level=logging.DEBUG, format=LOG_FORMATE, handlers=[
        logging.StreamHandler(),
        logging.FileHandler("E:\\AR-Cut_Paste - Demo\\localserver\\debug.log", mode="w"),
    ])
 #------------------------------------#
logger = logging.getLogger()
basnet_service = 'http://u2net-predictor.tenant-compass.global.coreweave.com'
 #------------------------------------#
@app.route('/')
def helloWorld():
    logger.info("Server Started")
    return '<h1> Hello World </h1>'
 #------------------------------------#
@app.route('/ping')
def ping():
    logger.info("ping")
    r = requests.get(basnet_service)
    logging.info(f'ping: {r.status_code} {r.content}')
    return '<h1> Pinging BaseNet HTTP Server </h1>'
#------------------------------------
@app.route('/cut', methods=['POST'])
def save():
    start = time.time()
    logger.info("CUT in progress")

    if 'data' not in request.files: 
        return jsonify({
            'status' : 'error',
            'error' : 'missing files parameter as data'
        }), 400

    data = request.files['data'].read()
    if len(data) == 0:
        return jsonify({
            'status' : 'error',
            'error' : 'empty image'
        }), 400

    with open('cut_received.jpg','wb') as f:
        f.write(data)
    
    logger.info('Sending to BasNet')
    
    header={}
    files = {'data' : open('cut_received.jpg' , 'rb')}

    res = requests.post(basnet_service, headers=header, files=files)

    logger.info("Saving Results")
    with open('cut_mask.png' , 'wb') as f:
        f.write(res.content)

    logger.info('Opening Mask')
    mask = Image.open('cut_mask.png').convert("L").resize((256,256),resample=Image.BICUBIC, reducing_gap=2.0)

    logger.info('composing final Image')
    ref = Image.open(io.BytesIO(data))
    empty = Image.new("RGBA",ref.size,0)
    img = Image.composite(ref,empty,mask)

    img_scaled = img.resize((img.size[0] * 3, img.size[1] * 3))


    logging.info(' > saving final image...')
    img_scaled.save('cut_current.png')

    #------------------------------------#
    buff = io.BytesIO()
    img.save(buff, 'PNG')
    buff.seek(0)
    #------------------------------------#
    logging.info(f'Completed in {time.time() - start}s')

    return send_file(buff,mimetype='img/png')
 #------------------------------------#
if __name__ == '__main__':
    os.environ['FLASK_ENV'] = 'development'
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=True, host='192.168.0.104', port=port)