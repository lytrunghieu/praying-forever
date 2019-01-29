
import AppNavigation from '../Navigation/AppNavigation';
import {
    createNavigationReducer
} from 'react-navigation-redux-helpers';

/**
 * Creates an navigation action for dispatching to Redux.
 *
 * @param {string} routeName The name of the route to go to.
 */
// const navigateTo = routeName => () => navigate({ routeName })


export const navigationReducer = createNavigationReducer(AppNavigation);

