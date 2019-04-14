import React, {PureComponent} from 'react';
import {
    Image,
    Alert,
    Keyboard,
    Linking,
    Platform
} from 'react-native';
import {ScreenKey} from '../../../Constants';
import { Images} from '../../../Themes/index';
import I18n from '../../../I18n/index';
import {
    TextLink,
    PlaceHolder,
    ImageBackground,
} from "../../../Components/Common";
import {StackActions} from "react-navigation";
import {Content, Container, FormValidate, ButtonFooter, LoadingIndicator} from "../../../Components/Modules";
import {Left, Body} from "native-base";
import {style as styles} from "../Style";
import {CommonUtils, firebaseAnalytics} from "../../../Utils";
import * as _ from "lodash";
import MailModule from '../../../modules/mail-module';

export default class LoginScreen extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            validEmail: true,
            password: "",
            validPassword: true,
            indexFocus: 0,
            isFetching: false,
        };

        this.onPressForgot = this.onPressForgot.bind(this);
        this.onPressLogin = this.onPressLogin.bind(this);
        this.onPressSubmitEmail = this.onPressSubmitEmail.bind(this);
        this.onPressCreateAccount = this.onPressCreateAccount.bind(this);
        this.onPressListComponent = this.onPressListComponent.bind(this);
        this.onPressResendEmail = this.onPressResendEmail.bind(this);
        this.onPressGoInboxMail = this.onPressGoInboxMail.bind(this);
        this.onPressSupport = this.onPressSupport.bind(this);

        this.onChangeEmailText = this.onChangeEmailText.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    componentDidMount() {
        firebaseAnalytics("Login Screen");
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.indexFocus !== this.state.indexFocus) {
            switch (nextState.indexFocus) {
                case 0 : {
                    this.setState({
                        validEmail: true
                    });
                    break;
                }

                case 1 : {
                    this.setState({
                        validPassword: true
                    });
                    break;
                }
            }
        }
        if (nextProps.loginReducer.statusCode !== this.props.loginReducer.statusCode && nextProps.loginReducer.statusCode) {
            if (nextProps.loginReducer.statusCode === 402) {
                Alert.alert(I18n.t("alert"), nextProps.loginReducer.message,
                    [
                        {text: I18n.t("close")},
                        {text: I18n.t("resendVerifyEmail"), onPress: this.onPressResendEmail}
                    ],
                    {cancelable: true}
                )
            }
            else {
                if (nextProps.loginReducer.statusCode === 403) {
                    Alert.alert(I18n.t("alert"), nextProps.loginReducer.message,
                        [
                            {text: I18n.t("close")},
                            {text: I18n.t("support").toUpperCase(), onPress: this.onPressSupport}
                        ],
                        {cancelable: true}
                    )
                }
                else{
                    Alert.alert(I18n.t("alert"), nextProps.loginReducer.message,
                        [
                            {text: I18n.t("close")},
                        ],
                        {cancelable: true}
                    )
                }
            }
        }
    }

    //endregion

    onFocus(index) {
        this.setState({
            indexFocus: index
        });
    }

    //region handle value change

    onChangeEmailText(value) {
        this.setState({
            email: value,
            validEmail: true
        });
    }

    onChangePassword(value) {
        this.setState({
            password: value,
            validPassword: true
        });
    }

    //endregion

    //region handle action press

    onPressResendEmail() {
        const {userActions} = this.props;
        userActions.resendVerifyEmail().then(res => {
            if (res.success) {
                Alert.alert(I18n.t("alert"), I18n.t("resendVerifyEmailSuccess"),
                    [
                        {text: I18n.t("close")},
                        {text: I18n.t("goInbox"), onPress: this.onPressGoInboxMail}
                    ],
                    {cancelable: true}
                )
            }
        });
    }

    onPressSupport() {
        CommonUtils.sendEmail();
    }

    onPressGoInboxMail(){
        if (Platform.OS === "ios") {
            Linking.canOpenURL("message://").then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: message://');
                } else {
                    return  Linking.openURL('message://').catch(err => console.error('An error occurred', err));
                }
            }).catch(err => console.error('An error occurred', err));

        } else {
            MailModule.showMailBox();
        }
    }

    onPressCreateAccount() {
        this.props.navigation.navigate(ScreenKey.CREATE_ACCOUNT);
    }

    onPressLogin() {
        const {email, password} = this.state;
        const {userActions} = this.props;
        let valid = {validPassword: true, validEmail: true};
        if (!CommonUtils.validateEmail(email)) {
            valid.validEmail = false;
        }
        if (_.isEmpty(password)) {
            valid.validPassword = false;
        }
        if (valid.validPassword && valid.validEmail) {
            Keyboard.dismiss();
            userActions.login({email, password}).then(res =>{
                if(res.success){
                    const resetAction = StackActions.replace({
                        index: 0,
                        routeName: ScreenKey.DRAWER_NAV,
                        params:{fromLogin : true}
                    });
                    this.props.navigation.dispatch(resetAction);
                }
            });
        }
        this.setState(valid);
    }

    onPressSubmitEmail() {
        this.refs["textInput2"].focus();
    }

    onPressForgot() {
        this.props.navigation.navigate(ScreenKey.FORGOT_PASS);
    }

    onPressListComponent() {
        this.props.navigation.navigate(ScreenKey.LIST_COMMON);
    }

    //endregion

    //region RENDERING

    render() {
        const {validEmail, validPassword, email, password} = this.state;
        const {loginReducer} = this.props;
        const {fetching} = loginReducer;

        return (
            [
                <ImageBackground/>,
                <Container style={styles.container}>
                    <LoadingIndicator visible={fetching}/>
                    <Content style={styles.content}>
                        <Body>
                        <PlaceHolder height={100}/>
                        <Image source={Images.logo}/>
                        <PlaceHolder height={20}/>
                        </Body>
                        <FormValidate
                            error={!validEmail}
                            errorText={I18n.t("emailInvalid")}
                            ref={"textInput"}
                            placeholder={I18n.t("inputEmail")}
                            onChangeText={this.onChangeEmailText}
                            customBorder={true}
                            returnKeyLabel={"next"}
                            onFocus={this.onFocus.bind(this, 0)}
                            onSubmitEditing={this.onPressSubmitEmail}
                            keyboardType={"email-address"}
                        />

                        <FormValidate
                            error={!validPassword}
                            ref={"textInput2"}
                            errorText={I18n.t("passwordNull")}
                            placeholder={I18n.t("inputPassword")}
                            onChangeText={this.onChangePassword}
                            leftIcon={Images.key}
                            secureTextEntry={true}
                            returnKeyLabel={"done"}
                            onSubmitEditing={this.onPressLogin}
                            onFocus={this.onFocus.bind(this, 1)}
                        />
                        <Left style={styles.containerTextLinks}>
                            <TextLink text={I18n.t("forgotPassword")} onPress={this.onPressForgot}/>
                        </Left>
                        <Left style={styles.containerTextLinks}>
                            <TextLink text={I18n.t("createAccount")} onPress={this.onPressCreateAccount}/>
                        </Left>
                    </Content>
                    <ButtonFooter
                        onPress={this.onPressLogin}
                        disabled={fetching || !email || !password} text={I18n.t("logIn").toUpperCase()}
                    />
                </Container>
            ]
        );

    }

    //endregion
}


