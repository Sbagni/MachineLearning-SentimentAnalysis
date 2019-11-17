from flask import Flask, render_template, jsonify, redirect
import pymongo
import random
from config import dbname, dbuser, psswd, host, parameters
from flask_pymongo import PyMongo

app = Flask(__name__)

# setup mongo connection
mongo = PyMongo(
    app, uri='mongodb+srv://' + dbuser + ':' + psswd + host + '/' + dbname + "?" + parameters)
# app, uri="mongodb+srv://ai_user:ai_user123@project2-ha8my.mongodb.net/dbAI?retryWrites=true&w=majority")
query = {'#tag': {"$in": ['Greta Thunberg', 'greta',
                          'Greta']}, 'module_sent_an': {"$in": ['1', '0']}}


@app.route('/twitter')
def jsonified():
    docs = []
    for doc in mongo.db.twitter.find(query):
        doc.pop('_id')
        docs.append(doc)
    return jsonify(docs)


@app.route('/plot')
def plot():
    return render_template("plot.html")


@app.route('/')
def index():
    # retrieving a random text from twitter and get a random message based on the query
    count = mongo.db.twitter.find(query).count()
    result = mongo.db.twitter.find(query)[random.randrange(count)]

    # render an index.html template and pass it the data you retrieved from the database
    return render_template("index.html", result=result)


@app.route("/map")
def init():
    return render_template("map.html")


@app.route("/filterLessRange_IG_Rank/<value>")
def filterRankRange(value):
    # return items from a different collection (international_gross_det) base on the rank
    value = int(value)
    docs = []
    # select data less or equal the rank selected
    for doc in mongo.db.international_gross_det.find({'rank': {'$lte': value}}):
        doc.pop('_id')
        docs.append(doc)
    return jsonify(docs)


@app.route("/filterLessEq_IG_Rank/<value>")
def filterRank(value):
    # return items from a different collection (international_gross_det) base on the rank
    value = int(value)
    docs = []
    # select data equal the rank selected
    for doc in mongo.db.international_gross_det.find({'rank': value}):
        doc.pop('_id')
        docs.append(doc)
    return jsonify(docs)


if __name__ == "__main__":
    app.run(debug=True)
