import {StackNavigator, DrawerNavigator} from 'react-navigation';

import {ScreenKey} from '../Constants';

import SplashScreen from '../Containers/SplashScreen';
import {container as LoginScreen} from '../Containers/Login';
import {container as RegisterScreen} from '../Containers/Register';
import {container as ForgotPasswordScreen } from '../Containers/ForgotPassword';
import {container as Drawer} from '../Containers/Drawer';
import ListCommonContainer from '../Containers/ListCommonContainer';
import  {container as PrayingInProgressScreen} from '../Containers/PrayingInProgress';
import {container as PrayerFinishedScreen} from '../Containers/PrayerFinished';
import {container as CreatePrayerScreen} from '../Containers/CreatePrayer';
import {container as PrayerDetailScreen} from '../Containers/PrayerDetail';
import {container as  PrayForOtherScreen} from '../Containers/PrayForOthers';
import {NotificationsContainer} from '../Containers/NotificationsContainer';
import {NotificationDetailContainer} from '../Containers/NotificationDetailContainer';

const DrawerNav = DrawerNavigator({
    [ScreenKey.PRAYING_INPROGESS]: {screen: PrayingInProgressScreen},
    [ScreenKey.PRAY_FINISHED]: {screen: PrayerFinishedScreen},
    [ScreenKey.PRAY_FOR_OTHER]: {screen: PrayForOtherScreen},
    [ScreenKey.NOTIFICATIONS]: {screen: NotificationsContainer},
}, {
    contentComponent: Drawer // custom drawer
});

const MainNav = StackNavigator({
        // [ScreenKey.LOGIN_STACK] : { screen: LoginStack },
        [ScreenKey.SPLASH_SCREEN]: {screen: SplashScreen},
        [ScreenKey.DRAWER_NAV]: {screen: DrawerNav},
        [ScreenKey.LOGIN_SCREEN]: {screen: LoginScreen},
        [ScreenKey.FORGOT_PASS]: {screen: ForgotPasswordScreen},
        [ScreenKey.LIST_COMMON]: {screen: ListCommonContainer},
        [ScreenKey.CREATE_PRAYING]: {screen: CreatePrayerScreen},
        [ScreenKey.PRAY_DETAIL]: {screen: PrayerDetailScreen},
        [ScreenKey.CREATE_ACCOUNT]: {screen: RegisterScreen},
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