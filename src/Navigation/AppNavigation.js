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
import {PrayFinishedContainer} from '../Containers/PrayFinishedContainer';
import {CreatePrayingContainer} from '../Containers/CreatePrayingContainer';

const DrawerNav = DrawerNavigator({
    [ScreenKey.PRAYING_INPROGESS]: {screen: PrayingInProgressContainer},
    [ScreenKey.PRAY_FINISHED]: {screen: PrayFinishedContainer},


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
        [ScreenKey.CREATE_PRAYING]: {screen: CreatePrayingContainer},
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