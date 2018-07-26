import {ActionTypes} from '../actions';
import InitialState from "./initialStates";
import Immutable from 'seamless-immutable';

export function commonReducer(state = InitialState.pray , action){
    let oldState;
    switch (action.type){

        case ActionTypes.CREATE_NEW_PRAY_SUCCESS :{
            oldState = Immutable.asMutable(state,{deep: true});
            oldState.prays.push(action.data);
            state = state.set("prays",oldState.prays);
            return state;
        }

        default :
            return state

    }

}