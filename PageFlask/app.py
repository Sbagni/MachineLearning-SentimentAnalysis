from flask import Flask, request, render_template, jsonify, redirect
import pymongo
import random
from config import dbname, dbuser, psswd, host, parameters
from flask_pymongo import PyMongo

import pandas as pd
import re
import numpy as np
import pickle
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer
from nltk import tokenize
import nltk
import tweet_grabber

app = Flask(__name__)

# setup mongo connection
mongo = PyMongo(
    app, uri='mongodb+srv://' + dbuser + ':' + psswd + host + '/' + dbname + "?" + parameters)
query = {'#tag': {"$in": ['Greta Thunberg', 'greta',
                          'Greta']}, 'module_sent_an': {"$in": ['1', '0']}}

id_global = ''


def classify_text( text ):
    # Load the model from the file
    filename = './static/models/tweet_model.sav'
    model = pickle.load(open(filename, 'rb'))
    
    # This variable was necessary due to Heroku does not load corpora/stopwords for NLTK.
    stopwords = ['i',  'me',  'my',  'myself',  'we',  'our',  'ours',  'ourselves',  'you',  "you're",  "you've",  "you'll", \
          "you'd",  'your',  'yours',  'yourself',  'yourselves',  'he',  'him',  'his',  'himself',  'she',  "she's",  'her', \
          'hers',  'herself',  'it',  "it's",  'its',  'itself',  'they',  'them',  'their',  'theirs',  'themselves',  'what',  \
          'which',  'who',  'whom',  'this',  'that',  "that'll", 'these',  'those',  'am',  'is',  'are',  'was',  'were',  \
          'be',  'been',  'being',  'have',  'has',  'had',  'having',  'do',  'does',  'did',  'doing',  'a',  'an',  'the',\
          'and',  'but',  'if',  'or',  'because',  'as',  'until',  'while',  'of',  'at',  'by',  'for',  'with',  'about',\
          'against',  'between',  'into',  'through',  'during',  'before',  'after',  'above',  'below',  'to',  'from',  'up', \
          'down',  'in',  'out',  'on',  'off',  'over',  'under',  'again',  'further',  'then',  'once',  'here',  'there',  'when', \
          'where', 'why',  'how',  'all',  'any',  'both',  'each',  'few',  'more',  'most',  'other',  'some',  'such',  'no',  'nor',\
          'not',  'only',  'own',  'same',  'so',  'than',  'too',  'very',  's',  't',  'can',  'will',  'just',  'don',  "don't", \
          'should',  "should've",  'now',  'd',  'll',  'm',  'o',  're',  've',  'y',  'ain',  'aren',  "aren't",  'couldn',  "couldn't", \
          'didn',  "didn't",  'doesn',  "doesn't",  'hadn',  "hadn't",  'hasn',  "hasn't",  'haven',  "haven't",  'isn',  "isn't",  'ma',  \
          'mightn',  "mightn't",  'mustn',  "mustn't",  'needn',  "needn't",  'shan',  "shan't",  'shouldn',  "shouldn't",  'wasn',  "wasn't",\
          'weren',  "weren't",  'won',  "won't",  'wouldn',  "wouldn't"]

    # Read a test file 
    test = pd.read_csv("./static/data/to_test.csv")

    # Remove links 
    text = re.sub(r'https?://\S+', ' ', text, flags=re.MULTILINE)
    text = re.sub(r'http?://\S+', ' ',  text, flags=re.MULTILINE)
    # Remove ampersand pattern
    text = re.sub('&amp;', ' ',         text, flags=re.MULTILINE)

    # Remove twitter patterns
    text = re.sub("@[\w]*", ' ', text, flags=re.MULTILINE)
    text = re.sub("RT :*", ' ', text, flags=re.MULTILINE)

    # Remove punctuation, numbers, and special characters
    text = re.sub("[^a-zA-Z# ]", ' ', text, flags=re.MULTILINE)

    # Remove stopwords
    token_space = tokenize.WhitespaceTokenizer()
    new_phrase = list()
    text_words = token_space.tokenize(text.lower())
    for word in text_words:
        if word not in stopwords:
            new_phrase.append(word)
    text = ' '.join(new_phrase)

    # Stemming: Basically transform variation of words like gerund in the root word. 
    from nltk import PorterStemmer   
    ps = PorterStemmer()
    tokens = text.split()
    stemmed_tokens = [ps.stem(token) for token in tokens]
    text = ' '.join(stemmed_tokens)

    # Create the tweet row to predict and add to the first position on the test    
    test.iloc[0] = ['A1', text]

    # Apply the same criteria use to create the model.
    vectorizer = CountVectorizer(lowercase=True, max_features=1300)
    bag_of_words = vectorizer.fit_transform(test['treated'].apply(lambda x: np.str_(x)))
    predited = model.predict(bag_of_words)

    # Returns the treated text and the classification 
    to_return = [ str(predited[0]), text]
    return to_return

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
    # Call function to clasify the tweet
    result = classify_text(tweet)
    to_return = result[0]

    # Check the classification
    sentiment = to_return
    if (to_return == '0'):
        sentiment += ' - Sentiment Negative'
    else: 
        sentiment += ' - Sentiment Positive'

    result = {'prediction': sentiment}
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

@app.route('/predictinput')
def predictinput():

    result = {'text': ''}
    result['img'] = 'twitter'
    result['treated'] = ''
    return render_template("predict-input.html", result=result)

@app.route('/predicttext', methods=["POST"])
def predicttext():
    # Get the text
    text = request.form['text']
    
    if ( 'predict' ==  request.form['action']):
        # Call function to clasify the tweet
        to_return = classify_text(text)
        classification = to_return[0]

        img = ''
        if (classification == '0'):
            img = 'NEGATIVE'
        else: 
            img = 'POSITIVE'

        result = {'text': text}
        result['img'] = img
        result['treated'] = to_return[1]
    else: 
        # Get a tweet on the fly
        text = tweet_grabber.run_api('Greta')
        result = {'text': text}
        result['img'] = 'twitter'
        result['treated'] = ''
    
    return render_template("predict-input.html", result=result)

if __name__ == "__main__":
    app.run(debug=True)
