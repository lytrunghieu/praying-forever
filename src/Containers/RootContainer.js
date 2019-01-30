// Libraries
import React, {PureComponent} from 'react';
import {View, Keyboard, ToastAndroid} from 'react-native';
import {connect} from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {SafeAreaView} from 'react-navigation';
// Utilities
import {Colors} from '../Themes';

// Components
import {StatusBar} from '../Components/Common';
import {ModalScanQR, ModalQR, ActionPrayerModal, ConfirmModal, NetworkBar} from "../Components/Modules";
import {prayerActions} from '../Action';
// Navigation
import {EventRegisterTypes} from "../Constants";
import {EventRegister} from 'react-native-event-listeners';
import {bindActionCreators} from 'redux';
import firebase, {Notification, NotificationOpen} from 'react-native-firebase';
import I18n from "../I18n";
import AppNavigation from '../Navigation/AppNavigation';
import {BackHandler, NetInfo} from 'react-native';
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'

const middlewareRoot = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);

const App = reduxifyNavigator(AppNavigation, "root");

class RootContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOffline: false,
            warningExit: false
        };
        this.onAcceptDeletePrayer = this.onAcceptDeletePrayer.bind(this);
        this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
        this.timeoutWarningExit = null;
    }

    componentDidMount() {
        // if redux persist is not active fire startup action
        // if (!ReduxPersist.active) {
        //     this.props.startup();
        // }

        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type === "none" || connectionInfo.type === "unknown") {
                this.setState({
                    isOffline: true
                });
            } else {
                this.setState({
                    isOffline: false
                });
            }
        });

        NetInfo.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );

        this.listener = EventRegister.addEventListener("listener", async (action) => {
            if (!action || !action.type) {
                return;
            }

            const {type, params = {}, callback} = action;
            switch (type) {
                case EventRegisterTypes.SHOW_MODAL_QR_CODE : {
                    const {show = true, data} = params;
                    if (show && data) {
                        const {uid, owner = {}} = data;
                        const {uid: userOtherUID} = owner;
                        const text = uid.toString().concat(",").concat(userOtherUID);
                        this.refs["_modalQR"].open(text);
                    }
                    break;
                }

                case EventRegisterTypes.SHOW_SCANNER : {
                    this.refs["_modalScanQR"].open();
                    break;
                }


                case EventRegisterTypes.SHOW_PRAYER_OPTION : {
                    const {data} = params;
                    if (data) {
                        this.refs["_moreActionPray"].open(data);
                    }
                    break;
                }

                case EventRegisterTypes.SHOW_CONFIRM_MODAL : {
                    const {data, status} = params;
                    if (data) {
                        this.refs["_confirmDeleteOnePrayer"].open(data);
                    }
                    else {
                        this.refs["_confirmDeleteAllPrayer"].open({type: status});

                    }
                    break;
                }


            }
        });

        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBack)
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBack);
        NetInfo.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
        if (this.timeoutWarningExit) {
            this.timeoutWarningExit.clearTimeout();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigationReducer !== this.props.navigationReducer) {
            Keyboard.dismiss();
        }
        if (nextProps.errorMessageReducer !== this.props.errorMessageReducer && nextProps.errorMessageReducer.detail && nextProps.errorMessageReducer.detail.message) {
            alert(nextProps.errorMessageReducer.detail.message);
        }
    }

    handleFirstConnectivityChange(connectionInfo) {
        if (connectionInfo.type === "none" || connectionInfo.type === "unknown") {
            this.setState({
                isOffline: true
            });
        }
        else {
            this.setState({
                isOffline: false
            });
        }
    }

    handleHardwareBack = () => {
        // Back performs pop, unless we're to main screen [0,0]
        const {dispatch, navigationReducer, pendingReducer} = this.props;
        const {warningExit} = this.state;
        const {payload} = pendingReducer;
        if (payload.length > 0) {
            return true;
        }

        if (warningExit) {
            BackHandler.exitApp()
        }
        else {
            this.setState({
                warningExit: true
            });
            if (this.timeoutWarningExit) {
                this.timeoutWarningExit.clearTimeout();
                this.timeoutWarningExit = null
            }
            this.timeoutWarningExit = setTimeout(() => {
                this.setState({
                    warningExit: false
                });
                this.timeoutWarningExit = null
            }, 3000)
            ToastAndroid.show(I18n.t("tryAgainToExit"), ToastAndroid.SHORT);
            return true
        }
    }


    onAcceptDeletePrayer(data) {
        const {prayerActions} = this.props;
        const {uid: prayerUID, type} = data || {};
        prayerActions.deletePrayer({prayerUID, status: type});
    }


    render() {
        const {prayerActions, dispatch, navigationReducer, pendingReducer} = this.props;
        const { payload} = pendingReducer;
        const {isOffline} = this.state;
        return (
            <View style={styles.container} pointerEvents={payload.length > 0 ? "none" : "auto"}>
                <StatusBar backgroundColor={Colors.black} barStyle={'light-content'}/>
                <SafeAreaView style={styles.container}>
                    <NetworkBar online={!isOffline}/>
                    <App dispatch={dispatch} state={navigationReducer} />
                    <ModalQR
                        ref={"_modalQR"}/>
                    <ModalScanQR
                        ref={"_modalScanQR"} followingPrayer={prayerActions.followingPrayer}/>
                    <ActionPrayerModal
                        ref={"_moreActionPray"}
                    />

                    <ConfirmModal
                        key="ConfirmModal"
                        ref={"_confirmDeleteAllPrayer"}
                        title={I18n.t("warning")}
                        content={I18n.t("deleteConfirmAll")}
                        rejectText={I18n.t("cancel")}
                        acceptText={I18n.t("yes")}
                        onAccept={this.onAcceptDeletePrayer}
                    />

                    <ConfirmModal
                        ref={"_confirmDeleteOnePrayer"}
                        title={I18n.t("warning")}
                        content={I18n.t("deleteConfirm")}
                        rejectText={I18n.t("cancel")}
                        acceptText={I18n.t("yes")}
                        onAccept={this.onAcceptDeletePrayer}
                    />
                </SafeAreaView>

            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    navigationReducer: state.navigationReducer,
    errorMessageReducer: state.errorMessageReducer,
    pendingReducer: state.pendingReducer,
})

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => {
    return Object.assign({dispatch: dispatch}, {
            prayerActions: bindActionCreators(prayerActions, dispatch)
        }
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);

const styles = EStyleSheet.create({
    container: {
        flex: 1,
    }
});
