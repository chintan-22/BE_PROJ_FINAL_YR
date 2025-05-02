const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, child } = require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyD3E2UgTKUJ4pAimCXj-ubBbwW2ZG192GM",
    authDomain: "precisionfarming-216d3.firebaseapp.com",
    databaseURL: "https://precisionfarming-216d3-default-rtdb.firebaseio.com",
    projectId: "precisionfarming-216d3",
    storageBucket: "precisionfarming-216d3.firebasestorage.app",
    messagingSenderId: "408446526312",
    appId: "1:408446526312:web:f92e9441c62cf5203bacdd",
    measurementId: "G-KQ65K4XYCW"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db, ref, get, child };
