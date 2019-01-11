import actionTypes from "./actionTypes";
import {notificationService} from "../Service";

export function getNotifications(payload) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.GET_NOTIFICATION_SUCCESS,
            data: {
                payload : payload
            }
        });
    }
}

export function deleteNotification({notifUID}={}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.DELETE_NOTIFICATION_PENDING,
        });

        return new notificationService().deleteNotification({notifUID}).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.DELETE_NOTIFICATION_SUCCESS,
                });
            }
            else {
                dispatch({
                    type: actionTypes.DELETE_NOTIFICATION_FAILED,
                    data: {
                        message: res.message,
                    }
                });
            }
            return res;
        })
    }
}

export function updateReadStatusNotification({notifUID, read}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.UPDATE_READ_STATUS_NOTIFICATION_PENDING,
        });

        return new notificationService().updateReadStatusNotification({notifUID,read}).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.UPDATE_READ_STATUS_NOTIFICATION_SUCCESS,
                });
            }
            else {
                dispatch({
                    type: actionTypes.UPDATE_READ_STATUS_NOTIFICATION_FAILED,
                    data: {
                        message: res.message,
                    }
                });
            }
            return res;
        })
    }
}

