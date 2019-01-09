import baseService from "./baseService";
import {REGISTER} from "./nameCloudFunction"
import moment from "moment";
import {Pray, response, PrayUser} from "../model";
import firebase from 'react-native-firebase';
import {collection, ErrorCodes} from "../Constants";
import I18n from "../I18n";

class UserService extends baseService {

    getProfile({userUID} = {}) {
        const _userUID = userUID || firebase.auth().currentUser.uid;
        const profileCollect = firebase.firestore().collection(collection.PROFILE);
        return profileCollect.where("uid", "==", _userUID).get().then(queryShot => {
            if (queryShot.docs[0] && queryShot.docs[0].data()) {
                return {data: {success: true, data: new PrayUser(queryShot.docs[0].data())}}
            }
            else {
                throw  {data: {success: false, message: I18n.t("cannotGetProfile")}};
            }

        }).catch(err => {
            console.log("LOG ERROR ", err);
            return err;
        }).finally(res => {
            return new response(res)
        });
    }

    login({email, password}) {
        return firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password).then(res => {
            const result = {
                data: {
                    success: true,
                    message: null,
                    statusCode: 200,
                }
            }
            if (!res.user.emailVerified) {
                result.data.success = false;
                result.data.message = I18n.t("notVerifyEmailContent");
                result.data.statusCode = 402;
            }

            return result;

        }).catch(err => {
            const result = {
                data: {
                    statusCode: 400,
                    message: I18n.t("unknowError")
                }
            }
            switch (err.code) {
                case ErrorCodes.AUTH_USER_NOT_FOUND : {
                    result.data.statusCode = 401;
                    result.data.message = I18n.t("userNotFoundError");
                    break;
                }

                case ErrorCodes.AUTH_INVALID_EMAIL : {
                    result.data.statusCode = 401;
                    result.data.message = I18n.t("emailInvalid");
                    break;
                }

                case ErrorCodes.AUTH_USER_DISABLED : {
                    result.data.statusCode = 401;
                    result.data.message = I18n.t("userDisabled");
                    break;
                }

                case ErrorCodes.AUTH_NETWORK_REQUEST_FAILED : {
                    result.data.statusCode = 401;
                    result.data.message = I18n.t("networkError");
                    break;
                }

                case ErrorCodes.AUTH_WRONG_PASSWORD : {
                    result.data.statusCode = 401;
                    result.data.message = I18n.t("wrongPassword");
                    break;
                }

                default : {
                    break
                }
            }
            return result;
        }).finally((res) => {
            return new response(res)
        });
    }

    register({email, password, firstName, lastName, birthDay, gender}) {
        return super.executeHttp(REGISTER, {email, password, firstName, lastName, birthDay, gender})
            .catch(err => {
                const result = {
                    data: {
                        statusCode: 400,
                        message: I18n.t("unknowError")
                    }
                }
                switch (err.code) {
                    case ErrorCodes.AUTH_USER_NOT_FOUND : {
                        alert(I18n.t("userNotFoundError"));
                        break;
                    }

                    case ErrorCodes.AUTH_INVALID_EMAIL : {
                        alert(I18n.t("emailInvalid"));
                        break;
                    }

                    case ErrorCodes.AUTH_NETWORK_REQUEST_FAILED : {
                        alert(I18n.t("networkError"));
                        break;
                    }

                    case ErrorCodes.AUTH_EMAIL_ALREADY_IS_EXIST : {
                        alert(I18n.t("emailAlreadyUse"));
                        break;
                    }

                    default : {
                        break
                    }

                }
                return result;
            })
    }
}

export default UserService