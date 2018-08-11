/**
 * Created by hieult on 7/2/18.
 */
import Immutable from 'seamless-immutable';
import ScreenKey from "../Constants/ScreenKey";

export default {
    navigation :{
        index : 0,
        routes :[
            {routeName : ScreenKey.LOGIN_SCREEN}
        ]
    },

    pray :Immutable({
        praySelected : null,
        prays :[]
    })

};
