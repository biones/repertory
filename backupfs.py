import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from firebase_admin import auth
import pandas as pd
import inspect


cred = firebase_admin.credentials.Certificate('./repertory-b7e36-firebase-adminsdk-u7fpv-7af71cb96a.json')
default_app = firebase_admin.initialize_app(cred)


db = firestore.client()
docs = db.collection('users').get()
for doc in docs:
    #print(inspect.getmembers(doc))
    print(inspect.getmembers(doc.reference))
    ref=doc.reference
    #print(ref)
    d=ref.collections("repertroy").oc("repertory")
    print(d)



