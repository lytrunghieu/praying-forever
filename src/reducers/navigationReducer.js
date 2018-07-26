import {NavigationActions} from 'react-navigation';

import MainNav from '../Navigation/AppNavigation';
import {ScreenKey} from '../Constants/index';

import {AppStateTypes} from '../Redux/AppStateRedux';
import {AuthenticateTypes} from '../Redux/AuthenticateRedux';

import {CommonUtils} from '../Utils/index'

const {navigate, reset} = NavigationActions;
const {getStateForAction} = MainNav.router;
import INITIAL_STATE from "./initialStates"

// const INITIAL_STATE = getStateForAction(
//   navigate({ routeName: ScreenKey.SPLASH_SCREEN })
// )
const NOT_AUTHENTICATE_STATE = getStateForAction(reset({
    index: 0,
    actions: [
        navigate({routeName: ScreenKey.LOGIN_SCREEN})
    ]
}))
const AUTHENTICATE_STATE = getStateForAction(reset({
    index: 0,
    actions: [
        navigate({routeName: ScreenKey.DRAWER_NAV})
    ]
}))

/**
 * Creates an navigation action for dispatching to Redux.
 *
 * @param {string} routeName The name of the route to go to.
 */
// const navigateTo = routeName => () => navigate({ routeName })

export function navigationReducer(state = INITIAL_STATE.navigation, action) {
    let oldState;
    let routeName;
    let existRoute;
    let nextState;
    if (action.type.includes("Navigation") !== -1) {
        switch (action.type) {
            // case AppStateTypes.SET_REHYDRATION_COMPLETE:
            //   return NOT_AUTHENTICATE_STATE
            // case AuthenticateTypes.LOGOUT:
            //   return NOT_AUTHENTICATE_STATE
            // case AuthenticateTypes.AUTHENTICATE_SUCCESS:
            //   return AUTHENTICATE_STATE
            // case AuthenticateTypes.AUTO_AUTHENTICATE:
            //   return AUTHENTICATE_STATE
            case NavigationActions.RESET : {
                routeName = action.routeName;
                return getStateForAction(reset({
                    index: 0,
                    actions: [
                        navigate({routeName: action.routeName})
                    ]
                }));
            }

            case NavigationActions.NAVIGATE : {
                //prevent transition duplicate screen
                oldState = state;
                routeName = action.routeName;
                existRoute = oldState.routes.find(e => e.routeName === routeName);
                if (existRoute) {
                    return state;
                }
                else {
                    nextState = getStateForAction(action, state);
                    return nextState;
                }
            }

            case NavigationActions.BACK : {
                nextState = getStateForAction(action, state);
                return nextState;
            }


            default: {
                return state;
            }
        }
    }
    else {
        return state;
    }
}

