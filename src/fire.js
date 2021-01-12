import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

export function init() {
  const firebaseConfig = {
    apiKey: "AIzaSyBzJqze1qaeQ2M4HRdQ9R8FYOi2v1OrDxE",
    authDomain: "igwriter.firebaseapp.com",
    databaseURL: "https://igwriter.firebaseio.com",
    projectId: "igwriter",
    storageBucket: "igwriter.appspot.com",
    messagingSenderId: "256247588162",
    appId: "1:256247588162:web:9777531b1b3d87442a94db",
    measurementId: "G-G8LCWBTQPD"
  }
  firebase.initializeApp(firebaseConfig)
  firebase.firestore().enablePersistence()
  window.fire = firebase
}

export default firebase