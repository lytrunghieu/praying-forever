import React, {PureComponent} from 'react';
import {
    View,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Images} from '../Themes';
import {CommonUtils} from '../Utils';
import I18n from '../I18n';
import firebase from 'react-native-firebase';
import {Input, TextError, Button, PlaceHolder, NavBar} from "../Components/Common";
import {ErrorCodes,ScreenKey} from "../Constants";

const inputKey = {
    EMAIL: {name: "email", index: 0},
    PASSWORD: {name: "password", index: 1},
    RETYPE_PASSWORD: {name: "retypePassword", index: 2},
    FIRSTNAME: {name: "firstName", index: 3},
    LASTNAME: {name: "lastName", index: 4}
}

class CreateAccountContainer extends PureComponent {

    //region cycle life

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            retypePassword: "",
            firstName: "",
            lastName: "",
            gender: 0,
            indexFocus: 0,

            validEmail: true,
            validPassword: true,
            validRetypePassword: true,
            validMatchPassword: true,
            validFirstName: true,
            validLastName: true,

        };
        this.onPressBack = this.onPressBack.bind(this);
        this.onPressCreate = this.onPressCreate.bind(this);
        this.onChangeTextInput = this.onChangeTextInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
    }

    //endregion

    //region handle value change

    onChangeTextInput(key, value) {
        this.setState({
            [key]: value
        });
    }

    onFocus(index) {
        if (index < inputKey.LASTNAME.index) {
            this.setState({
                indexFocus: index
            });
        }
    }

    onSubmit() {
        const {indexFocus} = this.state;

        if (indexFocus < inputKey.LASTNAME.index) {
            let ref = "textInput".concat(indexFocus+2);
            console.log("ref :",ref);
            this.refs[ref].focus();
        }
    }

    //endregion

    //region handle navbar

    onPressBack() {
        this.props.navigation.goBack();
    }

    //endregion

    //region hanlde action press

    onPressCreate() {

        const {email,password,retypePassword,firstName,lastName,gender}  = this.state;

        let valid = {
            validEmail : true,
            validPassword:true,
            validRetypePassword: true,
            validFirstName: true,
            validLastName: true,
            validMatchPassword: true
        };

        if(!CommonUtils.validateEmail(email)){
            valid.validEmail = false;
        }

        if(!CommonUtils.validatePassword(password)){
            valid.validPassword = false;
        }

        if(!CommonUtils.validatePassword(retypePassword)){
            valid.validRetypePassword = false;
        }

        if(valid.validPassword && valid.validRetypePassword && password !== retypePassword){
            valid.validMatchPassword = false;
        }
        //
        // if(_.isEmpty(firstName)){
        //     valid.validFirstName = false;
        // }
        //
        // if(_.isEmpty(lastName)){
        //     valid.validLastName = false;
        // }

        if(valid.validEmail && valid.validMatchPassword){
            firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email,password).then(res => {
                this.props.navigation.navigate(ScreenKey.DRAWER_NAV);
            }).catch(err => {
                switch (err.code) {
                    case ErrorCodes.AUTH_USER_NOT_FOUND : {
                        alert(I18n.t("userNotFoundError"));
                        break;
                    }

                    case ErrorCodes.AUTH_INVALID_EMAIL : {
                        alert(I18n.t("emailInvalid"));
                        break;
                    }

                    case ErrorCodes.AUTH_NETWORK_REQUEST_FAILED : {
                        alert(I18n.t("networkError"));
                        break;
                    }

                    case ErrorCodes.AUTH_EMAIL_ALREADY_IN_USE :{
                        alert(I18n.t("emailAlreadyUse"));
                        break;
                    }

                    default : {
                        alert(I18n.t("unknowError"));
                        break
                    }
                }
            })
        }
        this.setState(valid)
    }

    //endregion

    //region Rendering

    render() {
        const {email, password, retypePassword, firstName, lastName, gender, validEmail, validPassword, validFirstName, validLastName, validMatchPassword, validRetypePassword} = this.state;
        return (
            <View style={styles.container}>
                <NavBar title={I18n.t("createAccountTitle")} iconLeft={Images.back}
                        onPressLeftButton={this.onPressBack}/>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.body]}>
                    <PlaceHolder height={10}/>
                    <Input
                        ref={"textInput1"}
                        value={email}
                        placeholder={I18n.t("inputEmail")}
                        onChangeText={this.onChangeTextInput.bind(this, inputKey.EMAIL.name)}
                        isShowShadow={true}
                        hideDivider={true}
                        customBorder={true}
                        leftIcon={Images.user}
                        autoFocus={true}
                        hideCloseIcon={true}
                        onSubmitEditing={this.onSubmit}
                        onFocus={this.onFocus.bind(this, inputKey.EMAIL.index)}
                        keyboardType ={"email-address"}
                    />
                    <PlaceHolder height={10}/>
                    {!validEmail && <TextError text={I18n.t("emailInvalid")}/> || null}
                    <PlaceHolder height={10}/>
                    <Input
                        ref={"textInput2"}
                        value={password}
                        placeholder={I18n.t("inputPassword")}
                        onChangeText={this.onChangeTextInput.bind(this, inputKey.PASSWORD.name)}
                        isShowShadow={true}
                        hideDivider={true}
                        customBorder={true}
                        leftIcon={Images.user}
                        hideCloseIcon={true}
                        onSubmitEditing={this.onSubmit}
                        secureTextEntry ={true}
                        onFocus={this.onFocus.bind(this, inputKey.PASSWORD.index)}
                    />
                    <PlaceHolder height={10}/>
                    {!validPassword && <TextError text={I18n.t("passwordInvalid")}/> || null}
                    <PlaceHolder height={10}/>
                    <Input
                        ref={"textInput3"}
                        value={retypePassword}
                        placeholder={I18n.t("inputRetypePassword")}
                        onChangeText={this.onChangeTextInput.bind(this, inputKey.RETYPE_PASSWORD.name)}
                        isShowShadow={true}
                        hideDivider={true}
                        customBorder={true}
                        leftIcon={Images.user}
                        hideCloseIcon={true}
                        onSubmitEditing={this.onPressCreate}
                        secureTextEntry ={true}
                        onFocus={this.onFocus.bind(this, inputKey.RETYPE_PASSWORD.index)}
                    />
                    <PlaceHolder height={10}/>
                    {!validRetypePassword && <TextError text={I18n.t("passwordInvalid")}/> || null}
                    {!validMatchPassword && <TextError text={I18n.t("retypePasswordNotMatch")}/> || null}
                    <PlaceHolder height={20}/>

                </ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    enabled
                >
                    <Button text={I18n.t("create")} onPress={this.onPressCreate} fit={true} height={54}
                            customeBorder={true} borderRadius={0}/>

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

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountContainer);

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    scrollView: {
        flex: 1,
    },

    body: {
        paddingLeft: "$padding",
        paddingRight: "$padding"
    },
});