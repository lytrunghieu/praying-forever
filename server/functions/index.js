// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original


function sendMessage({pushToken, payload}){
    return admin.messaging().sendToDevice(pushToken, payload);
}

exports.addMessage = functions.https.onRequest((req, res) => {
    const {token, title, message, userUID,prayUID} = req.query;
    const path = "pray/{userUID}/data/{prayUID}".replace("{userUID}",userUID).replace("{prayUID}",prayUID);
    // console.log("path ", path);      
    return firestore
      .doc(path)
      .get()
      .then(doc => {
        const {following}  = doc.data();
        const countFcmToken = following.length;
        let pushFcmToken = [];
        let promiseRace = [];
        following.map(fol =>{
                const pathToken = "tokens/{userUID}".replace("{userUID}",fol);
                const promise = firestore.doc(pathToken).get().then(docToken =>{
                    pushFcmToken.push(docToken.data().token);
                    return res;
                });
                promiseRace.push(promise);
        });
        return Promise.race(promiseRace).then(value =>{
            // console.log("pushFcmToken ", pushFcmToken);
             let payload = {
                  notification: {
                      title:"Title", 
                      body:"Body",
                      sound :"default"
                    }
            };
            return sendMessage({pushToken : pushFcmToken , payload}).then(res =>{
                return res.status("200").send({ success : true , message :"send message success" });
            });
        });       
      }).catch(error =>{
        console.log("LOG ERROR", error);
        res.status("400").send({ success : false , message :"request failed" });
      });
});


// exports.sendPushNotification = functions.firestore
//   .document("some_collection/{some_document}")
//   .onCreate(event => {
//     // gets standard JavaScript object from the new write
//     const writeData = event.data.data();
//     // access data necessary for push notification 
//     const sender = writeData.uid;
//     const senderName = writeData.name;
//     const recipient = writeData.recipient;
//     // the payload is what will be delivered to the device(s)
//     let payload = {
//       notification: {
//       title:"Title", 
//       body:"Body"
//      }
//     };
//     // either store the recepient tokens in the document write
//     const tokens = writeData.tokens;  
//     return admin.messaging().sendToDevice(tokens, payload);
    
//     // or collect them by accessing your database
//     // var pushToken = "";
//     // return functions
//     //   .firestore
//     //   .collection("user_data_collection/recipient")
//     //   .get()
//     //   .then(doc => {
//     //      pushToken = doc.data().token;
//     //      // sendToDevice can also accept an array of push tokens
//     //      return admin.messaging().sendToDevice(pushToken, payload);
//     //   });
// });


// firestore.doc(pathToken).get().then(docToken =>{
//     const fcmToken = docToken.data();
//     pushFcmToken.push(fcmToken);
//     if(pushFcmToken.length === countFcmToken){
//         let payload = {
//                   notification: {
//                   title:"Title", 
//                   body:"Body"
//             }
//         }
//         sendMessage({pushToken : pushFcmToken , payload})
//         .then(res =>{
//             resolve("success");
//             return res.status("200").send({ success : true , message :"send message success" });
//         }).catch(error =>{
//             reject(error);
//         });
//     }
//     return fcmToken;
// }).catch(error =>{
//     // console.log("LOG ERROR: ", error);
//     // return res.status("400").send({ success : false , message :"request failed" });
//     reject(error);
// });