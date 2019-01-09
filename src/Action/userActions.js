import actionTypes from "./actionTypes";
import {userService} from "../Service";

export function getProfile() {

    return function (dispatch) {
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
    }
}

export function login({email, password}) {

    return function (dispatch) {
        dispatch({
            type: actionTypes.LOGIN_PENDING,
        });

        new userService().login({email, password}).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.LOGIN_SUCCESS,
                });
            }
            else {
                dispatch({
                    type: actionTypes.LOGIN_FAILED,
                    data: {
                        message: res.message,
                        statusCode: res.statusCode
                    }
                });
            }
        })
    }
}

export function register({email, password, firstName, lastName, birthDay, gender}) {

    return function (dispatch) {
        dispatch({
            type: actionTypes.REGISTER_PENDING,
        });

        return new userService().register({email, password, firstName, lastName, birthDay, gender}).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.REGISTER_SUCCESS,
                });
            }
            else {
                dispatch({
                    type: actionTypes.REGISTER_FAILED,
                    data: {
                        message: res.message,
                        statusCode: res.statusCode
                    }
                });
            }
        })
    }
}

export function sendForgotPassword({email}) {

    return function (dispatch) {
        dispatch({
            type: actionTypes.SEND_FORGOT_PENDING,
        });

        return new userService().sendForgotPassword({email}).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.SEND_FORGOT_SUCCESS,
                });
            }
            else {
                dispatch({
                    type: actionTypes.SEND_FORGOT_FAILED,
                    data: {
                        message: res.message,
                    }
                });
            }
        })
    }
}




