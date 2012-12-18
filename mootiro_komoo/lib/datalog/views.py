# -*- coding: utf-8 -*-
from flask import Blueprint, request, jsonify
from models import Datalog

app = Blueprint('main', 'main')


@app.route('/')
def retrieve_data():
    # curl -H "Content-type: application/json" -XGET http://localhost:5000 -d\
    #  '{
    #       "teste": "blaa"
    #   }'
    print 'json:', request.json
    print type(request.json)
    return jsonify({'method': 'GET'})


@app.route('/', methods=['POST'])
def add_data():
    # requests.get('http://localhost:5000/',
    #    headers={'Content-Type': 'application/json'},
    #    data=json.dumps({'teste': 'some stuff'}))
    print 'json:', request.json
    print type(request.json)
    # datalog = Datalog(request.json)
    # datalog.save()
    return jsonify({'method': 'POST'})
