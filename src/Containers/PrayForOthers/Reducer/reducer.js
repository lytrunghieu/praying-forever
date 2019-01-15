import {actionTypes} from '../../../Action';
import InitialState from "./initialStates";

export function reducer(state = InitialState, action) {
    const {type,data} = action;
    switch (type) {
        case actionTypes.GET_PRAYER_NEARBY_PENDING :{
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.GET_PRAYER_NEARBY_SUCCESS :{
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            state = state.set("payload", data.payload);
            return state
        }

        case actionTypes.GET_PRAYER_NEARBY_FAILED :{
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }

        case actionTypes.LOGOUT_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", null);
            state = state.set("payload", null);
            return state;
        }

        default :
            return state

    }

}