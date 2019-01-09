// Libraries
import React, {PureComponent} from 'react';
import {View, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {SafeAreaView} from 'react-navigation';

// Utilities
import {Colors} from '../Themes';

// Components
import {StatusBar} from '../Components/Common';
import {ModalScanQR, ModalQR, ActionPrayerModal, ConfirmModal,NetworkBar} from "../Components/Modules";

//Reduxes
import StartupActions from '../Redux/StartupRedux';

import {prayerActions} from '../Action';

// Persist
import ReduxPersist from '../Config/ReduxPersist';

// Navigation


import {EventRegisterTypes} from "../Constants";
import {EventRegister} from 'react-native-event-listeners';
import {bindActionCreators} from 'redux';
import firebase, {Notification, NotificationOpen} from 'react-native-firebase';
import I18n from "../I18n";
import * as ReactNavigation from 'react-navigation';
import AppNavigation from '../Navigation/AppNavigation';
import {BackHandler, NetInfo} from 'react-native';


class RootContainer extends PureComponent {



    constructor(props) {
        super(props);
        this.state ={
          isOffline: false
        };
        this.onAcceptDeletePrayer = this.onAcceptDeletePrayer.bind(this);
        this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
    }

    componentDidMount() {
        // if redux persist is not active fire startup action
        // if (!ReduxPersist.active) {
        //     this.props.startup();
        // }

        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type ==="none" || connectionInfo.type ==="unknown"){
                this.setState({
                   isOffline : true
                });
            } else{
                this.setState({
                    isOffline : false
                });
            }
            console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
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
                        this.refs["_modalQR"].open(data);
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
                    const {data} = params;
                    if (data) {
                        this.refs["_confirmDeleteOnePrayer"].open(data);
                    }
                    else {
                        this.refs["_confirmDeleteAllPrayer"].open();

                    }
                    break;
                }


            }
        });

        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBack)
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        NetInfo.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigationReducer !== this.props.navigationReducer) {
            Keyboard.dismiss();
        }
        if(nextProps.errorMessageReducer !== this.props.errorMessageReducer && nextProps.errorMessageReducer.detail && nextProps.errorMessageReducer.detail.message){
            alert(nextProps.errorMessageReducer.detail.message);
        }
    }

    handleFirstConnectivityChange(connectionInfo) {
        console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
        if(connectionInfo.type ==="none" || connectionInfo.type ==="unknown"){
            this.setState({
                isOffline : true
            });
        }
        else{
            this.setState({
                isOffline : false
            });
        }
    }

    handleHardwareBack = () => {
        // Back performs pop, unless we're to main screen [0,0]
        const { navigationReducer, dispatch} = this.props;
        if (navigationReducer.index === 0 && navigationReducer.routes[0].index === 0) {
            BackHandler.exitApp()
        }

        const navigation = ReactNavigation.addNavigationHelpers({
            dispatch,
            state: navigationReducer
        })

        return navigation.goBack(null)
    }


    onAcceptDeletePrayer(data) {
        const {prayerActions} = this.props;
        prayerActions.deletePrayer(data ? data.uid : null);
    }


    render() {
        const {prayerActions, dispatch, navigationReducer} = this.props;
        const {isOffline} = this.state;
        const navigation = ReactNavigation.addNavigationHelpers({
            dispatch,
            state: navigationReducer
        })

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={Colors.primary} barStyle={'dark-content'}/>
                <SafeAreaView style={styles.container}>
                    <AppNavigation navigation={navigation}/>
                    <NetworkBar visible={isOffline}/>
                    <ModalQR
                        ref={"_modalQR"}/>
                    <ModalScanQR
                        ref={"_modalScanQR"} followingPrayer={prayerActions.followingPrayer}/>
                    <ActionPrayerModal
                        ref={"_moreActionPray"}
                        navigation={navigation}
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
