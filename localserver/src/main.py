from stat import filemode
from statistics import mode
from flask import Flask 
import logging
import os

app = Flask(__name__)
LOG_FORMATE = "%(levelname)s - %(asctime)s - %(message)s"
logging.basicConfig(level=logging.DEBUG, format=LOG_FORMATE, handlers=[
        logging.StreamHandler(),
        logging.FileHandler("E:\\AR-Cut_Paste\\localserver\\debug.log", mode="w"),
    ])

logger = logging.getLogger()

@app.route('/')
def helloWorld():
    logger.info("Server Started")
    return '<h1> Hello World </h1>'

@app.route('/ping')
def ping():
    logging.info("ping")
    return '<h1> Pinging BaseNet HTTP Server </h1>'


if __name__ == '__main__':
    os.environ['FLASK_ENV'] = 'development'
    port = int(os.environ.get('port',8080))
    app.run(debug=True, host='192.168.0.103', port=port)