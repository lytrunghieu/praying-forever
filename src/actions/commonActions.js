import actionTypes from "./ActionTypes";
const uniqueId = require('react-native-unique-id')

export function createNewPray(params) {
    return function (dispatch) {
        uniqueId().then(id => {
            dispatch({
                type: actionTypes.CREATE_NEW_PRAY_SUCCESS,
                data: {...params , id : id}
            });
        }).catch(error => console.error(error))
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

export function changeStatusPray({status , pray}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.UPDATE_STATUS_PRAY_SUCCESS,
            data: pray,
            status : status
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
            data :params
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