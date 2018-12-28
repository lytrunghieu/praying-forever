import {actionTypes} from '../Action';
import InitialState from "./initialStates";

export function reducer(state = InitialState, action) {
    let oldState;
    const {type,data} = action;
    switch (action.type) {
        case actionTypes.GET_PROFILE_PEDDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.GET_DATA_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            state = state.set("payload", data.payload);
            return state;
        }

        case actionTypes.GET_DATA_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }

        default :
            return state

    }

}