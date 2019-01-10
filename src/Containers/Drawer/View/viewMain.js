// Libraries
import React, {PureComponent} from 'react'
import {View} from 'react-native'
import I18n from '../../../I18n/index';
import {IconName} from '../../../Themes/index';
import firebase from 'react-native-firebase';
import {NavigationActions} from "react-navigation";
import {EventRegisterTypes, URL, StatusOfPray, ScreenKey} from "../../../Constants/index";
import {EventRegister} from 'react-native-event-listeners';
import moment from "moment";
import {OptionButton, LoadingIndicator} from "../../../Components/Modules";
import {Icon,Button,TextBase} from "../../../Components/Common";
import {List} from 'native-base';
import {style} from "../Style";

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
    }
});

export default class DrawerContainer extends PureComponent {

    constructor(props) {
        super();
        this.onPressLogout = this.onPressLogout.bind(this);
        this.getPray = this.getPray.bind(this);
        this.state = {
            notificationNotRead: this.getNotificationNotRead(props.notifications)
        };
    }

    componentDidMount() {
        const docOfCurrentUserNotification = notificationCollect.doc(firebase.auth().currentUser.uid);
        docOfCurrentUserNotification.collection("data").onSnapshot(snapshot => {
            let notificationList = [];
            snapshot.forEach(e => {
                let data = e.data();
                notificationList.push(data);
            });
            if (notificationList) {
                this.props.notificationActions.getNotifications(notificationList);
            }
        });

        this.getPray();
        const {userActions, prayerActions} = this.props;
        userActions.getProfile();

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

                case EventRegisterTypes.DELETE_NOTIFICATION : {
                    const {uid} = params;
                    const httpsCallable = firebase.functions(firebase.app()).httpsCallable("deleteNotification");
                    httpsCallable({userUID: firebase.auth().currentUser.uid, notifUID: uid})
                        .then(data => {
                        })
                        .catch(httpsError => {
                            console.log("ERROR :", httpsError);
                            console.log(httpsError.code);
                            console.log(httpsError.message);
                            console.log(httpsError.details.errorDescription);
                        });
                    break;
                }

                case EventRegisterTypes.UPDATE_NOTIFICATION : {
                    const {uid} = params;
                    if (uid) {
                        docOfCurrentUserNotification.collection("data").doc(uid).update("isRead", true).catch(error => {
                            console.warn("ERROR :", error);
                        });
                    }
                    else {
                        docOfCurrentUserNotification.collection("data").get().then(colSnap => {
                            let batch = firebase.firestore().batch();
                            colSnap.forEach(dataSnap => {
                                batch.update(dataSnap.ref, "isRead", true);
                            });
                            batch.commit().catch(error => {
                                console.warn("ERROR :", error);
                            });

                        });
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
                        prayerActions.followingPrayer({prayerUID, userOtherUID, follow});
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
        if (nextProps.notifications !== this.props.notifications) {
            this.setState({
                notificationNotRead: this.getNotificationNotRead(nextProps.notifications)
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
            if (res.success) {
                this.props.navigation.dispatch({type: NavigationActions.RESET, routeName: ScreenKey.LOGIN_SCREEN});
            }
        });
    }

    //endregion


    getNotificationNotRead(notif) {
        if (!Array.isArray(notif)) {
            return 0
        }
        return notif.filter(no => !no.isRead).length;
    }

    getPray() {
        const {prayerActions} = this.props;
        prayerActions.getPrayer();
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
        const {prayerReducer, drawerReducer,userReducer} = this.props;
        const {notificationNotRead} = this.state;
        const {fetching} = drawerReducer;
        const praysFinished = prayerReducer.payload && prayerReducer.payload.filter(e => e.status == StatusOfPray.COMPLETE) || [];
        const {payload ={}} = userReducer;
        // const {displayName =""} = payload;
        return (
            <View key={"main"} pointerEvents={fetching ? "none" : "auto"}>
                <LoadingIndicator visible={fetching}/>
                <View style ={style.profileContainer}>
                    <Icon large={true}/>
                    <TextBase>lyhe</TextBase>
                    <Button rounded={true} center={true} text={ I18n.t("edit")} ></Button>
                </View>
                <List>
                    <OptionButton text={I18n.t("inprogress")}
                                  leftIcon={IconName.prayer_inprogress}
                                  count={prayerReducer.payload ? prayerReducer.payload.length : []}
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
                                  onPress={this.onPressOption.bind(this, ScreenKey.NOTIFICATIONS)} isCircle={true}
                                  count={notificationNotRead}/>
                    <OptionButton text={I18n.t("setting")} leftIcon={IconName.setting}/>
                    <OptionButton text={I18n.t("about")} leftIcon={IconName.about}/>
                    <OptionButton text={I18n.t("logout")} leftIcon={IconName.logout}
                                  onPress={this.onPressLogout}/>
                    {
                        firebase.auth().currentUser ? <OptionButton text={firebase.auth().currentUser.email}/> : null
                    }


                </List>
            </View>

        )
    }
}



