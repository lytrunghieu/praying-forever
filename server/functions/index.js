// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

const {paths} = require("./constrants");

const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original


function sendMessage({pushToken, payload}) {
    return admin.messaging().sendToDevice(pushToken, payload);
}

function addNotification({userUID, payload}) {
    const {created, title, content, owner} = payload;
    const path = paths.notification.replace("{userUID}", userUID);
    return firestore.collection(path).add(payload).then(res => {
        res.set({uid: res.id}, {merge: true});
        return res;
    }).catch(error => {
        console.log("LOG ERROR", error);
        throw new functions.https.HttpsError(
            "unknown", // code
            'request failed', // message
            {success: false, statusCode: 400, body: data, errorDescription: error}
        );
    });
}


exports.completePrayer = functions.https.onCall((data) => {
    const {userUID, prayUID} = data;
    const path = paths.pray.replace("{userUID}", userUID).replace("{prayUID}", prayUID);
    return firestore
        .doc(path)
        .get()
        .then(doc => {
            const {following, title, complete} = doc.data();
            const docRef = doc.ref;
            docRef.update("status", 1);
            if (!complete) {
                docRef.update("complete", true);
                const titleNotif = "Lời Cầu Nguyện Đã Ứng Nghiệm";
                const created = new Date().getTime();
                let pushFcmToken = [];
                let promiseRace = [];
                following.map(fol => {
                    const pathToken = "tokens/{userUID}".replace("{userUID}", fol);
                    const paramAddNotification = {
                        payload: {
                            title: titleNotif,
                            content: title,
                            created,
                            owner: fol
                        },
                        userUID: fol
                    };

                    addNotification(paramAddNotification);

                    const promise = firestore.doc(pathToken).get().then(docToken => {
                        pushFcmToken.push(docToken.data().token);
                        return docToken;
                    });
                    promiseRace.push(promise);
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
                    return sendMessage({pushToken: pushFcmToken, payload}).then(() => {
                        return {success: true, statusCode: 200, message: "request success"};
                    });
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

exports.onCreatePray = functions.firestore
    .document("test/{doc}")
    .onUpdate(event => {
        console.log("onUpdatepray");
        console.log("DATA:", event);
    });

