
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
import {ScreenKey,ErrorCodes } from '../Constants';
import {Colors, Metrics, Images} from '../Themes';
import I18n from '../I18n';
import firebase from 'react-native-firebase';
import {Input, TextLink, TextBase, Button, PlaceHolder, TextError,ModalLoading} from "../Components/Common";
import * as _ from "lodash";

class LoginScreen extends PureComponent {

    //region cycle life

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            validEmail : true,
            passWord: "",
            validPassword : true,
            indexFocus : 0,
        };

        this.onPressForgot = this.onPressForgot.bind(this);
        this.onPressLogin = this.onPressLogin.bind(this);
        this.onPressSubmitEmail = this.onPressSubmitEmail.bind(this);
        this.onPressCreateAccount = this.onPressCreateAccount.bind(this);
        this.onPressListComponent = this.onPressListComponent.bind(this);

        this.onChangeEmailText = this.onChangeEmailText.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    componentDidMount() {}
    //endregion

    onFocus(index){
        this.setState({
            indexFocus: index
        });
    }

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

    onPressCreateAccount(){
        this.props.navigation.navigate(ScreenKey.CREATE_ACCOUNT)
    }

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
            this.refs["loading"].open();
            firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email,passWord).then(res =>{
              this.props.navigation.navigate(ScreenKey.PRAYING_INPROGESS);
            }).catch(err =>{
                switch (err.code){
                    case ErrorCodes.AUTH_USER_NOT_FOUND :{
                        alert(I18n.t("userNotFoundError"));
                        break;
                    }

                    case ErrorCodes.AUTH_INVALID_EMAIL :{
                        alert(I18n.t("emailInvalid"));
                        break;
                    }

                    case ErrorCodes.AUTH_USER_DISABLED :{
                        alert(I18n.t("userDisabled"));
                        break;
                    }

                    case ErrorCodes.AUTH_NETWORK_REQUEST_FAILED :{
                        alert(I18n.t("networkError"));
                        break;
                    }

                    case ErrorCodes.AUTH_WRONG_PASSWORD :{
                        alert(I18n.t("wrongPassword"));
                        break;
                    }

                    default :{
                        alert(I18n.t("unknowError"));
                        break
                    }
                }
            }).finally(() =>{
                this.refs["loading"].close();
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

    onPressListComponent(){
        this.props.navigation.navigate(ScreenKey.LIST_COMMON);
    }

    //endregion

    //region Rendering

    render() {
        const {indexFocus,email,validPassword,validEmail,passWord} = this.state;
        return (
            <View style={styles.container}>

                <ScrollView  style ={styles.scrollView} contentContainerStyle={[styles.body]}
                             keyboardShouldPersistTaps ={"handled"}
                >
                    <PlaceHolder height={100}/>
                    <Image source={Images.logo}/>
                    <PlaceHolder height={20}/>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : null}
                        enabled ={indexFocus === 0}
                    >
                    <Input
                        ref={"textInput"}
                        value={email}
                        placeholder={I18n.t("inputEmail")}
                        onChangeText={this.onChangeEmailText}
                        isShowShadow={true}
                        hideDivider={true}
                        customBorder={true}
                        leftIcon={Images.user}
                        hideCloseIcon ={true}
                        returnKeyLabel ={"next"}
                        onFocus={this.onFocus.bind(this,0)}
                        onSubmitEditing ={this.onPressSubmitEmail}
                        keyboardType ={"email-address"}
                    />
                    </KeyboardAvoidingView>

                    <PlaceHolder/>
                    {
                        !validEmail && [<TextError key={"TextError"} text={I18n.t("emailNull")} style={{alignSelf:"flex-start"}}/>, <PlaceHolder key={"place holder"}/>]
                    }
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : null}
                        enabled ={indexFocus === 1}
                    >

                    <Input
                        ref={"textInput2"}
                        value={passWord}
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
                        onFocus={this.onFocus.bind(this,1)}
                    />
                    </KeyboardAvoidingView>

                    <PlaceHolder/>
                    {
                        !validPassword && [<TextError text={I18n.t("passwordNull")} style={{alignSelf:"flex-start"}}/>, <PlaceHolder/>]
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
                        <TextLink isRed={true} text={I18n.t("createAccount")} onPress ={this.onPressCreateAccount} />
                    </View>
                    <TextLink text={I18n.t("listCommonComponent")} onPress ={this.onPressListComponent} />
                    <PlaceHolder height={20}/>
                </ScrollView>
                <ModalLoading
                    ref ="loading"
                />
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

}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,

    },

    scrollView :{
      flex :1,
    },

    body: {
        // flex: 1,
        alignItems: 'center',
        paddingLeft: "$padding",
        paddingRight: "$padding"
    },

    containerTextLinks :{
        flexDirection:"row",
        width :"100%",
    }
});