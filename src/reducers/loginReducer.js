import {actionTypes} from '../Action';
import InitialState from "./initialStates";
import { PURGE} from 'redux-persist';

export function loginReducer(state = InitialState.login, action) {
    const {type,data} = action;
    switch (type) {
        case actionTypes.LOGIN_PENDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            state = state.set("statusCode", null);
            return state;
        }

        case actionTypes.LOGIN_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            state = state.set("statusCode", null);
            state = state.set("payload", data.payload);
            return state;
        }

        case actionTypes.LOGIN_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            state = state.set("statusCode", data.statusCode);
            return state;
        }

        case PURGE :{
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", null);
            state = state.set("payload", null);
            state = state.set("statusCode", null);
            return state;
        }

        default :
            return state

    }

}