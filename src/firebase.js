import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';

firebase.initializeApp({
  apiKey: 'AIzaSyCg8V6GntuBq8v8tjReYSJqtnihK7ICmek',
  authDomain: 'react-todo-app-e42cf.firebaseapp.com',
  databaseURL: 'https://react-todo-app-e42cf.firebaseio.com',
  projectId: 'react-todo-app-e42cf',
  storageBucket: 'react-todo-app-e42cf.appspot.com',
  messagingSenderId: '1023324535270',
  appId: '1:1023324535270:web:f9f5d6db0425e710bd7e27',
});

const db = firebase.firestore();

export { firebase, db };
