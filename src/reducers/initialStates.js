/**
 * Created by hieult on 7/2/18.
 */
import Immutable from 'seamless-immutable';
// import {Map as Immutable} from 'immutable';
import ScreenKey from "../Constants/ScreenKey";

export default {
    navigation :{
        index : 0,
        routes :[
            {routeName : ScreenKey.SPLASH_SCREEN}
        ]
    },

    common : Immutable({
        payload: null,
        fetching : false,
        success : false,
        message : null,
    }),

    prayer :Immutable({
        payload: null,
        fetching : false,
        success : false,
        message : null,
    }),

    notification :Immutable({
        payload: [],
        fetching : false,
        success : false,
        message : null,
    }),

    profile : Immutable({
        payload: null,
        fetching : false,
        success : false,
        message : null,
    }),

    errorMessage :Immutable({
        detail: null,
    }),

    login :Immutable({
        fetching : false,
        success : false,
        message : null,
        statusCode: null,
    }),

    register :Immutable({
        fetching : false,
        success : false,
        message : null,
        statusCode: null,
    }),

    forgot :Immutable({
        fetching : false,
        success : false,
        message : null,
    })

};
