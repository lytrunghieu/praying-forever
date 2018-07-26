import {combineReducers} from 'redux';
import {navigationReducer} from "./navigationReducer";
import {commonReducer} from "./commonReducer";

const appReducer = combineReducers({
    navigationReducer,
    commonReducer
})

export const  expAppReducer = appReducer;