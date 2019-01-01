import {actionTypes} from '../Action';
import InitialState from "./initialStates";

export function reducer(state = InitialState, action) {
    const {type,data} = action;
    switch (type) {
        case actionTypes.CREATE_PRAYER_PENDING :{
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.CREATE_PRAYER_SUCCESS :{
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            return state
        }

        case actionTypes.CREATE_PRAYER_FAILED :{
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }
        default :
            return state

    }

}