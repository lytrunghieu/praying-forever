import actionTypes from "./ActionTypes";

export function getNotifications(payload) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.GET_NOTIFICATION_SUCCESS,
            data: payload
        });
    }
}
