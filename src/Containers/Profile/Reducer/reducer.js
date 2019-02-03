import {actionTypes} from '../../../Action';
import InitialState from "./initialStates";

export function reducer(state = InitialState, action) {
    const {type,data} = action;
    switch (type) {

        case actionTypes.UPDATE_PROFILE_PENDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            state = state.set("inprogress", true);
            return state;
        }

        case actionTypes.UPDATE_PROFILE_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            state = state.set("inprogress", false);
            return state;
        }

        case actionTypes.UPDATE_PROFILE_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            state = state.set("inprogress", false);
            return state;
        }

        case actionTypes.UPDATE_AVATAR_PENDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            state = state.set("inprogress", true);
            return state;
        }

        case actionTypes.UPDATE_AVATAR_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            state = state.set("inprogress", false);
            return state;
        }

        case actionTypes.UPDATE_AVATAR_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            state = state.set("inprogress", false);
            return state;
        }


        case actionTypes.GET_PROFILE_PENDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.GET_PROFILE_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.GET_PROFILE_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }

        case actionTypes.GET_PROFILE_OTHER_PENDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.GET_PROFILE_OTHER_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            return state
        }

        case actionTypes.GET_PROFILE_OTHER_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }




        default :
            return state

    }

}