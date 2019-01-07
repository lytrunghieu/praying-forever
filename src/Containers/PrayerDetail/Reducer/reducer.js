import {actionTypes} from '../Action';
import {actionTypes as commonActionTypes} from '../../../Action';
import InitialState from "./initialStates";

export function reducer(state = InitialState, action) {
    const {type,data} = action;
    switch (type) {
        case actionTypes.GET_PRAYER_DETAIL_PENDING :{
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case actionTypes.GET_PRAYER_DETAIL_SUCCESS :{
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            state = state.set("payload", data.payload);
            return state
        }

        case actionTypes.GET_PRAYER_FAILED :{
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }


        //region DEPENDENCIES

        case commonActionTypes.GET_PRAYER_PENDING :{
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case commonActionTypes.GET_PRAYER_SUCCESS :{
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            return state
        }

        case commonActionTypes.GET_PRAYER_FAILED :{
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }


        case commonActionTypes.UPDATE_STATUS_PRAYER_PENDING :{
            state = state.set("fetching", true);
            state = state.set("success", false);
            state = state.set("message", null);
            return state;
        }

        case commonActionTypes.UPDATE_STATUS_PRAYER_SUCCESS :{
            state = state.set("fetching", false);
            state = state.set("success", true);
            state = state.set("message", null);
            return state
        }

        case commonActionTypes.UPDATE_STATUS_PRAYER_FAILED :{
            state = state.set("fetching", false);
            state = state.set("success", false);
            state = state.set("message", data.message);
            return state;
        }
        //endregion

        default :
            return state

    }

}