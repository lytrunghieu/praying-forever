import {combineReducers} from 'redux';
import {navigationReducer} from "./navigationReducer";
import {prayerReducer} from "./prayerReducer";
import {notificationReducer} from "./notificationReducer";
import {userReducer} from "./userReducer";
import {commonReducer} from "./commonReducer";
import {errorMessageReducer} from "./errorMessageReducer";
import {loginReducer} from "./loginReducer";
import {registerReducer} from "./registerReducer";
import {forgotPasswordReducer} from "./forgotPasswordReducer";
import {pendingReducer} from "./pendingReducer";

import {prayingInProgress, createPrayer,prayerDetail,Drawer,PrayForOthers, Profile} from "../Containers";
const {reducer : createPrayerReducer} =createPrayer;
const {reducer : prayerDetailReducer} =prayerDetail;
const {reducer : drawerReducer} =Drawer;
const {reducer : prayForOthersReducer} =PrayForOthers;
const {reducer : profileReducer} =Profile;

const appReducer = combineReducers({
    navigationReducer,
    prayerReducer,
    notificationReducer,
    userReducer,
    createPrayerReducer,
    prayerDetailReducer,
    commonReducer,
    errorMessageReducer,
    loginReducer,
    registerReducer,
    forgotPasswordReducer,
    drawerReducer,
    prayForOthersReducer,
    profileReducer,
    pendingReducer
})

export const  expAppReducer = appReducer;