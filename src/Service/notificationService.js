import baseService from "./baseService";
import {REGISTER, DELETE_NOTIFICATION} from "./nameCloudFunction"
import {response, PrayUser} from "../model";
import firebase from 'react-native-firebase';
import {collection, ErrorCodes, firestorePaths} from "../Constants";
import I18n from "../I18n";

class NotificationService extends baseService {

    deleteNotification({notifUID} = {}) {
        const userUID = firebase.auth().currentUser.uid;
        return super.executeHttp(DELETE_NOTIFICATION, {userUID, notifUID});
    }

    updateReadStatusNotification({notifUID, read}) {
        const userUID = firebase.auth().currentUser.uid;

        if (notifUID) {
            const path = firestorePaths.NOTIFICATION.replace("{userUID}", userUID).replace("{notifUID}", notifUID);
            const doc = firebase.firestore().doc(path);
            return doc.get().then(docSnap => {
                doc.update("isRead", read);
                const result = {
                    data: {
                        success: true,
                        data: null
                    }
                };
                return result;
            }).finally(res => {
                return new response(res);
            });
        }
        else {

            const path = firestorePaths.NOTIFICATIONS.replace("{userUID}", userUID);
            const collect = firebase.firestore().collection(path);
            return collect.get().then(colSnap => {
                let batch = firebase.firestore().batch();
                colSnap.forEach(dataSnap => {
                    batch.update(dataSnap.ref, "isRead", true);
                });
                batch.commit();
                const result = {
                    data: {
                        success: true,
                        data: null
                    }
                };
                return result;
            }).finally(res => {
                return new response(res);
            });
        }
    }
}

export default NotificationService