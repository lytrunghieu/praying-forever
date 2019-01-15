import {actionTypes} from '../Action';
import InitialState from "./initialStates";
import Immutable from 'seamless-immutable';

export function prayerReducer(state = InitialState.prayer, action) {
    const {type,data} = action;
    switch (type) {
        case actionTypes.GET_PRAYER_PENDING : {
            if (Immutable.isImmutable(state)) {
                state = state.set("fetching", true);
                state = state.set("success", false);
                state = state.set("message", null);
            }
            else {
                state = Immutable(state);
            }
            return state;
        }

        case actionTypes.GET_PRAYER_SUCCESS : {
            if (Immutable.isImmutable(state)) {
                state = state.set("fetching", false);
                state = state.set("success", true);
                state = state.set("message", null);
                state = state.set("payload", data.payload);
            }
            else {
                state = Immutable(state);
            }
            return state;
        }

        case actionTypes.GET_PRAYER_FAILED : {
            if (Immutable.isImmutable(state)) {
                state = state.set("fetching", false);
                state = state.set("success", false);
                state = state.set("message", data.message);
            }
            else {
                state = Immutable(state);
            }
            return state;
        }

        case actionTypes.FOLLOWING_PRAYER_PENDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.FOLLOWING_PRAYER_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.FOLLOWING_PRAYER_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }

        case actionTypes.UPDATE_LIVE_STATUS_PENDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.UPDATE_LIVE_STATUS_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.UPDATE_LIVE_STATUS_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }

        case actionTypes.LOGOUT_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", null);
            state = state.set("payload", []);
            return state;
        }


        default :
            return state

    }

}