import firebase from "react-native-firebase";
import { API_KEY } from 'react-native-dotenv';

// Initialize Firebase
const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "prayingforever-416df.firebaseapp.com",
    databaseURL: "https://prayingforever-416df.firebaseio.com",
    // storageBucket: "dailydrip-firebase-storage.appspot.com"
    storageBucket: "prayingforever-416df.appspot.com"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp