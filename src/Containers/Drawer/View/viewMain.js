// Libraries
import React, {PureComponent} from 'react'
import {View,Image} from 'react-native'
import I18n from '../../../I18n/index';
import {IconName} from '../../../Themes/index';
import firebase from 'react-native-firebase';
import {StackActions} from "react-navigation";
import {EventRegisterTypes, URL, StatusOfPray, ScreenKey,contentCodes,firestorePaths} from "../../../Constants";
import {EventRegister} from 'react-native-event-listeners';
import moment from "moment";
import {OptionButton, LoadingIndicator,Avatar} from "../../../Components/Modules";
import {Icon, Button, TextBase, PlaceHolder} from "../../../Components/Common";
import {List} from 'native-base';
import {style} from "../Style";
import {notification} from "../../../model";
import {firebaseAnalytics} from "../../../Utils";

const notificationCollect = firebase.firestore().collection('notification');
const tokenCollect = firebase.firestore().collection('tokens');

moment.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: 'a few seconds',
        ss: '%d seconds',
        m: "a minute",
        mm: "%d m",
        h: "an hour",
        hh: "%d h",
        d: "yesterday",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    },
});

// moment.locale('fr', {
//     months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
//     monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
//     monthsParseExact : true,
//     weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
//     weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
//     weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
//     weekdaysParseExact : true,
//     longDateFormat : {
//         LT : 'HH:mm',
//         LTS : 'HH:mm:ss',
//         L : 'DD/MM/YYYY',
//         LL : 'D MMMM YYYY',
//         LLL : 'D MMMM YYYY HH:mm',
//         LLLL : 'dddd D MMMM YYYY HH:mm'
//     },
//     calendar : {
//         sameDay : '[Aujourd’hui à] LT',
//         nextDay : '[Demain à] LT',
//         nextWeek : 'dddd [à] LT',
//         lastDay : '[Hier à] LT',
//         lastWeek : 'dddd [dernier à] LT',
//         sameElse : 'L'
//     },
//     relativeTime : {
//         future : 'dans %s',
//         past : 'il y a %s',
//         s : 'quelques secondes',
//         m : 'une minute',
//         mm : '%d minutes',
//         h : 'une heure',
//         hh : '%d heures',
//         d : 'un jour',
//         dd : '%d jours',
//         M : 'un mois',
//         MM : '%d mois',
//         y : 'un an',
//         yy : '%d ans'
//     },
//     dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
//     ordinal : function (number) {
//         return number + (number === 1 ? 'er' : 'e');
//     },
//     meridiemParse : /PD|MD/,
//     isPM : function (input) {
//         return input.charAt(0) === 'M';
//     },
//     // In case the meridiem units are not separated around 12, then implement
//     // this function (look at locale/id.js for an example).
//     // meridiemHour : function (hour, meridiem) {
//     //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
//     // },
//     meridiem : function (hours, minutes, isLower) {
//         return hours < 12 ? 'PD' : 'MD';
//     },
//     week : {
//         dow : 1, // Monday is the first day of the week.
//         doy : 4  // Used to determine first week of the year.
//     }
// });

moment.locale('vi', {
    relativeTime: {
        future: "mới %s",
        past: "đã %s",
        s: 'một vài giây',
        ss: '%d giây',
        m: "một phút",
        mm: "%d phút",
        h: "một giờ",
        hh: "%d giờ",
        d: "qua một ngày",
        dd: "%d ngày",
        M: "một tháng",
        MM: "%d tháng",
        y: "một năm",
        yy: "%d năm"
    },
});

export default class DrawerContainer extends PureComponent {

    constructor(props) {
        super();
        this.onPressLogout = this.onPressLogout.bind(this);
        this.onPressProfile = this.onPressProfile.bind(this);
        this.state = {
            notificationNotRead: this.getNotificationNotRead(props.notificationReducer.payload)
        };
    }

    componentDidMount() {
        firebaseAnalytics("Drawer screen");
        const {userActions, prayerActions,notificationActions,navigation, loginReducer} = this.props;
        const docOfCurrentUserNotification = notificationCollect.doc(firebase.auth().currentUser.uid);
        firebase.firestore().doc(firestorePaths.SIGN_IN.replace("{userUID}",firebase.auth().currentUser.uid)).onSnapshot(snapShot =>{
            if(snapShot.data()){
                const {lastSignInTime} = snapShot.data();
                if(loginReducer.payload){
                    const {lastSignInTime : _lastSignInTime} = loginReducer.payload;
                    if(moment(lastSignInTime).diff(moment(_lastSignInTime))> 0){
                        this.onPressLogout();
                    }
                }
            }
        });
        docOfCurrentUserNotification.collection("data").onSnapshot(snapshot => {
            let notificationList = [];
            snapshot.forEach(e => {
                let data = e.data();
                notificationList.push( new notification(data));
            });
            if (notificationList) {
                notificationActions.getNotifications(notificationList);
            }
        });
        const {params} = navigation.state;
        const {fromLogin }= params || {};
        if(!fromLogin){
            userActions.getProfile();
        }

        //Listen event
        this.listener = EventRegister.addEventListener("listener", async (action) => {

            if (!action || !action.type) {
                return;
            }

            const {type, params = {}, callback} = action;
            switch (type) {

                case EventRegisterTypes.UPDATE_PRAYER_STATUS : {

                    const {prayerUID} = params;
                    if (prayerUID) {
                        prayerActions.updateStatusPrayer(prayerUID);
                    }
                    break;
                }

                case EventRegisterTypes.UPDATE_LIVE_STATUS: {
                    const {prayerUID, live} = params;
                    if (prayerUID) {
                        prayerActions.updateLiveStatusPrayer({prayerUID, live});
                    }
                    break;
                }

                case EventRegisterTypes.FOLLOWING_PRAYER: {
                    const {prayerUID, userOtherUID, follow} = params
                    if (prayerUID && userOtherUID) {
                        prayerActions.followingPrayer({prayerUID, userOtherUID, follow , isPublic : true});
                    }
                    break;
                }

                case EventRegisterTypes.NAVIGATE_SCREEN : {

                    const {screen , params : _params} = params;
                    if (screen) {
                      this.props.navigation.navigate(screen,_params)
                    }
                    break;
                }


                default : {
                    break;
                }
            }
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            const {navigation: {navigate}} = this.props;
            navigate(ScreenKey.NOTIFICATIONS);

        });

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            // Process your token as required
            // console.log("refresh token ", fcmToken);
            this.updateToken(fcmToken);
        });

        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    // user has a device token
                    // console.log("fcmToken :", fcmToken);
                    this.updateToken(fcmToken);
                } else {
                    // user doesn't have a device token yet
                    console.log("user doesn't have a device token yet");
                }
            });

        firebase.notifications().getInitialNotification()
            .then((notificationOpen: NotificationOpen) => {
                if (notificationOpen) {
                    // App was opened by a notification
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification: Notification = notificationOpen.notification;
                    const {navigation: {navigate}} = this.props;
                    navigate(ScreenKey.NOTIFICATIONS);
                }
            });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        this.notificationOpenedListener();
        this.onTokenRefreshListener();
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.notificationReducer.payload !== this.props.notificationReducer.payload) {
            this.setState({
                notificationNotRead: this.getNotificationNotRead(nextProps.notificationReducer.payload)
            });
        }

    }

    //region handle action press

    onPressOption(screen) {
        const {navigation: {navigate}} = this.props;
        navigate(screen);
    }

    onPressLogout() {
        const {userActions} = this.props;
        userActions.logout().then(res => {
            const resetAction = StackActions.replace({
                index: 0,
                routeName: ScreenKey.LOGIN_SCREEN,
            });
            this.props.navigation.dispatch(resetAction);
        });
    }

    onPressProfile() {

        const {userReducer} = this.props;
        const {payload} = userReducer;
        if (firebase.auth().currentUser &&  payload) {
            this.props.navigation.navigate(ScreenKey.PROFILE, {userUID: firebase.auth().currentUser.uid});
        }

    }

    //endregion


    getNotificationNotRead(notif) {
        if (!Array.isArray(notif)) {
            return 0
        }
        return notif.filter(no => !no.isRead).length;
    }

    updateToken(fcmToken) {
        tokenCollect.doc(firebase.auth().currentUser.uid).set({
            token: fcmToken
        }).then(res => {
            this.fcmToken = fcmToken;
        }).catch(err => {
        });
    }

    render() {
        const {prayerReducer, drawerReducer, userReducer,navigation} = this.props;
        const {notificationNotRead} = this.state;
        const praysFinished = prayerReducer.payload && prayerReducer.payload.filter(e => e.status == StatusOfPray.COMPLETE) || [];
        const praysInprogress = prayerReducer.payload && prayerReducer.payload.filter(e => e.status == StatusOfPray.INPROGRESS) || [];
        const {payload, fetching } = userReducer;
        const {displayName = "", avatarURL} = payload ||  {};
        const isDrawerOpen = navigation && navigation.state && navigation.state.isDrawerOpen;
        return (
            <View key={"main"} pointerEvents={fetching ?"none":"auto"}>
                <LoadingIndicator visible={fetching  && isDrawerOpen}/>
                <View style={style.profileContainer}>
                    <Avatar uri={avatarURL} largeX={true} />
                    <PlaceHolder/>
                    <TextBase large={true} bold={true}>{displayName}</TextBase>
                    <PlaceHolder/>
                    <Button rounded={true} center={true} text={I18n.t("edit")} onPress={this.onPressProfile}/>
                </View>
                <List>
                    <OptionButton text={I18n.t("inprogress")}
                                  leftIcon={IconName.prayer_inprogress}
                                  count={ praysInprogress.length}
                                  onPress={this.onPressOption.bind(this, ScreenKey.PRAYING_INPROGESS)}/>
                    <OptionButton text={I18n.t("finished")}
                                  leftIcon={IconName.prayer_complete}
                                  count={praysFinished.length}
                                  onPress={this.onPressOption.bind(this, ScreenKey.PRAY_FINISHED)}/>
                    <OptionButton text={I18n.t("prayForOther")}
                                  leftIcon={IconName.prayer_help}
                                  onPress={this.onPressOption.bind(this, ScreenKey.PRAY_FOR_OTHER)}/>
                    <OptionButton text={I18n.t("notifications")}
                                  leftIcon={IconName.notification}
                                  onPress={this.onPressOption.bind(this, ScreenKey.NOTIFICATIONS)} countRed={true}
                                  count={notificationNotRead}/>
                    {/*<OptionButton text={I18n.t("setting")} leftIcon={IconName.setting}/>*/}
                    <OptionButton text={I18n.t("about")} leftIcon={IconName.about}  onPress={this.onPressOption.bind(this, ScreenKey.ABOUT)}/>
                    <OptionButton text={I18n.t("logout")} leftIcon={IconName.logout}
                                  onPress={this.onPressLogout}/>

                </List>
            </View>

        )
    }
}



