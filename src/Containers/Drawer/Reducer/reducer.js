import {actionTypes} from '../../../Action';
import InitialState from "./initialStates";

export function reducer(state = InitialState, action) {
    let oldState;
    const {type,data} = action;
    switch (type) {
        case actionTypes.LOGOUT_PENDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.LOGOUT_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.LOGOUT_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }

        default :
            return state

    }

}