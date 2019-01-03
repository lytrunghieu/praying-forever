import {actionTypes} from "./actionTypes";
import {prayerService} from "../../../Service";

export function getPrayerDetail({userUID,prayerUID}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.GET_PRAYER_DETAIL_PENDING,
        });

        new prayerService().getPrayer({userUID,prayerUID}).then(res =>{
            if(res.success){
                dispatch({
                    type: actionTypes.GET_PRAYER_DETAIL_SUCCESS,
                    data: {
                        payload: res.data && res.data[0]
                    }
                });

            }
            else{
                dispatch({
                    type: actionTypes.GET_PRAYER_DETAIL_FAILED,
                    data: {
                        message: res.message
                    }
                });
            }
        });
    }
}