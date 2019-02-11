// Libraries
import React, {Component} from 'react';
import {
    View,
    Image,
    AsyncStorage
} from 'react-native';
import {connect} from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {StackActions} from "react-navigation";
import {ScreenKey, AsyncStoreKeys} from '../../../Constants/index';
import {Colors, Metrics, Images} from '../../../Themes/index';
import firebase from 'react-native-firebase';

class SplashScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            let unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                const {userReducer} = this.props;
                const {payload} = userReducer;
                if (user && user.emailVerified && payload) {
                    const resetAction = StackActions.replace({
                        index: 0,
                        routeName: ScreenKey.DRAWER_NAV,
                    });
                    this.props.navigation.dispatch(resetAction);
                }
                else {

                    AsyncStorage.getItem(AsyncStoreKeys.IS_STARTED, (error, result) => {
                        if (result == "true") {
                            const resetAction = StackActions.replace({
                                index: 0,
                                routeName: ScreenKey.LOGIN_SCREEN,
                            });
                            this.props.navigation.dispatch(resetAction);
                        }
                        else {
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

        const {navigate} = this.props.navigation;

        return (
            <View style={styles.container}>
                <Image source={Images.landing}
                       style={styles.backgroundImage}/>
            </View>
        );

    }
}