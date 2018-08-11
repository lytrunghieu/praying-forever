// Libraries
import React, {Component} from 'react';
import {
    View,
    Image
} from 'react-native';
import {connect} from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {NavigationActions} from "react-navigation";
import {ScreenKey} from '../Constants';
import {Colors, Metrics, Images} from '../Themes';
import firebase from 'react-native-firebase';

class SplashScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            let unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                if (user) {

                    this.props.navigation.dispatch({type: NavigationActions.RESET, routeName: ScreenKey.DRAWER_NAV});
                }
                else {
                    this.props.navigation.dispatch({type: NavigationActions.RESET, routeName: ScreenKey.LOGIN_SCREEN});
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

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.blueSky,
    },
    backgroundImage: {
        // flex: 1,
        top: 0,
        left: 0,
        width: Metrics.screenWidth,
        height: Metrics.screenHeight,
    }
});