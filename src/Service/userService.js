import baseService from "./baseService";
import {REGISTER, UPDATE_LAST_SIGN_IN} from "./nameCloudFunction"
import {response, PrayUser} from "../model";
import firebase from 'react-native-firebase';
import {collection, ErrorCodes, firestorePaths} from "../Constants";
import I18n from "../I18n";
import {
    Platform,
} from 'react-native';
import FirebaseClient from '../Containers/firebaseClient';
import RNFetchBlob from 'react-native-fetch-blob'

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

class UserService extends baseService {

    getProfile({userUID, isUser = true} = {}) {
        const profileCollect = firebase.firestore().collection(collection.PROFILE);
       if(!isUser){
           if(!userUID){
               return profileCollect.get().then(queryShot => {
                   const users = [];
                   if(queryShot.docs[0]){
                       queryShot.docs.forEach(doc =>{
                           users.push(new PrayUser(doc.data()));
                       })
                   }
                   return {data: {success: true, data: users}}

               }).catch(err => {
                   console.log("LOG ERROR ", err);
                   return err;
               }).finally(res => {
                   return new response(res)
               });
           }
           else{
               return profileCollect.where("uid", "==", userUID).get().then(queryShot => {
                   if (queryShot.docs[0] && queryShot.docs[0].data()) {
                       return {data: {success: true, data: [new PrayUser(queryShot.docs[0].data())]}}
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
       }
       else{
           const _userUID = firebase.auth().currentUser.uid;
           return profileCollect.where("uid", "==", _userUID).get().then(queryShot => {
               if (queryShot.docs[0] && queryShot.docs[0].data()) {
                   return {data: {success: true, data: [new PrayUser(queryShot.docs[0].data())]}}
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
    }

    login({email, password}) {
        return firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password).then(async res => {
            const result = {
                data: {
                    success: true,
                    message: null,
                    statusCode: 200,
                    data: null,
                }
            }
            if (!res.user.emailVerified) {
                result.data.success = false;
                result.data.message = I18n.t("notVerifyEmailContent");
                result.data.statusCode = 402;
            }
            else {
                result.data.data = {
                    lastSignInTime: res.user.metadata.lastSignInTime
                }
                const updateLastSignIn = await super.executeHttp(UPDATE_LAST_SIGN_IN, {
                    userUID: res.user.uid,
                    lastSignInTime: res.user.metadata.lastSignInTime
                })
                if(!updateLastSignIn.success){
                    result.data.success = false;
                    result.data.statusCode = 400;
                }
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
                    result.data.statusCode = 403;
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
        return super.executeHttp(REGISTER, {email, password, firstName, lastName, birthDay, gender}).then(res => {
            if (!res.success) {
                switch (res.code) {
                    case ErrorCodes.AUTH_USER_NOT_FOUND : {
                        res.message = I18n.t("userNotFoundError");
                        break;
                    }

                    case ErrorCodes.AUTH_INVALID_EMAIL : {
                        res.message = I18n.t("emailInvalid");
                        break;
                    }

                    case ErrorCodes.AUTH_NETWORK_REQUEST_FAILED : {
                        res.message = I18n.t("networkError");
                        break;
                    }

                    case ErrorCodes.AUTH_EMAIL_ALREADY_IS_EXIST : {
                        res.message = I18n.t("emailAlreadyUse");
                        break;
                    }

                    default : {
                        break
                    }

                }
            }
            return res;
        });
    }

    sendForgotPassword({email}) {
        return firebase.auth().sendPasswordResetEmail(email).then(res => {
            const result = {
                data: {
                    success: true,
                    message: null,
                    statusCode: 200,
                }
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

                case ErrorCodes.AUTH_NETWORK_REQUEST_FAILED : {
                    result.data.statusCode = 401;
                    result.data.message = I18n.t("networkError");
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

    resendVerifyEmail() {
        return firebase.auth().currentUser.sendEmailVerification().then(res => {
            const result = {
                data: {
                    success: true,
                    message: null,
                    statusCode: 200,
                }
            }
            return result;
        }).finally((res) => {
            return new response(res)
        });
    }

    logout() {
        return firebase.auth().signOut().then(res => {
            const result = {
                data: {
                    success: true,
                    message: null,
                    statusCode: 200,
                }
            }
            return result;
        }).finally((res) => {
            return new response(res)
        });
    }

    updateProfile({gender, birthDay, displayName}) {
        const _userUID = firebase.auth().currentUser.uid;
        const path = firestorePaths.PROFILES;
        const profileCollect = firebase.firestore().collection(path);
        return profileCollect.where("uid", "==", _userUID).get().then(colSnap => {
            colSnap.docs[0].ref.update("gender", gender, "birthDay", birthDay, "displayName", displayName);
            const result = {
                data: {
                    success: true,
                    message: null,
                    statusCode: 200,
                }
            }
            return result;
        }).finally(res => {
            return new response(res)
        });
    }

    updateAvatar({uri, mime = 'img/jpg'}) {
        const _userUID = firebase.auth().currentUser.uid;
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        let uploadBlob = null
        const imageRef = FirebaseClient.storage().ref('images/avatars').child(`${_userUID}.jpg`);

        return fs.readFile(uploadUri, 'base64')
            .then((data) => {
                return Blob.build(data, {type: `${mime};BASE64`})
            })
            .then((blob) => {
                uploadBlob = blob;
                const path = firestorePaths.PROFILES;
                const profileCollect = firebase.firestore().collection(path);
                return profileCollect.where("uid", "==", _userUID).get({source: "server"}).then(async colSnap => {
                    const storageTask = await imageRef.put(blob._ref, {contentType: mime});
                    if (storageTask.state == "success") {
                        colSnap.docs[0].ref.set({avatarURL: storageTask.downloadURL}, {merge: true});
                        const result = {
                            data: {
                                success: true,
                                message: null,
                                statusCode: 200,
                            }
                        }
                        return result;
                    }
                    else {
                        throw  "failed";
                    }
                })

            }).finally(res => {
                uploadBlob.close();
                return new response(res)
            })
    }

    getUsers(){
        const path = firestorePaths.PROFILES;
        const profileCollect = firebase.firestore().collection(path);
        return profileCollect.get().then(colSnap => {
            colSnap.docs[0].ref.update("gender", gender, "birthDay", birthDay, "displayName", displayName);
            const result = {
                data: {
                    success: true,
                    message: null,
                    statusCode: 200,
                }
            }
            return result;
        }).finally(res => {
            return new response(res)
        });

    }
}

export default UserService
