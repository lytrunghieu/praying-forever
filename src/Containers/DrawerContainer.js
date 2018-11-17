// Libraries
import React, {PureComponent} from 'react'
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native'
import {connect} from 'react-redux';
import I18n from '../I18n';
import {Images, Colors, Metrics} from '../Themes';
import {Option} from "../Components/Common";
import firebase from 'react-native-firebase';
import {NavigationActions} from "react-navigation";
import {bindActionCreators} from 'redux';
import {CommonActions, NotificationActions} from '../actions';
import {Pray} from "../model";
import {EventRegisterTypes, URL, StatusOfPray, ScreenKey} from "../Constants";
import {EventRegister} from 'react-native-event-listeners';
import * as _ from "lodash";
import moment from "moment";
import PrayStatus from "../model/PrayStatus";

const prayCollect = firebase.firestore().collection('pray');
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

class DrawerContainer extends PureComponent {

    constructor(props) {
        super();
        this.onPressLogout = this.onPressLogout.bind(this);
    }

    componentDidMount() {
        const docOfCurrentUserPray = prayCollect.doc(firebase.auth().currentUser.uid);
        const docOfCurrentUserNotification = notificationCollect.doc(firebase.auth().currentUser.uid);

        docOfCurrentUserPray.collection("data").onSnapshot(snapshot => {
            let prayList = [];
            snapshot.forEach(e => {
                let data = new Pray((e.data()));
                prayList.push(data);
            });

            if (prayList) {
                this.props.commonActions.updatePrayList(prayList);
            }
        });

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


        //Listen event
        this.listener = EventRegister.addEventListener("listener", async (action) => {

            if (!action || !action.type) {
                return;
            }

            const {type, params = {}, callback} = action;
            switch (type) {

                case EventRegisterTypes.DELETE_PRAY : {
                    const {uid} = params;
                    const httpsCallable = firebase.functions(firebase.app()).httpsCallable("deletePray");
                    httpsCallable({userUID: firebase.auth().currentUser.uid, prayUID: uid})
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

                case EventRegisterTypes.UPDATE_STATUS_PRAY : {
                    const {uid, status} = params;
                    const currentPray = docOfCurrentUserPray.collection("data").doc(uid);
                    if (status === StatusOfPray.INPROGRESS) {
                        const httpsCallable = firebase.functions(firebase.app()).httpsCallable("completePrayer");
                        httpsCallable({userUID: firebase.auth().currentUser.uid, prayUID: uid})
                            .then(data => {
                            })
                            .catch(httpsError => {
                                console.log("ERROR :", httpsError);
                                console.log(httpsError.code);
                                console.log(httpsError.message);
                                console.log(httpsError.details.errorDescription);
                            });
                    }
                    else {
                        currentPray.update("status", status).then(res => {
                            if (callback) {
                                callback({success: true, data: res});
                            }
                        });
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

    //region handle action press

    onPressOption(screen) {
        const {navigation: {navigate}} = this.props;
        navigate(screen);
    }

    onPressLogout() {
        firebase.auth().signOut().then(res => {
            this.props.navigation.dispatch({type: NavigationActions.RESET, routeName: ScreenKey.LOGIN_SCREEN});
        }).catch(err => {
            alert(err);
        });
    }

    //endregion

    updateToken(fcmToken) {
        tokenCollect.doc(firebase.auth().currentUser.uid).set({
            token: fcmToken
        }).then(res => {
            this.fcmToken = fcmToken;
        }).catch(err => {
        });
    }

    render() {
        const {navigation: {navigate}, logout, activeItemKey, prays} = this.props;
        const praysFinished = prays.filter(e => e.status == StatusOfPray.COMPLETE);

        return (
            <View style={styles.container}>
                <ScrollView style={styles.body}>
                    <Option text={I18n.t("inprogress")} count={prays.length - praysFinished.length}
                            leftIcon={Images.inProgress}
                            onPress={this.onPressOption.bind(this, ScreenKey.PRAYING_INPROGESS)}/>
                    <Option text={I18n.t("finished")} count={praysFinished.length} leftIcon={Images.complete}
                            onPress={this.onPressOption.bind(this, ScreenKey.PRAY_FINISHED)}/>
                    <Option text={I18n.t("prayForOther")} leftIcon={Images.complete}
                            onPress={this.onPressOption.bind(this, ScreenKey.PRAY_FOR_OTHER)}/>
                    <Option text={I18n.t("notifications")} leftIcon={Images.setting}
                            onPress={this.onPressOption.bind(this, ScreenKey.NOTIFICATIONS)}/>
                    <Option text={I18n.t("setting")} leftIcon={Images.setting}/>
                    <Option text={I18n.t("about")} leftIcon={Images.about}/>
                    <Option text={I18n.t("logout")} leftIcon={Images.logout} onPress={this.onPressLogout}/>
                    <Option text={firebase.auth().currentUser.email}/>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        prays: state.commonReducer.prays
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        commonActions: bindActionCreators(CommonActions, dispatch),
        notificationActions: bindActionCreators(NotificationActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    body: {
        flex: 1,
    }
})
