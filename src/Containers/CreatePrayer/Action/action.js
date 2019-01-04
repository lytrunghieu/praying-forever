import {actionTypes} from "./actionTypes";
import {prayerService} from "../../../Service";
import { prayerActions} from "../../../Action"

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
                dispatch(prayerActions.getPrayer());
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

export function editPrayer(params) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.EDIT_PRAYER_PENDING,
        });
        new prayerService().editPrayer(params).then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.EDIT_PRAYER_SUCCESS,
                });
                dispatch(prayerActions.getPrayer());
            }
            else {
                dispatch({
                    type: actionTypes.EDIT_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}