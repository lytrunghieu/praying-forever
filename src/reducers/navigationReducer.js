
import AppNavigator from '../Navigation/AppNavigation';
import {
    createNavigationReducer
} from 'react-navigation-redux-helpers';

/**
 * Creates an navigation action for dispatching to Redux.
 *
 * @param {string} routeName The name of the route to go to.
 */
// const navigateTo = routeName => () => navigate({ routeName })


// export const navigationReducer = createNavigationReducer(AppNavigation);

export  function navigationReducer(state, action) {
    // Initial state
    if (!state) {
        return AppNavigator.router.getStateForAction(action, state);
    }
    if (action.type.includes('COMPLETE_TRANSITION')) return state;

    // Is this a navigation action that we should act upon?
    // if (includes(NavigationActions, action.type)) {
    //     const oldState = state.toJS();
    //     const newState = AppNavigator.router.getStateForAction(action, state.toJS());
    //     return oldState === newState ? state : fromJS(newState);
    // }
    if(action.type && action.type.indexOf("Navigation") > -1){
        const oldState = state;
        const newState = AppNavigator.router.getStateForAction(action, state);
        return newState
    }

    return state;
}