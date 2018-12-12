// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// Babel output - with Babel REPL settings:
// * prettify
// * preset-env Node v6.9
"use strict";

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
        return res.update("uid", res.id, "created", admin.firestore.FieldValue.serverTimestamp()).then(res2 => {
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

exports.updateStatusPrayer = functions.https.onCall(data => {
    const {userUID, prayUID} = data;
    const path = paths.pray.replace("{userUID}", userUID).replace("{prayUID}", prayUID);
    return firestore
        .doc(path)
        .get()
        .then(doc => {
            const {following, title, complete, status} = doc.data();
            const docRef = doc.ref;
            const promiseUpdateStatus = docRef.update("status", status === 1 ? 0 : 1);
            if (!complete && status === 0) {
                const promiseUpdateComplete = docRef.update("complete", true);
                const titleNotif = "Lời Cầu Nguyện Đã Ứng Nghiệm";
                let pushFcmToken = [];
                let promiseRace = [promiseUpdateStatus, promiseUpdateComplete];
                following.map(fol => {
                    const pathToken = "tokens/{userUID}".replace("{userUID}", fol);
                    const paramAddNotification = {
                        payload: {
                            title: titleNotif,
                            content: title,
                            owner: fol,
                            isRead: false,
                            created: "",
                            uid: "",
                        },
                        userUID: fol
                    };

                    const promiseAllNotification = addNotification(paramAddNotification);

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
                    if (pushFcmToken && pushFcmToken.length > 0) {
                        return sendMessage({pushToken: pushFcmToken, payload}).then(() => {
                            return {success: true, statusCode: 200, message: "request success"};
                        });
                    }
                    else {
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
    admin.auth().createUser()
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
    const {userUID, prayUID, userOtherUID} = data;
    let path = paths.pray.replace("{userUID}", userOtherUID).replace("{prayUID}", prayUID);
    return firestore.doc(path).get().then(docSnap => {
        if (docSnap.data() && docSnap.data().status === 0) {
            let {following} = docSnap.data();
            let hasFollowing = true
            if (following && following.length > 0) {
                let index = following.findIndex(fo => fo === userUID);
                if (index === -1) {
                    hasFollowing = false;
                }
            }
            else {
                hasFollowing = false
            }
            if (!hasFollowing) {
                following.push(userUID);
                docSnap.ref.update("following", following);
                let path = paths.pray.replace("{userUID}", userUID).replace("{prayUID}", prayUID);
                let newData = docSnap.data();
                newData.following = following;
                return firestore.doc(path).set(newData).then(res => {
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
        else {
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

exports.createUser = functions.https.onCall((data) => {
    const {email, password, firstName, lastName, birthDay, gender} = data;

    return admin.auth().createUser({
        email,
        emailVerified: false,
        password,
        displayName: firstName.concat(" ").concat(lastName),
        disabled: false
    })
        .then(userRecord => {
            let path = "profile";
            return firestore.collection(path).add({
                displayName: firstName.concat(" ").concat(lastName),
                email: email,
                gender: gender || 0,
                birthDay,
                uid: userRecord.uid,
                created: admin.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                return {success: true, statusCode: 200, message: "request success"};
            }).catch(error => {
                console.log("LOG ERROR", error);
                throw new functions.https.HttpsError(
                    "unknown", // code
                    'request failed', // message
                    {success: false, statusCode: 400, body: data, errorDescription: error.toString()}
                );
            })
        })
        .catch(function (error) {
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


//region API INTERNAL

exports.testAPI = functions.https.onRequest((req, res) => {
    const key = req.headers["private-key"];
    if (key !== "AIzaSyB8Y2nE-6_Q8hvJhRwNWUm77JpcuYDnSYE") {
        res.send("request failed");
        return
    }
    const message = "request success";
    res.send(message);
});

exports.deleteUser = functions.https.onRequest(async(req, res) => {
    const key = req.headers["private-key"];
    if (key !== "AIzaSyB8Y2nE-6_Q8hvJhRwNWUm77JpcuYDnSYE") {
        res.send("request failed");
        return
    }
    const {uid} = req.query;
    let messages = [];
    const queryDeleteProfile = firestore.collection("profile").where("uid", "==", uid);
    //delete profile
    const promiseDeleteProfile = await queryDeleteProfile.get().then(queryShot => {
        if (queryShot.docs[0] && queryShot.docs[0].ref) {
            queryShot.docs[0].ref.delete().then(() => {
                messages.push("delete profile success");
                return true;
            }).catch(error => {
                console.log("LOG ERROR", error);
                messages.push("delete profile failed :" + error)
            });
        }
        else {
            messages.push("can not find profile");
        }
        return true;


    }).catch(error => {
        console.log("LOG ERROR", error);
        messages.push("delete profile failed :" + error)
    });

    //delete prayer
    const promiseDeletePray = await firestore.collection("pray").doc(uid).get().then(snap => {
        if (snap.ref) {
            snap.ref.delete().then(() => {
                messages.push("delete prayer success");
                return true;
            }).catch(error => {
                console.log("LOG ERROR", error);
                messages.push("delete prayer failed :" + error)
            })
        }
        else {
            messages.push("can not found prayer");

        }
        return true;

    }).catch(error => {
        console.log("LOG ERROR", error);
        messages.push("delete prayer failed :" + error)

    });

    //delete nofication
    const promiseDeleteNotification = await firestore.collection("notification").doc(uid).get().then(snap => {
        if (snap.ref) {
            snap.ref.delete().then(() => {
                messages.push("delete notification success");
                return true;
            }).catch(error => {
                console.log("LOG ERROR", error);
                messages.push("delete notification failed :" + error)

            })
        }
        else {
            messages.push("can not found notification");

        }
        return true;

    }).catch(error => {
        console.log("LOG ERROR", error);
        messages.push("delete notification failed :" + error)

    });

    //delete location
    const promiseDeleteLocation = await firestore.collection("location").doc(uid).delete().then(() => {
        messages.push("delete location success");
        return true;
    }).catch(error => {
        console.log("LOG ERROR", error);
        messages.push("delete location failed :" + error)
    });

    const promiseDeleteUser = await admin.auth().deleteUser(uid).then(()=>{
        messages.push("delete user success");
        return true;
    }).catch(error =>{
        console.log("LOG ERROR", error);
        messages.push("delete user failed :" + error)
    })

    return Promise.race([
        promiseDeleteProfile,
        promiseDeletePray,
        promiseDeleteNotification,
        promiseDeleteLocation
    ]).then(() => {

        return res.send(messages);
    }).catch(e => {
        console.log("ERROR ", e);
        res.send("request failed")
    });

});
//endregion

//TODO: will use for furtur
// exports.onDeleteUser = functions.auth.user().onDelete((user) => {
//     let path = "profile";
//     const query = firestore.collection(path).where("uid", "==", user.uid);
//     return query.get(docSnap => {
//         if (docSnap.ref) {
//             console.log("Step1", docSnap.data())
//             return docSnap.ref.delete().then(() => {
//                 console.log("Success");
//                 return {success: true, statusCode: 200, message: "request success"};
//             }).catch(error => {
//                 console.log("LOG ERROR", error);
//                 throw new functions.https.HttpsError(
//                     "unknown", // code
//                     'request failed', // message
//                     {success: false, statusCode: 400, body: data, errorDescription: error.toString()}
//                 );
//             });
//         }
//         else {
//             throw new functions.https.HttpsError(
//                 "unknown", // code
//                 'request failed', // message
//                 {success: false, statusCode: 401, body: data, errorDescription: "user is not found"}
//             );
//         }
//     }).catch(function (error) {
//         console.log("LOG ERROR", error);
//         throw new functions.https.HttpsError(
//             "unknown", // code
//             'request failed', // message
//             {success: false, statusCode: 400, body: data, errorDescription: error.toString()}
//         );
//     });
// });