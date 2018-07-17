import {StackNavigator, TabNavigator, TabBarBottom, DrawerNavigator} from 'react-navigation';

import getSlideFromRightTransition from './SlideFromRightTransition';
import {ScreenKey} from '../Constants';

import SplashScreen from '../Containers/SplashScreen';
import SignupScreen from '../Containers/SignupScreen';
import LoginScreen from '../Containers/LoginScreen';
import HomeScreen from '../Containers/HomeScreen';
import DrawerContainer from '../Containers/DrawerContainer';
import AScreen from '../Containers/AScreen';
import ADetailScreen from '../Containers/ADetailScreen';
import BScreen from '../Containers/BScreen';
import ListCommonContainer from '../Containers/ListCommonContainer';
import {PrayingInProgressContainer} from '../Containers/PrayingInProgressContainer';

const AStack = StackNavigator({
        [ScreenKey.A_SCREEN]: {screen: AScreen},
        [ScreenKey.A_SCREEN_DETAIL]: {screen: ADetailScreen},
    }, {
        headerMode: 'none',
        // initialRouteName: 'Login',
        //   cardStyle: styles.card,
        // transitionConfig: getSlideFromRightTransition,
        // mode: 'modal'
    }
)

const DrawerNav = DrawerNavigator({
    // [ScreenKey.HOME_SCREEN]: {
    //     screen: HomeScreen,
    // },
    // [ScreenKey.A_STACK]: {
    //     screen: AStack,
    // },
    // [ScreenKey.B_SCREEN]: {
    //     screen: BScreen,
    // },
    [ScreenKey.PRAYING_INPROGESS]: {
        screen: PrayingInProgressContainer
    }
}, {
    contentComponent: DrawerContainer // custom drawer
});

const MainNav = StackNavigator({
        // [ScreenKey.LOGIN_STACK] : { screen: LoginStack },
        [ScreenKey.SPLASH_SCREEN]: {screen: SplashScreen},
        [ScreenKey.DRAWER_NAV]: {screen: DrawerNav},
        [ScreenKey.LOGIN_SCREEN]: {screen: LoginScreen},
        [ScreenKey.SIGNUP_SCREEN]: {screen: SignupScreen},
        [ScreenKey.LIST_COMMON]: {screen: ListCommonContainer},
        // [ScreenKey.PRAYING_INPROGESS]: {screen: PrayingInProgressContainer}

    }, {
        headerMode: 'none',
        // initialRouteName: ScreenKey.SPLASH_SCREEN,
        //   cardStyle: styles.card,
        // transitionConfig: getSlideFromRightTransition, // custom transition animation
        // mode: 'modal'
        navigationOptions: {
            gesturesEnabled: false,
        },
    }
)

export default MainNav;