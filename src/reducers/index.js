import {combineReducers} from 'redux';
import {navigationReducer} from "./navigationReducer";
import {prayerReducer} from "./prayerReducer";
import {notificationReducer} from "./notificationReducer";
import {userReducer} from "./userReducer";

import {prayingInProgress, createPrayer} from "../Containers";
const {reducer : createPrayerReducer} =createPrayer;

const appReducer = combineReducers({
    navigationReducer,
    prayerReducer,
    notificationReducer,
    userReducer,
    createPrayerReducer
})

export const  expAppReducer = appReducer;