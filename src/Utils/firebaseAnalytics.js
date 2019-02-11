import RNFirebase from 'react-native-firebase';
const configurationOptions = {
  debug: true
};

const firebase = RNFirebase.initializeApp(configurationOptions);

export default function (pageName) {
  firebase.analytics().setCurrentScreen(pageName);
  firebase.crashlytics().log(pageName);
  // firebase.crashlytics().crash();
}
