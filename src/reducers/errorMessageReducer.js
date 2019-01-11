import {actionTypes} from '../Action';
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
                ){
                    state = state.set("detail", { message : data.message , statusCode : data.statusCode});
                }
            }

            return state

    }

}