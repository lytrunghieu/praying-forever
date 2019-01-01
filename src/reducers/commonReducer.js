import {actionTypes} from '../Action';
import InitialState from "./initialStates";
import Immutable from 'seamless-immutable';
import commonUtils from '../Utils/CommonUtils';
import {PRAY_LIST} from '../Constants/AsyncStoreKeys';
import StatusOfPray from "../Constants/StatusOfPray";

export function commonReducer(state = InitialState.prayer, action) {
    let oldState;
    const {type,data} = action;
    switch (action.type) {

        case actionTypes.UPDATE_PRAY_LIST_SUCCESS : {
            state = state.set("prays", action.data);
            return state;
        }


        case actionTypes.CREATE_NEW_PRAY_SUCCESS : {
            oldState = Immutable.asMutable(state, {deep: true});
            oldState.prays.push(action.data);
            state = state.set("prays", oldState.prays);
            // commonUtils.storeData(PRAY_LIST, oldState.prays);
            return state;
        }

        case actionTypes.DELETE_ALL_PRAY_INPROGRESS_SUCCESS : {
            oldState = Immutable.asMutable(state, {deep: true});
            const {inprogress} = data;
            const statusDeleted = inprogress ? StatusOfPray.INPROGRESS : StatusOfPray.COMPLETE
            oldState.prays = oldState.prays.filter(e => e.status === statusDeleted);
            state = state.set("prays", oldState.prays);
            // commonUtils.storeData(PRAY_LIST, oldState.prays);
            return state;
        }

        case actionTypes.EDIT_PRAY_SUCCESS : {
            oldState = Immutable.asMutable(state, {deep: true});
            for (var i in oldState.prays) {
                if (oldState.prays[i].uid === action.data.uid) {
                    oldState.prays[i] = {...oldState[i],...action.data};
                    break;
                }
            }
            state = state.set("prays", oldState.prays);
            // commonUtils.storeData(PRAY_LIST, oldState.prays);
            return state;
        }

        case actionTypes.UPDATE_STATUS_PRAY_SUCCESS : {
            oldState = Immutable.asMutable(state, {deep: true});
            for (var i in oldState.prays) {
                if (oldState.prays[i].uid === action.data.uid) {
                    oldState.prays[i].status = action.status;
                    break;
                }
            }
            state = state.set("prays", oldState.prays);
            // commonUtils.storeData(PRAY_LIST, oldState.prays);
            return state;
        }

        case actionTypes.DELETE_PRAY_SUCCESS : {
            oldState = Immutable.asMutable(state, {deep: true});
            oldState.prays = oldState.prays.filter(e => e.uid !== action.data.uid)
            state = state.set("prays", oldState.prays);
            // commonUtils.storeData(PRAY_LIST, oldState.prays);
            return state;
        }

        default :
            return state

    }

}