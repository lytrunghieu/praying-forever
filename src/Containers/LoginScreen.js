
import React, {PureComponent} from 'react';
import {
    View,
    Platform,
    StatusBar,
    Image,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ScreenKey} from '../Constants';
import {Colors, Metrics, Images} from '../Themes';
import I18n from '../I18n';
import firebase from 'react-native-firebase';
import {Input, TextLink, TextBase, Button, PlaceHolder, TextError} from "../Components/Common";
import * as _ from "lodash";

class LoginScreen extends PureComponent {

    //region cycle life

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            validEmail : true,
            passWord: "",
            validPassword : true
        };

        this.onPressForgot = this.onPressForgot.bind(this);
        this.onPressLogin = this.onPressLogin.bind(this);
        this.onPressSubmitEmail = this.onPressSubmitEmail.bind(this);

        this.onChangeEmailText = this.onChangeEmailText.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    componentDidMount() {
    }
    //endregion


    //region handle value change

    onChangeEmailText(value){
        this.setState({
            email: value
        });
    }

    onChangePassword(value){
        this.setState({
           passWord: value
        });
    }
    //endregion

    //region handle action press

    onPressLogin(){
        const {email,passWord}  = this.state;
        let valid ={validPassword : true , validEmail : true};
        if(_.isEmpty(email)){
            valid.validEmail = false;
        }
        if(_.isEmpty(passWord)){
          valid.validPassword = false;
        }
        if(valid.validPassword && valid.validEmail){
            firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email,passWord).then(res =>{
              this.props.navigation.navigate(ScreenKey.PRAYING_INPROGESS);
            }).catch(err =>{
                alert(err);
            });
        }
        this.setState(valid);
    }

    onPressSubmitEmail(){
        this.refs["textInput2"].focus();
    }

    onPressForgot(){
        this.props.navigation.navigate(ScreenKey.FORGOT_PASS);
    }
    //endregion

    //region Rendering

    render() {
        return (
            <View style={styles.container}>

                <ScrollView contentContainerStyle={[styles.body]}>
                    <PlaceHolder height={100}/>
                    <Image source={Images.logo}/>
                    <PlaceHolder height={20}/>
                    <Input
                        ref={"textInput"}
                        value={this.state.email}
                        placeholder={I18n.t("inputEmail")}
                        onChangeText={this.onChangeEmailText}
                        isShowShadow={true}
                        hideDivider={true}
                        customBorder={true}
                        leftIcon={Images.user}
                        hideCloseIcon ={true}
                        returnKeyLabel ={"next"}
                        autoFocus={true}
                        onSubmitEditing ={this.onPressSubmitEmail}
                    />

                    <PlaceHolder/>
                    {
                        !this.state.validEmail && [<TextError text={I18n.t("emailNull")} style={{alignSelf:"flex-start"}}/>, <PlaceHolder/>]
                    }

                    <Input
                        ref={"textInput2"}
                        value={this.state.passWord}
                        placeholder={I18n.t("inputPassword")}
                        onChangeText={this.onChangePassword}
                        isShowShadow={true}
                        hideDivider={true}
                        customBorder={true}
                        leftIcon={Images.key}
                        hideCloseIcon ={true}
                        secureTextEntry ={true}
                        returnKeyLabel ={"done"}
                        onSubmitEditing ={this.onPressLogin}
                    />

                    <PlaceHolder/>
                    {
                        !this.state.validPassword && [<TextError text={I18n.t("passwordNull")} style={{alignSelf:"flex-start"}}/>, <PlaceHolder/>]
                    }

                    <PlaceHolder height={10}/>

                    <TextBase>{I18n.t("signInWith")}</TextBase>

                    <PlaceHolder/>

                    <Button text={I18n.t("facebook")} textColor={Colors.black} customeBorder={true}
                            backgroundColor={Colors.transparent}/>

                    <PlaceHolder/>

                    <Button text={I18n.t("google")} textColor={Colors.black} customeBorder={true}
                            backgroundColor={Colors.transparent}/>

                    <PlaceHolder height={20}/>

                    <View style ={styles.containerTextLinks}>
                        <TextLink text={I18n.t("forgotPassword")} onPress ={this.onPressForgot} />
                        <View style ={{flex :1}}/>
                        <TextLink isRed={true} text={I18n.t("createAccount")}/>
                    </View>
                </ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    enabled
                >
                    <Button text={I18n.t("logIn")} fit={true} height={54} customeBorder={true} borderRadius={0} onPress={this.onPressLogin} />
                </KeyboardAvoidingView>


            </View>
        );
    }
    //endregion

//     onPressLogin = () => {
//         firebase.auth()
//             .verifyPhoneNumber("+841212515718")
//             .on('state_changed', (phoneAuthSnapshot) => {
//                 console.warn("state_changed:", phoneAuthSnapshot)
//                 // How you handle these state events is entirely up to your ui flow and whether
//                 // you need to support both ios and android. In short: not all of them need to
//                 // be handled - it's entirely up to you, your ui and supported platforms.
//
//                 // E.g you could handle android specific events only here, and let the rest fall back
//                 // to the optionalErrorCb or optionalCompleteCb functions
//                 switch (phoneAuthSnapshot.state) {
//                     // ------------------------
//                     //  IOS AND ANDROID EVENTS
//                     // ------------------------
//                     case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
//                         console.warn('code sent');
//                         // on ios this is the final phone auth state event you'd receive
//                         // so you'd then ask for user input of the code and build a credential from it
//                         // as demonstrated in the `signInWithPhoneNumber` example above
//
//                         break;
//                     case firebase.auth.PhoneAuthState.ERROR: // or 'error'
//                         console.warn('verification error');
//                         console.warn(phoneAuthSnapshot.error);
//                         break;
//
//                     // ---------------------
//                     // ANDROID ONLY EVENTS
//                     // ---------------------
//                     case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
//                         console.warn('auto verify on android timed out');
//                         // proceed with your manual code input flow, same as you would do in
//                         // CODE_SENT if you were on IOS
//                         break;
//                     case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
//                         // auto verified means the code has also been automatically confirmed as correct/received
//                         // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
//                         console.warn('auto verified on android');
//                         console.warn(phoneAuthSnapshot);
//                         // Example usage if handling here and not in optionalCompleteCb:
//                         // const { verificationId, code } = phoneAuthSnapshot;
//                         // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
//
//                         // Do something with your new credential, e.g.:
//                         // firebase.auth().signInWithCredential(credential);
//                         // firebase.auth().currentUser.linkWithCredential(credential);
//                         // etc ...
//                         break;
//                 }
//             }, (error) => {
//                 // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
//                 // the ERROR case in the above observer then there's no need to handle it here
//                 alert(error);
//                 // verificationId is attached to error if required
//                 // alert(error.verificationId);
//             }, (phoneAuthSnapshot) => {
//                 // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
//                 // depending on the platform. If you've already handled those cases in the observer then
//                 // there's absolutely no need to handle it here.
//
//                 // Platform specific logic:
//                 // - if this is on IOS then phoneAuthSnapshot.code will always be null
//                 // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
//                 //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
//                 // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
//                 //   continue with user input logic.
//                 console.warn(phoneAuthSnapshot);
//             });
// // optionally also supports .then & .catch instead of optionalErrorCb &
// // optionalCompleteCb (with the same resulting args)
//
//     }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
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
        paddingLeft: "$padding",
        paddingRight: "$padding"
    },

    containerTextLinks :{
        flexDirection:"row",
        width :"100%",
    }
});