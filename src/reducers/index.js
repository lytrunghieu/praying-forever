import {combineReducers} from 'redux';
import {navigationReducer} from "./navigationReducer";
import {prayerReducer} from "./prayerReducer";
import {notificationReducer} from "./notificationReducer";
import {userReducer} from "./userReducer";

import {prayingInProgress, createPrayer,prayerDetail} from "../Containers";
const {reducer : createPrayerReducer} =createPrayer;
const {reducer : prayerDetailReducer} =prayerDetail;

const appReducer = combineReducers({
    navigationReducer,
    prayerReducer,
    notificationReducer,
    userReducer,
    createPrayerReducer,
    prayerDetailReducer
})

export const  expAppReducer = appReducer;