import {actionTypes} from '../Action';
import InitialState from "./initialStates";
import Immutable from 'seamless-immutable';

export function notificationReducer(state = InitialState.notification, action) {
    let oldState;
    const {type,data} = action;
    switch (action.type) {
        case actionTypes.GET_NOTIFICATION_SUCCESS : {
            state = state.set("notifications", action.data);
            return state;
        }

        default :
            return state

    }

}