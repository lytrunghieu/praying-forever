import actionTypes from "./actionTypes";
import firebase from 'react-native-firebase';

const uniqueId = require('react-native-unique-id');
import {prayerService} from "../Service";

export function getPrayer({userUID, prayerUID, search} = {}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.GET_PRAYER_PENDING,
        });

        new prayerService().getPrayer({userUID, prayerUID, search}).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.GET_PRAYER_SUCCESS,
                    data: {
                        payload: res.data
                    }
                });

            }
            else {
                dispatch({
                    type: actionTypes.GET_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}

export function updateStatusPrayer(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.UPDATE_STATUS_PRAYER_PENDING,
        });
        new prayerService().updateStatusPrayer(params).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.UPDATE_STATUS_PRAYER_SUCCESS,
                });
                dispatch(getPrayer());
            }
            else {
                dispatch({
                    type: actionTypes.UPDATE_STATUS_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}

export function deletePrayer(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.DELETE_PRAYER_PENDING,
        });
        new prayerService().deletePrayer(params).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.DELETE_PRAYER_SUCCESS,
                });
                dispatch(getPrayer());
            }
            else {
                dispatch({
                    type: actionTypes.DELETE_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}

export function deletePray(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.DELETE_PRAYER_SUCCESS,
            data: params
        });
    }
}

export function deleteAllPrayInprogress(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.DELETE_ALL_PRAY_INPROGRESS_SUCCESS,
            data: params
        });
    }
}

export function updatePrayList(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.UPDATE_PRAY_LIST_SUCCESS,
            data: params
        });
    }
}

export function followingPrayer(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.FOLLOWING_PRAYER_PENDING,
        });
        new prayerService().followingPrayer(params).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.FOLLOWING_PRAYER_SUCCESS,
                });
                dispatch(getPrayer());
            }
            else {
                dispatch({
                    type: actionTypes.FOLLOWING_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}



