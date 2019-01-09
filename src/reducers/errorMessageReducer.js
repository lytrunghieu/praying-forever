import {actionTypes} from '../Action';
import InitialState from "./initialStates";

export function errorMessageReducer(state = InitialState.errorMessage, action) {
    const {type,data} = action;
    switch (type) {
        default :
            if(type.indexOf("FAILED")){
                state = state.set("message", data.message);
            }

            return state

    }

}