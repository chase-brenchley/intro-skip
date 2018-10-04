import flask
from flask import request, jsonify, abort
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
    return c, database

@app.route('/', methods=['GET'])
def home():
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"

@app.route('/api/v1/skips/all', methods=['GET'])
def api_all():
    all_times = db()[0].execute('Select * FROM skips;').fetchall()
    return jsonify(all_times)

@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404

@app.route('/api/v1/skips', methods=['GET'])
def api_filter():
    # http://127.0.0.1:5000/api/v1/skips?yt_id=1Lfv5tUGsn8
    query_parameters = request.args

    id = query_parameters.get('yt_id')
    # published = query_parameters.get('published')
    # author = query_parameters.get('author')

    query = "SELECT * FROM skips WHERE yt_id=?;"
    if not (id):
        return page_not_found(404)

    results = db()[0].execute(query, [id]).fetchall()

    return jsonify(results)

@app.route('/api/v1/skips', methods=['POST'])
def create_skip():
    # curl -i -H "Content-Type: application/json" -X POST -d '{"start_time": 60, "end_time": 65, "user": "example.com", "yt_id": "jasflkdioejf"}' http://localhost:5000/api/v1/skips
    if not request.json:
        abort(400)
    
    skip = {
        'start_time': request.json['start_time'],
        'end_time': request.json['end_time'],
        'user': request.json['user'],
        'yt_id': request.json['yt_id'],
        'status': 'new'
    }

    # Add to database
    # query = f'INSERT INTO skips VALUES({skip['start_time']}, {skip['end_time']}, "{skip['user']}", 0, "{skip['yt_id']}", "{skip['status']}");'
    query = 'INSERT INTO skips VALUES(?, ?, ?, 0, ?, ?);'
    c, database = db()
    c.execute(query, (skip['start_time'], skip['end_time'], skip['user'], skip['yt_id'], skip['status']))
    database.commit()

    return jsonify({'skip': skip}), 201

app.run()