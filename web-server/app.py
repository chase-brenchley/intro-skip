import flask
from flask import request, jsonify
import sqlite3

app = flask.Flask(__name__)
app.config["DEBUG"] = True

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# database = {
#     '1Lfv5tUGsn8': '60',
#     'test': '10'
# }

def db():
    database = sqlite3.connect('videos.db')
    database.row_factory = dict_factory
    c = database.cursor()
    return c

@app.route('/', methods=['GET'])
def home():
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"

@app.route('/api/v1/resources/times/all', methods=['GET'])
def api_all():
    all_times = db().execute('Select * FROM videos;').fetchall()

    return jsonify(all_times)

@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404

@app.route('/api/v1/resources/times', methods=['GET'])
def api_filter():
    # http://127.0.0.1:5000/api/v1/resources/times?id=1Lfv5tUGsn8
    query_parameters = request.args

    id = query_parameters.get('yt_id')
    # published = query_parameters.get('published')
    # author = query_parameters.get('author')

    query = "SELECT * FROM videos WHERE yt_id=?;"
    if not (id):
        return page_not_found(404)

    results = db().execute(query, [id]).fetchall()

    return jsonify(results)

app.run()