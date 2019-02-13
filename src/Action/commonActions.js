import actionTypes from "./actionTypes";
import {commonService} from "../Service";
import { PURGE} from 'redux-persist';

export function addReport({reportType,reportMessage,prayer,user} ={}) {
    return function (dispatch) {
        dispatch({
            type: actionTypes.ADD_REPORT_PENDING,
        });

        return new commonService().addReport({reportType,reportMessage,prayer,user}).then(res =>{
            if(res.success){
                dispatch({
                    type: actionTypes.ADD_REPORT_SUCCESS,
                    data :{
                        payload : res.data
                    }
                });
            }
            else {
                dispatch({
                    type: actionTypes.ADD_REPORT_FAILED,
                    data :{
                        message : res.message
                    }
                });
            }
        });
    }
}

export function resetPersistState() {
    return function (dispatch) {
        dispatch({
            type: PURGE,
            key: "root",    // Whatever you chose for the "key" value when initialising redux-persist in the **persistCombineReducers** method - e.g. "root"
            result: () => null              // Func expected on the submitted action.
        });
    }
}


