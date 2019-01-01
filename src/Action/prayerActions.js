import actionTypes from "./actionTypes";
import firebase from 'react-native-firebase';

const uniqueId = require('react-native-unique-id');
import {prayerService} from "../Service";

export function createNewPrayer(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.CREATE_PRAYER_PENDING,
        });
        new prayerService().createNewPrayer(params).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.CREATE_PRAYER_SUCCESS,
                });
                dispatch(getPrayer());
            }
            else {
                dispatch({
                    type: actionTypes.CREATE_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}

export function getPrayer({userUID,prayerUID,search} ={}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.GET_PRAYER_PENDING,
        });

        new prayerService().getPrayer({userUID,prayerUID,search}).then(res =>{
            if(res.success){
                dispatch({
                    type: actionTypes.GET_PRAYER_SUCCESS,
                    data: {
                        payload: res.data
                    }
                });

            }
            else{
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

export function editPray(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.EDIT_PRAY_SUCCESS,
            data: params
        });
    }
}

export function changeStatusPray({status, pray}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.UPDATE_STATUS_PRAY_SUCCESS,
            data: pray,
            status: status
        });
    }
}


export function deletePray(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.DELETE_PRAY_SUCCESS,
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





