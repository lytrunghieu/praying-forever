import {actionTypes} from '../Action';
import InitialState from "./initialStates";
import Immutable from 'seamless-immutable';

export function profilesReducer(state = InitialState.profiles, action) {
    const {type, data} = action;
    switch (type) {

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
            state = state.set("payload", data.payload);
            return state
        }

        case actionTypes.GET_PROFILE_OTHER_FAILED : {
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }


        case actionTypes.GET_PROFILE_SUCCESS : {
            if (state.payload) {
                let oldPayload = Immutable.asMutable(state.payload);
                const {payload} = data;
                const {uid} = payload;
                if (oldPayload && oldPayload.length > 0) {
                    const index = oldPayload.findIndex(e => e.uid === uid);
                    if (index > -1) {
                        oldPayload[index] = payload;
                    }
                }
                state = state.set("payload", oldPayload);
            }
            return state;
        }


        default :
            return state

    }

}