import {StackNavigator, DrawerNavigator} from 'react-navigation';

import {ScreenKey} from '../Constants';

import SplashScreen from '../Containers/SplashScreen';
import SignupScreen from '../Containers/SignupScreen';
import LoginScreen from '../Containers/Login/View/LoginScreen';
import ForgotPassScreen from '../Containers/ForgotPassScreen';
import {container as Drawer} from '../Containers/Drawer';
import ListCommonContainer from '../Containers/ListCommonContainer';
import CreateAccountContainer from '../Containers/CreateAccountContainer';
import  {container as PrayingInProgress} from '../Containers/PrayingInProgress';
import {PrayFinishedContainer} from '../Containers/PrayFinishedContainer';
import {container as CreatePrayingContainer} from '../Containers/CreatePrayer';
import {container as PrayerDetailContainer} from '../Containers/PrayerDetail';
import {PrayForOtherContainer} from '../Containers/PrayForOtherContainer';
import {NotificationsContainer} from '../Containers/NotificationsContainer';
import {NotificationDetailContainer} from '../Containers/NotificationDetailContainer';

const DrawerNav = DrawerNavigator({
    [ScreenKey.PRAYING_INPROGESS]: {screen: PrayingInProgress},
    [ScreenKey.PRAY_FINISHED]: {screen: PrayFinishedContainer},
    [ScreenKey.PRAY_FOR_OTHER]: {screen: PrayForOtherContainer},
    [ScreenKey.NOTIFICATIONS]: {screen: NotificationsContainer},
}, {
    contentComponent: Drawer // custom drawer
});

const MainNav = StackNavigator({
        // [ScreenKey.LOGIN_STACK] : { screen: LoginStack },
        [ScreenKey.SPLASH_SCREEN]: {screen: SplashScreen},
        [ScreenKey.DRAWER_NAV]: {screen: DrawerNav},
        [ScreenKey.LOGIN_SCREEN]: {screen: LoginScreen},
        [ScreenKey.FORGOT_PASS]: {screen: ForgotPassScreen},
        [ScreenKey.SIGNUP_SCREEN]: {screen: SignupScreen},
        [ScreenKey.LIST_COMMON]: {screen: ListCommonContainer},
        [ScreenKey.CREATE_PRAYING]: {screen: CreatePrayingContainer},
        [ScreenKey.PRAY_DETAIL]: {screen: PrayerDetailContainer},
        [ScreenKey.CREATE_ACCOUNT]: {screen: CreateAccountContainer},
        [ScreenKey.NOTIFICATION_DETAIL]: {screen: NotificationDetailContainer},
    }, {
        headerMode: 'none',
        initialRouteName: ScreenKey.SPLASH_SCREEN,
        //   cardStyle: styles.card,
        // transitionConfig: getSlideFromRightTransition, // custom transition animation
        // mode: 'modal'
        navigationOptions: {
            gesturesEnabled: false,
        },
    }
)

export default MainNav;