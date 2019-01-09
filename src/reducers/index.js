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

import {prayingInProgress, createPrayer,prayerDetail,Drawer} from "../Containers";
const {reducer : createPrayerReducer} =createPrayer;
const {reducer : prayerDetailReducer} =prayerDetail;
const {reducer : drawerReducer} =Drawer;

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
    drawerReducer
})

export const  expAppReducer = appReducer;