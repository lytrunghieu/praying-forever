import {createStackNavigator, createDrawerNavigator} from 'react-navigation';

import {ScreenKey} from '../Constants';

import {container as SplashScreen} from '../Containers/Splash';
import {container as LoginScreen} from '../Containers/Login';
import {container as RegisterScreen} from '../Containers/Register';
import {container as ForgotPasswordScreen} from '../Containers/ForgotPassword';
import {container as Drawer} from '../Containers/Drawer';
import {container as ProfileScreen} from '../Containers/Profile';

import {container as PrayingInProgressScreen} from '../Containers/PrayingInProgress';
import {container as PrayerFinishedScreen} from '../Containers/PrayerFinished';
import {container as CreatePrayerScreen} from '../Containers/CreatePrayer';
import {container as PrayerDetailScreen} from '../Containers/PrayerDetail';
import {container as  PrayForOtherScreen} from '../Containers/PrayForOthers';
import {container as NotificationScreen} from '../Containers/Notification';
import {container as AboutScreen} from '../Containers/About';
import {container as IntroScreen} from '../Containers/Intro';

const DrawerNav = createDrawerNavigator({
    [ScreenKey.PRAYING_INPROGESS]: {screen: PrayingInProgressScreen},
    [ScreenKey.PRAY_FINISHED]: {screen: PrayerFinishedScreen},
    [ScreenKey.PRAY_FOR_OTHER]: {screen: PrayForOtherScreen},
    [ScreenKey.NOTIFICATIONS]: {screen: NotificationScreen},

}, {
    contentComponent: Drawer // custom drawer
});

const MainNav = createStackNavigator({
        [ScreenKey.SPLASH_SCREEN]: {screen: SplashScreen},
        [ScreenKey.DRAWER_NAV]: {screen: DrawerNav},
        [ScreenKey.LOGIN_SCREEN]: {screen: LoginScreen},
        [ScreenKey.FORGOT_PASS]: {screen: ForgotPasswordScreen},
        [ScreenKey.CREATE_PRAYING]: {screen: CreatePrayerScreen},
        [ScreenKey.PRAY_DETAIL]: {screen: PrayerDetailScreen},
        [ScreenKey.CREATE_ACCOUNT]: {screen: RegisterScreen},
        [ScreenKey.PROFILE]: {screen: ProfileScreen},
        [ScreenKey.INTRO]: {screen: IntroScreen},
        [ScreenKey.ABOUT]: {screen: AboutScreen},
    }, {
        headerMode: 'none',
        initialRouteName: ScreenKey.SPLASH_SCREEN,
        navigationOptions: {
            gesturesEnabled: false,
        },
    }
)

export default MainNav;