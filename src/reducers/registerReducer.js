import {actionTypes} from '../Action';
import InitialState from "./initialStates";

export function registerReducer(state = InitialState.register, action) {
    const {type,data} = action;
    switch (type) {
        case actionTypes.REGISTER_PENDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            state = state.set("statusCode", null);
            return state;
        }

        case actionTypes.REGISTER_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            state = state.set("statusCode", null);
            return state;
        }

        case actionTypes.REGISTER_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            state = state.set("statusCode", data.statusCode);
            return state;
        }

        default :
            return state

    }

}