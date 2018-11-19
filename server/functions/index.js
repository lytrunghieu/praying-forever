// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

const {paths} = require("./constrants");

const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();

const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original


function sendMessage({pushToken, payload}) {
    return admin.messaging().sendToDevice(pushToken, payload);
}

function addNotification({userUID, payload}) {
    const {created, title, content, owner} = payload;
    const path = paths.notification.replace("{userUID}", userUID);
    return firestore.collection(path).add(payload).then(res => {
        return res.update("uid", res.id , "created", admin.firestore.FieldValue.serverTimestamp()).then(res2 =>{
            return res2;
        });
    }).catch(error => {
        console.log("LOG ERROR", error);
        throw new functions.https.HttpsError(
            "unknown", // code
            'request failed', // message
            {success: false, statusCode: 400, body: data, errorDescription: error}
        );
    });
}

exports.updateStatusPrayer =  functions.https.onCall( data => {
    const {userUID, prayUID} = data;
    const path = paths.pray.replace("{userUID}", userUID).replace("{prayUID}", prayUID);
    return firestore
        .doc(path)
        .get()
        .then( doc =>  {
            const {following, title, complete, status} = doc.data();
            const docRef = doc.ref;
            const promiseUpdateStatus = docRef.update("status", status === 1 ?  0 : 1);
            if (!complete && status === 0) {
                const promiseUpdateComplete = docRef.update("complete", true);
                const titleNotif = "Lời Cầu Nguyện Đã Ứng Nghiệm";
                let pushFcmToken = [];
                let promiseRace = [promiseUpdateStatus , promiseUpdateComplete];
                following.map(fol => {
                    const pathToken = "tokens/{userUID}".replace("{userUID}", fol);
                    const paramAddNotification = {
                        payload: {
                            title: titleNotif,
                            content: title,
                            owner: fol,
                            isRead : false,
                            created :"",
                            uid :"",
                        },
                        userUID: fol
                    };

                    const promiseAllNotification =  addNotification(paramAddNotification);

                    const promise = firestore.doc(pathToken).get().then(docToken => {
                        pushFcmToken.push(docToken.data().token);
                        return docToken;
                    });
                    promiseRace.push(promise);
                    promiseRace.push(promiseAllNotification);

                    return fol;
                });
                return Promise.race(promiseRace).then(() => {
                    let payload = {
                        notification: {
                            title: titleNotif,
                            body: title,
                            sound: "default"
                        }
                    };
                    if(pushFcmToken && pushFcmToken.length > 0){
                        return sendMessage({pushToken: pushFcmToken, payload}).then(() => {
                            return {success: true, statusCode: 200, message: "request success"};
                        });
                    }
                    else{
                        return {success: true, statusCode: 200, message: "request success"};
                    }

                });
            }
            else {
                return {success: true, statusCode: 200, message: "request success"};
            }
        }).catch(error => {
            console.log("LOG ERROR", error);
            throw new functions.https.HttpsError(
                "unknown", // code
                'request failed', // message
                {success: false, statusCode: 400, body: data, errorDescription: error.toString()}
            );
        });
});

exports.deleteNotification = functions.https.onCall((data) => {
    const {userUID, notifUID} = data;
    let path = paths.deleteAllNotification.replace("{userUID}", userUID);
    if (notifUID) {
        path = paths.deleteNotification.replace("{userUID}", userUID).replace("{notifUID}", notifUID);
        return firestore
            .doc(path)
            .delete()
            .then(doc => {
                return {success: true, statusCode: 200, message: "request success"};
            }).catch(error => {
                console.log("LOG ERROR", error);
                throw new functions.https.HttpsError(
                    "unknown", // code
                    'request failed', // message
                    {success: false, statusCode: 400, body: data, errorDescription: error}
                );
            });
    }
    else {

        return firestore.collection(path).get().then(snap => {
            let batch = firestore.batch();
            snap.forEach(docSnap => {
                batch.delete(docSnap.ref)
            });
            return batch.commit().then(write => {
                return {success: true, statusCode: 200, message: "request success"};
            });

        }).catch(error => {
            console.log("LOG ERROR", error);
            throw new functions.https.HttpsError(
                "unknown", // code
                'request failed', // message
                {success: false, statusCode: 400, body: data, errorDescription: error.toString()}
            );
        });
    }
});

exports.deletePray = functions.https.onCall((data) => {

    const {userUID, prayUID} = data;


    let path = paths.deleteAllPray.replace("{userUID}", userUID);

    if (prayUID) {

        path = paths.deletePray.replace("{userUID}", userUID).replace("{prayUID}", prayUID);
        return firestore
            .doc(path)
            .delete()
            .then(doc => {
                return {success: true, statusCode: 200, message: "request success"};
            }).catch(error => {
                console.log("LOG ERROR", error);
                throw new functions.https.HttpsError(
                    "unknown", // code
                    'request failed', // message
                    {success: false, statusCode: 400, body: data, errorDescription: error.toString()}
                );
            });
    }
    else {
        return firestore.collection(path).get().then(snap => {
            let batch = firestore.batch();
            snap.forEach(docSnap => {
                batch.delete(docSnap.ref)
            });
            return batch.commit().then(write => {
                return {success: true, statusCode: 200, message: "request success"};
            });

        }).catch(error => {
            console.log("LOG ERROR", error);
            throw new functions.https.HttpsError(
                "unknown", // code
                'request failed', // message
                {success: false, statusCode: 400, body: data, errorDescription: error.toString()}
            );
        });
    }
});

exports.following = functions.https.onCall((data) => {
    const {userUID, prayUID,userOtherUID} = data;
    let path = paths.pray.replace("{userUID}", userOtherUID).replace("{prayUID}",prayUID);
    return firestore.doc(path).get().then(docSnap =>{
       if(docSnap.data() && docSnap.data().status === 0){
           let {following} = docSnap.data();
           let hasFollowing =true
           if(following && following.length > 0 ){
               let index = following.findIndex(fo => fo ===userUID);
               if(index === -1){
                   hasFollowing = false;
               }
           }
           else{
               hasFollowing = false
           }
           if(!hasFollowing){
               following.push(userUID);
               docSnap.ref.update("following", following);
               let path = paths.pray.replace("{userUID}", userUID).replace("{prayUID}",prayUID);
               let newData = docSnap.data();
               newData.following = following;
               return firestore.doc(path).set( newData).then(res=>{
                   return {success: true, statusCode: 200, message: "request success"};
               });
           }
           else {
               following = following.filter(fol => fol !== userUID);
               docSnap.ref.update("following", following);
               let path = paths.deletePray.replace("{userUID}", userUID).replace("{prayUID}", prayUID);
               return firestore
                   .doc(path)
                   .delete()
                   .then(doc => {
                       return {success: true, statusCode: 200, message: "request success"};
                   }).catch(error => {
                       console.log("LOG ERROR", error);
                       throw new functions.https.HttpsError(
                           "unknown", // code
                           'request failed', // message
                           {success: false, statusCode: 400, body: data, errorDescription: error.toString()}
                       );
                   });
           }

       }
       else{
           return {success: false, statusCode: 401, message: "not found prayer"};
       }
    }).catch(error => {
        console.log("LOG ERROR", error);
        throw new functions.https.HttpsError(
            "unknown", // code
            'request failed', // message
            {success: false, statusCode: 400, body: data, errorDescription: error.toString()}
        );
    });
});


exports.onCreatePray = functions.firestore
    .document("test/{doc}")
    .onUpdate(event => {
        console.log("onUpdatepray");
        console.log("DATA:", event);
    });

