import flask
from flask import request, jsonify
app = flask.Flask(__name__)
app.config["DEBUG"] = True

database = {
    '1Lfv5tUGsn8': '60',
    'test': '10'
}

@app.route('/', methods=['GET'])
def home():
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"

@app.route('/api/v1/resources/times/all', methods=['GET'])
def api_all():
    return jsonify(database)

app.run()