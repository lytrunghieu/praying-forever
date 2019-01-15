import {actionTypes} from '../Action';
import InitialState from "./initialStates";
import Immutable from 'seamless-immutable';

export function notificationReducer(state = InitialState.notification, action) {
    const {type,data} = action;
    switch (type) {
        case actionTypes.GET_NOTIFICATION_PENDING : {
            if(Immutable.isImmutable(state)){
                state = state.set("fetching", true);
                state = state.set("success", false);
                state = state.set("message", null);
            }
            else{
                state = Immutable(state);
            }
            return state;
        }

        case actionTypes.GET_NOTIFICATION_SUCCESS : {
            if(Immutable.isImmutable(state)){
                state = state.set("fetching", false);
                state = state.set("success", true);
                state = state.set("message", null);
                state = state.set("payload", data.payload);
            }
            else{
                state = Immutable(state);
            }

            return state;
        }

        case actionTypes.GET_NOTIFICATION_FAILED : {
            if(Immutable.isImmutable(state)){
                state = state.set("fetching", false);
                state = state.set("success", false);
                state = state.set("message", data.message);
            }
            else{
                state = Immutable(state);
            }
            return state;
        }

        //DEPENCIES
        case actionTypes.DELETE_NOTIFICATION_PENDING : {
            if(Immutable.isImmutable(state)){
                state = state.set("fetching", true);
                state = state.set("success", false);
                state = state.set("message", null);
            }
            else{
                state = Immutable(state);
            }
            return state;
        }

        case actionTypes.DELETE_NOTIFICATION_SUCCESS : {
            if(Immutable.isImmutable(state)){
                state = state.set("fetching", false);
                state = state.set("success", true);
                state = state.set("message", null);
            }
            else{
                state = Immutable(state);
            }

            return state;
        }

        case actionTypes.DELETE_NOTIFICATION_FAILED : {
            if(Immutable.isImmutable(state)){
                state = state.set("fetching", false);
                state = state.set("success", false);
                state = state.set("message", data.message);
            }
            else{
                state = Immutable(state);
            }
            return state;
        }

        case actionTypes.UPDATE_READ_STATUS_NOTIFICATION_PENDING : {
            if(Immutable.isImmutable(state)){
                state = state.set("fetching", true);
                state = state.set("success", false);
                state = state.set("message", null);
            }
            else{
                state = Immutable(state);
            }
            return state;
        }

        case actionTypes.UPDATE_READ_STATUS_NOTIFICATION_SUCCESS : {
            if(Immutable.isImmutable(state)){
                state = state.set("fetching", false);
                state = state.set("success", true);
                state = state.set("message", null);
            }
            else{
                state = Immutable(state);
            }

            return state;
        }

        case actionTypes.UPDATE_READ_STATUS_NOTIFICATION_FAILED : {
            if(Immutable.isImmutable(state)){
                state = state.set("fetching", false);
                state = state.set("success", false);
                state = state.set("message", data.message);
            }
            else{
                state = Immutable(state);
            }
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