import baseService from "./baseService";
import {CREATE_PRAYER, GET_PRAYER} from "./nameCloudFunction"
import moment from "moment";
import {Pray, response, PrayUser} from "../model";
import firebase from 'react-native-firebase';
import {collection} from "../Constants";
import I18n from "../I18n";

class UserService extends baseService {

    getProfile({userUID } ={}) {
        const _userUID =  userUID || firebase.auth().currentUser.uid;
        const profileCollect = firebase.firestore().collection(collection.PROFILE);
        return profileCollect.where("uid", "==", _userUID).get().then(queryShot => {
            if (queryShot.docs[0] && queryShot.docs[0].data()) {
                return {data : {success : true , data : new PrayUser(queryShot.docs[0].data())}}
            }
            else {
                throw  {data :{success : false, message: I18n.t("cannotGetProfile")}};
            }

        }).catch(err => {
            console.log("LOG ERROR ", err);
            return err;
        }).finally(res =>{
            return new response(res)
        });
    }
}

export default UserService