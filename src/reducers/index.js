import {combineReducers} from 'redux';
import {navigationReducer} from "./navigationReducer";
import {commonReducer} from "./commonReducer";
import {notificationReducer} from "./notificationReducer";

const appReducer = combineReducers({
    navigationReducer,
    commonReducer,
    notificationReducer
})

export const  expAppReducer = appReducer;