import actionTypes from "./ActionTypes";


export function createNewPray(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.CREATE_NEW_PRAY_SUCCESS,
            data: params
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

export function deleteAllPrayInprogress() {
    return function (dispatch) {
        dispatch({
            type: actionTypes.DELETE_ALL_PRAY_INPROGRESS_SUCCESS,
        });
    }
}

export function getPrayList(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.GET_PRAY_LIST_SUCCESS,
            data: params
        });
    }
}