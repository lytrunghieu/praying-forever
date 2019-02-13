import {actionTypes} from '../Action';
import InitialState from "./initialStates";
import Immutable from 'seamless-immutable';
import { PURGE} from 'redux-persist';

export function prayerReducer(state = InitialState.prayer, action) {
    const {type, data} = action;
    switch (type) {
        case actionTypes.GET_PRAYER_PENDING : {
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.GET_PRAYER_SUCCESS : {
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            state = state.set("payload", data.payload);
            return state;
        }

        case actionTypes.GET_PRAYER_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
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

        case actionTypes.UPDATE_STATUS_PRAYER_PENDING : {
            state = state.set("fetching", true);
            return state;
        }

        case actionTypes.UPDATE_STATUS_PRAYER_SUCCESS : {
            state = state.set("fetching", false);
            return state;
        }

        case actionTypes.UPDATE_STATUS_PRAYER_FAILED : {
            state = state.set("fetching", false);
            return state;
        }

        case actionTypes.DELETE_PRAYER_PENDING : {
            state = state.set("fetching", true);
            return state;
        }

        case actionTypes.DELETE_PRAYER_SUCCESS : {
            state = state.set("fetching", false);
            return state;
        }

        case actionTypes.DELETE_PRAYER_FAILED : {
            state = state.set("fetching", false);
            return state;
        }

        case actionTypes.SYNC_PRAYER_SUCCESS : {
            let oldPayload = Immutable.asMutable(state.payload);
            const {payload} = data;
            payload.forEach(p => {
                const index = oldPayload.findIndex(e => e.uid === p.uid);
                if (index > -1) {
                    if (p.prayer) {
                        oldPayload[index] = p.prayer;
                    }
                    else {
                        oldPayload.splice(index, 1);
                    }
                }
            })
            state = state.set("payload", oldPayload);
            return state;
        }

        case PURGE :{
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