import * as firebase from 'firebase/app'

import 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_APP_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_APP_ID}.firebaseio.com`,
  projectId: process.env.REACT_APP_FIREBASE_APP_ID
}

firebase.initializeApp(firebaseConfig)

firebase.auth().useDeviceLanguage()

export const googleProvider = new firebase.auth.GoogleAuthProvider()

export default firebase
