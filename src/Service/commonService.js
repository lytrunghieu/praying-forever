import baseService from "./baseService";
import {ADD_REPORT} from "./nameCloudFunction";
import firebase from "react-native-firebase";
import {firestorePaths} from "../Constants";
import {response} from "../model";
class CommonService extends baseService {
    addReport({reportType, reportMessage, prayer, user} = {}) {
        const sender = {uid: firebase.auth().currentUser.uid};
        return super.executeHttp(ADD_REPORT, {reportType, reportMessage, prayer, user, sender});
    }

    getReportOption({forUser}) {
        const doc = firebase.firestore().doc(firestorePaths.TEMPLATE_REPORT);
        return doc.get().then(docSnap => {
            const result = {
                data: {
                    success: true,
                    data: null
                }
            };
            const {value} = docSnap.data();

            if (Array.isArray(value)) {
                if (forUser) {
                    result.data.data = value.filter(v => v.forUser);
                }
                else {
                    result.data.data = value.filter(v => !v.forUser);
                }
            }
            return result;
        }).finally(res => {
            return new response(res);
        })
    }
}

export default CommonService
