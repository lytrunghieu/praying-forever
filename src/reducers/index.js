import {combineReducers} from 'redux';
import {navigationReducer} from "./navigationReducer";
import {prayerReducer} from "./prayerReducer";
import {notificationReducer} from "./notificationReducer";
import {userReducer} from "./userReducer";
import {errorMessageReducer} from "./errorMessageReducer";
import {loginReducer} from "./loginReducer";
import {registerReducer} from "./registerReducer";
import {forgotPasswordReducer} from "./forgotPasswordReducer";
import {pendingReducer} from "./pendingReducer";
import {profilesReducer} from "./profilesReducer";

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
    errorMessageReducer,
    loginReducer,
    registerReducer,
    forgotPasswordReducer,
    drawerReducer,
    prayForOthersReducer,
    profileReducer,
    pendingReducer,
    profilesReducer
})

export const  expAppReducer = appReducer;