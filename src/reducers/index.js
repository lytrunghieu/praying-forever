import {combineReducers} from 'redux';
import {navigationReducer} from "./navigationReducer";
import {commonReducer} from "./commonReducer";
import {notificationReducer} from "./notificationReducer";
import {userReducer} from "./userReducer";

import {prayingInProgress} from "../Containers";

const appReducer = combineReducers({
    navigationReducer,
    commonReducer,
    notificationReducer,
    userReducer,
    prayingReducer : prayingInProgress.reducer
})

console.log("prayingReducer ", prayingInProgress.reducer);

export const  expAppReducer = appReducer;