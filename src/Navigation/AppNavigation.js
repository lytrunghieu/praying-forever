import {StackNavigator, DrawerNavigator} from 'react-navigation';

import {ScreenKey} from '../Constants';

import SplashScreen from '../Containers/SplashScreen';
import SignupScreen from '../Containers/SignupScreen';
import LoginScreen from '../Containers/LoginScreen';
import DrawerContainer from '../Containers/DrawerContainer';
import ListCommonContainer from '../Containers/ListCommonContainer';
import {PrayingInProgressContainer} from '../Containers/PrayingInProgressContainer';
import {PrayFinishedContainer} from '../Containers/PrayFinishedContainer';
import {CreatePrayingContainer} from '../Containers/CreatePrayingContainer';
import {PrayDetailContainer} from '../Containers/PrayDetailContainer';

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
        [ScreenKey.PRAY_DETAIL]: {screen: PrayDetailContainer},
    }, {
        headerMode: 'none',
        initialRouteName: ScreenKey.LIST_COMMON,
        //   cardStyle: styles.card,
        // transitionConfig: getSlideFromRightTransition, // custom transition animation
        // mode: 'modal'
        navigationOptions: {
            gesturesEnabled: false,
        },
    }
)

export default MainNav;