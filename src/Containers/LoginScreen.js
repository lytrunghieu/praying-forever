// Libraries
import React, {PureComponent} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';

// Utilities
import {ScreenKey} from '../Constants';
import {Colors, Metrics} from '../Themes';
import I18n from '../I18n';
import {CommonUtils} from '../Utils';

//Components
import NavBar from '../Components/Common/NavBar';
import Button from '../Components/Common/Button';

// Reduxes
// import LoginActions from '../Redux/LoginRedux';
import AuthenticateActions from '../Redux/AuthenticateRedux';
import firebase from 'react-native-firebase';

class LoginScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            passWord: ""
        }
    }

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            console.warn("onAuthStateChanged" , user);
            if (user) {
                this.setState({ user: user.toJSON() });
            } else {
                // User has been signed out, reset the state
                this.setState({
                    user: null,
                    message: '',
                    codeInput: '',
                    phoneNumber: '+44',
                    confirmResult: null,
                });
            }
        });
    }

    render() {
        const {authentication} = this.props;

        // CommonUtils.log('LoginScreen render this.props: ', this.props)
        return (
            <View style={styles.container}>

                <NavBar title={I18n.t('logInScreen')}
                        isHideLeftButton
                        isHideRightButton
                />

                <View style={[styles.body]}>

                    <View style={[styles.inputInfoWrapper]}>
                        <TextInput
                            ref={(email) => (this.inputEmail = email)}
                            style={{color: Colors.black, marginBottom: Platform.OS === 'ios' ? 20 : 0}}
                            placeholder={I18n.t('userName').toUpperCase()}
                            keyboardType={'email-address'}
                            returnKeyType={'next'}
                            autoCapitalize={'none'}
                            underlineColorAndroid={'transparent'}
                            onSubmitEditing={() => this.inputPassword.focus()}
                            value={this.state.userName}
                            onChangeText={text => this.setState({userName: text})}
                        />

                        <TextInput
                            ref={(password) => (this.inputPassword = password)}
                            style={{color: Colors.black}}
                            placeholder={I18n.t('passWord').toUpperCase()}
                            secureTextEntry={true}
                            autoCapitalize={'none'}
                            returnKeyType={'done'}
                            underlineColorAndroid={'transparent'}
                            onSubmitEditing={() => this.onPressLogin()}
                            value={this.state.passWord}
                            onChangeText={text => this.setState({passWord: text})}
                        />

                    </View>

                    <Button onPress={() => this.onPressLogin()}
                            labelWrapper={styles.loginLabelWrapper}
                            label={I18n.t('logIn')}
                            buttonStyle={[styles.button]}
                            labelStyle={styles.titleText}
                            isHideIcon
                        // isLoading={authentication.fetching}
                    />

                    <Button onPress={() => this.props.navigation.navigate(ScreenKey.SIGNUP_SCREEN)}
                            labelWrapper={styles.loginLabelWrapper}
                            label={I18n.t('signUp')}
                            buttonStyle={[styles.button]}
                            labelStyle={styles.titleText}
                            isHideIcon
                    />
                </View>
            </View>
        );
    }

    onPressLogin = () => {
        firebase.auth()
            .verifyPhoneNumber("+841212515718")
            .on('state_changed', (phoneAuthSnapshot) => {
                console.warn("state_changed:", phoneAuthSnapshot)
                // How you handle these state events is entirely up to your ui flow and whether
                // you need to support both ios and android. In short: not all of them need to
                // be handled - it's entirely up to you, your ui and supported platforms.

                // E.g you could handle android specific events only here, and let the rest fall back
                // to the optionalErrorCb or optionalCompleteCb functions
                switch (phoneAuthSnapshot.state) {
                    // ------------------------
                    //  IOS AND ANDROID EVENTS
                    // ------------------------
                    case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                        console.warn('code sent');
                        // on ios this is the final phone auth state event you'd receive
                        // so you'd then ask for user input of the code and build a credential from it
                        // as demonstrated in the `signInWithPhoneNumber` example above

                        break;
                    case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                        console.warn('verification error');
                        console.warn(phoneAuthSnapshot.error);
                        break;

                    // ---------------------
                    // ANDROID ONLY EVENTS
                    // ---------------------
                    case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                        console.warn('auto verify on android timed out');
                        // proceed with your manual code input flow, same as you would do in
                        // CODE_SENT if you were on IOS
                        break;
                    case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                        // auto verified means the code has also been automatically confirmed as correct/received
                        // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
                        console.warn('auto verified on android');
                        console.warn(phoneAuthSnapshot);
                        // Example usage if handling here and not in optionalCompleteCb:
                        // const { verificationId, code } = phoneAuthSnapshot;
                        // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

                        // Do something with your new credential, e.g.:
                        // firebase.auth().signInWithCredential(credential);
                        // firebase.auth().currentUser.linkWithCredential(credential);
                        // etc ...
                        break;
                }
            }, (error) => {
                // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
                // the ERROR case in the above observer then there's no need to handle it here
                alert(error);
                // verificationId is attached to error if required
                // alert(error.verificationId);
            }, (phoneAuthSnapshot) => {
                // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
                // depending on the platform. If you've already handled those cases in the observer then
                // there's absolutely no need to handle it here.

                // Platform specific logic:
                // - if this is on IOS then phoneAuthSnapshot.code will always be null
                // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
                //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
                // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
                //   continue with user input logic.
                console.warn(phoneAuthSnapshot);
            });
// optionally also supports .then & .catch instead of optionalErrorCb &
// optionalCompleteCb (with the same resulting args)

    }
}

const mapStateToProps = (state) => {
    // CommonUtils.log("LoginScreen mapStateToProps state: ", state)
    return {
        // authentication: state.authenticate
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // authenticate: (param) => dispatch(AuthenticateActions.authenticateRequest(param))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,

    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginLabelWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'blue',
        // paddingLeft: 10,
        // paddingRight: 20,
    },
    loginIconWrapper: {
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: 10
    },
    button: {
        width: 150,
        height: 50,
        backgroundColor: Colors.blueSky,
        margin: 10
    },
    inputInfoWrapper: {
        // marginTop: 10,
        // marginLeft: 30,
        // marginRight: 30,
        height: Metrics.screenHeight / 3,
        width: Metrics.screenWidth - 40,
        // backgroundColor: 'green'
    }
});