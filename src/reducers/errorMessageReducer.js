import {actionTypes} from '../Action';
import {actionTypes as prayerDetailActionTypes} from '../Containers/PrayerDetail';
import {actionTypes as createPrayerActionTypes} from '../Containers/CreatePrayer';
import {actionTypes as prayForOthersActionTypes} from '../Containers/PrayForOthers';
import InitialState from "./initialStates";

export function errorMessageReducer(state = InitialState.errorMessage, action) {
    const {type,data} = action;
    switch (type) {
        default :
            if(type.indexOf("FAILED") > -1){
                if(type !== actionTypes.LOGIN_FAILED
                    && type !== actionTypes.GET_PROFILE_OTHER_FAILED
                    && type !== actionTypes.GET_PROFILE_FAILED
                    && type !== actionTypes.GET_PRAYER_FAILED
                    && type !== actionTypes.GET_PRAYER_NEARBY_FAILED
                    && type !== actionTypes.GET_NOTIFICATION_FAILED
                    && type !== prayerDetailActionTypes.GET_PRAYER_DETAIL_FAILED
                    && type !== createPrayerActionTypes.GET_TEMPLATE_PRAYER_FAILED
                    && type !== prayForOthersActionTypes.GET_TEMPLATE_DISTANCE_PRAYER_FAILED
                    && type !== actionTypes.SYNC_PRAYER_FAILED
                ){
                    state = state.set("detail", { message : data.message , statusCode : data.statusCode});
                }
            }

            return state

    }

}