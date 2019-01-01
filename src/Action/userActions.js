import actionTypes from "./actionTypes";
import firebase from 'react-native-firebase';
import I18n from '../I18n';
import {userService} from "../Service";

export function getProfile() {

    return function (dispatch) {
        const userUID = firebase.auth().currentUser.uid;
        const profileCollect = firebase.firestore().collection('profile');
        dispatch({
            type: actionTypes.GET_PROFILE_PEDDING,
        });

        new userService().getProfile().then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.GET_PROFILE_SUCCESS,
                    data: {
                        payload: res.data
                    }
                });
            }
            else {
                dispatch({
                    type: actionTypes.GET_PROFILE_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        })


        // return profileCollect.where("uid", "==", userUID).get().then(queryShot => {
        //     if (queryShot.docs[0] && queryShot.docs[0].data()) {
        //         queryShot.docs[0].data();
        //         dispatch({
        //             type: actionTypes.GET_PROFILE_SUCCESS,
        //             data: {
        //                 payload :queryShot.docs[0].data()
        //             }
        //         });
        //         return true
        //     }
        //     else {
        //         throw  {message: I18n.t("cannotGetProfile")};
        //     }
        //
        // }).catch(err => {
        //     console.log("LOG ERROR ", err);
        //     dispatch({
        //         type: actionTypes.GET_PROFILE_FAILED,
        //         data: {
        //             message : err.message || null
        //         }
        //     });
        //     return err;
        // });

    }
}

