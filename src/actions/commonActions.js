import actionTypes from "./ActionTypes";


export function createNewPray(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.CREATE_NEW_PRAY_SUCCESS,
            data: params
        });
    }
}