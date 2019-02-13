// Libraries
import React, {Component} from 'react';
import {
    View,
    Image,
    AsyncStorage
} from 'react-native';
import {StackActions} from "react-navigation";
import {ScreenKey, AsyncStoreKeys} from '../../../Constants';
import {Images} from '../../../Themes';
import firebase from 'react-native-firebase';
import {style as styles} from "../Style";
import {firebaseAnalytics} from "../../../Utils";
import DeviceInfo from 'react-native-device-info';

export default class SplashScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userReducer.payload !== this.props.userReducer.payload && this.props.userReducer.payload && !nextProps.userReducer.payload) {
            const resetAction = StackActions.replace({
                index: 0,
                routeName: ScreenKey.DRAWER_NAV,
            });
            this.props.navigation.dispatch(resetAction);
        }
    }

    componentDidMount() {
        firebaseAnalytics("Splash screen");
        setTimeout(() => {
            let unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                const {userReducer} = this.props;
                const {payload} = userReducer;
                if (user && user.emailVerified && payload) {
                    AsyncStorage.getItem(AsyncStoreKeys.PREVIOUS_VERSION, (err, result) => {
                        if (result && result != DeviceInfo.getBuildNumber()) {
                            AsyncStorage.removeItem(AsyncStoreKeys.PREVIOUS_VERSION, error => {
                                if (!error) {
                                    const {commonActions} = this.props;
                                    commonActions.resetPersistState();
                                }
                                else {
                                    console.log("ERROR/AsyncStorage.removeItem", error);
                                }
                            });
                        }
                        else {
                            const resetAction = StackActions.replace({
                                index: 0,
                                routeName: ScreenKey.DRAWER_NAV,
                            });
                            this.props.navigation.dispatch(resetAction);
                        }
                    });


                }
                else {
                    AsyncStorage.multiGet([AsyncStoreKeys.IS_STARTED, AsyncStoreKeys.PREVIOUS_VERSION], (err, stores) => {
                        if (stores[0][1] == "true") {
                            const resetAction = StackActions.replace({
                                index: 0,
                                routeName: ScreenKey.LOGIN_SCREEN,
                            });
                            this.props.navigation.dispatch(resetAction);
                        }
                        else {
                            if (!stores[1][1]) {
                                AsyncStorage.setItem(AsyncStoreKeys.PREVIOUS_VERSION, DeviceInfo.getBuildNumber().toString(),error =>{
                                    if(!error){
                                    }
                                    else{
                                        console.log("ERROR/AsyncStorage.setItem", error);
                                    }
                                });
                            }
                            const resetAction = StackActions.replace({
                                index: 0,
                                routeName: ScreenKey.INTRO,
                            });
                            this.props.navigation.dispatch(resetAction);
                        }
                    });
                }
                unsubscribe();
            });
        }, 2000);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={Images.landing}
                       style={styles.backgroundImage}/>
            </View>
        );

    }
}

