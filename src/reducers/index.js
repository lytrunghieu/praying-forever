import {combineReducers} from 'redux';
import {navigationReducer} from "./navigationReducer";
import {commonReducer} from "./commonReducer";
import {notificationReducer} from "./notificationReducer";
import {userReducer} from "./userReducer";

const appReducer = combineReducers({
    navigationReducer,
    commonReducer,
    notificationReducer,
    userReducer
})

export const  expAppReducer = appReducer;