import {actionTypes} from "./actionTypes";
import {prayerService} from "../../../Service";

export function getTemplateDistancePrayer() {
    return function (dispatch) {
        dispatch({
            type: actionTypes.GET_TEMPLATE_DISTANCE_PRAYER_PENDING,
        });
        return new prayerService().getTemplateDistancePrayer().then(res => {
            if (res.success) {
                dispatch({
                    type: actionTypes.GET_TEMPLATE_DISTANCE_PRAYER_SUCCESS,
                    data : {
                        payload: res.data
                    }
                });
            }
            else {
                dispatch({
                    type: actionTypes.GET_TEMPLATE_DISTANCE_PRAYER_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
            return res;
        });
    }
}

