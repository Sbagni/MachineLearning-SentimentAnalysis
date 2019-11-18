from flask import Flask,request, render_template, jsonify, redirect
import pymongo
import random
from config import dbname, dbuser, psswd, host, parameters
from flask_pymongo import PyMongo

import pandas as pd
import re
import numpy as np
from sklearn.externals import joblib 
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer

app = Flask(__name__)

# setup mongo connection
mongo = PyMongo(
    app, uri='mongodb+srv://' + dbuser + ':' + psswd + host + '/' + dbname + "?" + parameters)
query = {'#tag': {"$in": ['Greta Thunberg', 'greta',
                          'Greta']}, 'module_sent_an': {"$in": ['1', '0']}}



# Function to remove some twitter patterns
def clear_text(text, pattern):
    
    # Find the pattern
    r = re.findall(pattern, text)
    
    # Removes the pattern from the sentence
    for i in r:
        text = re.sub(i,"",text)
    
    return text


@app.route('/twitter')
def twitter():
    query_custom = {'#tag': {"$in": ['Greta Thunberg', 'greta',
                                     'Greta']}}
    docs = []
    for doc in mongo.db.twitter.find(query_custom):
        doc.pop('_id')
        docs.append(doc)
    return jsonify(docs)

@app.route('/getnewtwitter')
def getnewtwitter():
    query_custom = {'#tag': {"$in": ['Greta Thunberg', 'greta',
                                     'Greta']}}
    docs = []
    for doc in mongo.db.twitter.find(query_custom):
        doc.pop('_id')
        docs.append(doc)
    return jsonify(docs)


@app.route('/predict', methods=["POST"])
def predict():

    # Get the tweet
    tweet = request.form['tweet']

    # Load the model from the file 
    model = joblib.load('./static/models/tweet_model.sav') 
    # Read a test file 
    # test = pd.read_csv("./static/data/test_treated.csv")
    test = pd.read_csv("./static/data/tweets_not_labelled.csv")
    
    # Create the row predict tweet and add to test    
    test.iloc[0] = ['A1', '',tweet,'']

    # Treat the text
    test['treated'] = np.vectorize(clear_text)(test['tweet'], "@[\w]*")
    test['treated'] = np.vectorize(clear_text)(test['treated'], "RT :*")
    # Remove punctuation, numbers, and special characters
    test['treated'] = test['treated'].str.replace("[^a-zA-Z#]", " ")

    vectorizer = CountVectorizer(lowercase=True, max_features=1300)
    bag_of_words = vectorizer.fit_transform(test['treated'])
    predited = model.predict(bag_of_words)

    # Check the Sentiment returned
    to_return = str(predited[0])
    if (to_return == '0'):
        to_return += ' - Sentiment Negative'
    else: 
        to_return += ' - Sentiment Positive'


    result = {'prediction': to_return}
    result['text'] = tweet
    result['textblob'] = request.form['textblob']
    result['module_sent_an'] = request.form['human']

    return render_template("index.html", result=result)

@app.route('/label')
def label():
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
    result['prediction'] = ''
    # render an index.html template and pass it the data you retrieved from the database
    return render_template("index.html", result=result)

# just for future consultation


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


if __name__ == "__main__":
    app.run(debug=True)
