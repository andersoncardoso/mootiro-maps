# -*- coding: utf-8 -*-
"""
Making requests:
    * via cUrl:

        curl -H "Content-type: application/json" -XGET http://localhost:8008 -d\
         '{
              "teste": "blaa"
          }'


    * via python requests:

        requests.get('http://localhost:8008/',
           headers={'Content-Type': 'application/json'},
           data=json.dumps({'teste': 'some stuff'}))

"""
from flask import Blueprint, request, jsonify
from models import Datalog

app = Blueprint('main', 'main')


@app.route('/')
def retrieve_data():
    print 'json:', request.json
    return jsonify({'method': 'GET'})


@app.route('/', methods=['POST'])
def add_data():
    datalog = Datalog(request.json)
    print 'Datalog::', datalog.to_dict()
    datalog.upsert()
    return jsonify({'method': 'POST'})
