import React, {PureComponent} from 'react';
import {
    View,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Images, IconName} from '../Themes';
import {CommonUtils} from '../Utils';
import I18n from '../I18n';
import firebase from 'react-native-firebase';
import {Input, TextError, Button, PlaceHolder, NavBar, ModalLoading, Checkbox, DatePicker} from "../Components/Common";
import {Header, FormValidate, ButtonFooter} from "../Components/Modules";
import {ErrorCodes, ScreenKey} from "../Constants";
import moment from "moment";


import {Container, Content, Item, Body, Footer, Left, Label} from 'native-base';


const inputKey = {
    EMAIL: {name: "email", index: 2},
    PASSWORD: {name: "password", index: 3},
    RETYPE_PASSWORD: {name: "retypePassword", index: 4},
    FIRSTNAME: {name: "firstName", index: 0},
    LASTNAME: {name: "lastName", index: 1}
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
            isMale : true,
            birthDay: new Date()

        };
        this.onPressBack = this.onPressBack.bind(this);
        this.onPressCreate = this.onPressCreate.bind(this);
        this.onChangeTextInput = this.onChangeTextInput.bind(this);
        this.onChangeBD= this.onChangeBD.bind(this);
        this.onPressGender = this.onPressGender.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack
        };
    }

    componentDidMount() {
    }

    //endregion

    //region handle value change

    onChangeBD(newDate){
        this.setState({birthDay: newDate});
    }

    onChangeTextInput(key, value) {
        this.setState({
            [key]: value
        });
    }

    onFocus(index) {
        if (index < inputKey.RETYPE_PASSWORD.index) {
            this.setState({
                indexFocus: index
            });
        }
    }

    onSubmit() {
        const {indexFocus} = this.state;

        if (indexFocus < inputKey.RETYPE_PASSWORD.index) {
            let ref = "textInput".concat(indexFocus + 2);
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

    onPressGender(){
        this.setState({
           isMale: !this.state.isMale
        });
    }

    onPressCreate() {

        const {email, password, retypePassword, firstName, lastName, gender} = this.state;

        let valid = {
            validEmail: true,
            validPassword: true,
            validRetypePassword: true,
            validFirstName: true,
            validLastName: true,
            validMatchPassword: true
        };

        if (!CommonUtils.validateEmail(email)) {
            valid.validEmail = false;
        }

        if (!CommonUtils.validatePassword(password)) {
            valid.validPassword = false;
        }

        if (!CommonUtils.validatePassword(retypePassword)) {
            valid.validRetypePassword = false;
        }


        console.log("password != retypePassword ", password != retypePassword);

        if (valid.validPassword && valid.validRetypePassword && password != retypePassword) {
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

        if (valid.validEmail && valid.validMatchPassword) {
            this.setState({
                isFetching: true
            });

            firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password).then(res => {
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

                    case ErrorCodes.AUTH_EMAIL_ALREADY_IN_USE : {
                        alert(I18n.t("emailAlreadyUse"));
                        break;
                    }

                    default : {
                        alert(I18n.t("unknowError"));
                        break
                    }
                }
            }).finally(e => {
                this.setState({
                    isFetching: false
                })
            })
        }
        this.setState(valid)
    }

    //endregion

    //region Rendering

    render() {
        const {email, password, retypePassword, firstName, lastName, gender, validEmail, isFetching,isMale, validPassword, validFirstName, validLastName, validMatchPassword, validRetypePassword} = this.state;


        return (
            [<Container style={styles.container}>
                <Header
                    title={I18n.t("createAccountTitle")}
                    left={this.leftHeader}
                />
                <Content style={styles.content}>

                    <FormValidate
                        autoFocus={true}
                        error={!validFirstName}
                        errorText={I18n.t("firstNameNull")}
                        ref={"textInput1"}
                        placeholder={I18n.t("inputFirstName")}
                        onChangeText={this.onChangeTextInput.bind(this, inputKey.FIRSTNAME.name)}

                        customBorder={true}
                        returnKeyLabel={"next"}
                        onFocus={this.onFocus.bind(this, inputKey.FIRSTNAME.index)}

                        onSubmitEditing={this.onSubmit}
                    />

                    <FormValidate
                        error={!validLastName}
                        errorText={I18n.t("lastNameNull")}
                        ref={"textInput2"}
                        placeholder={I18n.t("inputLastName")}
                        onChangeText={this.onChangeTextInput.bind(this, inputKey.LASTNAME.name)}

                        customBorder={true}
                        returnKeyLabel={"next"}
                        onFocus={this.onFocus.bind(this, inputKey.LASTNAME.index)}

                        onSubmitEditing={this.onSubmit}

                    />

                    <Checkbox text={I18n.t("male")} onPress={this.onPressGender} checked={isMale}/>
                    <DatePicker label={I18n.t("birthDay")} setDate={this.onChangeBD}/>


                    <FormValidate
                        error={!validEmail}
                        errorText={I18n.t("emailInvalid")}
                        ref={"textInput3"}
                        placeholder={I18n.t("inputEmail")}
                        onChangeText={this.onChangeTextInput.bind(this, inputKey.EMAIL.name)}

                        customBorder={true}
                        returnKeyLabel={"next"}
                        onFocus={this.onFocus.bind(this, inputKey.EMAIL.index)}

                        onSubmitEditing={this.onSubmit}

                        keyboardType={"email-address"}
                    />


                    <FormValidate
                        error={!validPassword}
                        ref={"textInput4"}
                        errorText={I18n.t("passwordInvalid")}
                        placeholder={I18n.t("inputPassword")}
                        onChangeText={this.onChangeTextInput.bind(this, inputKey.PASSWORD.name)}
                        secureTextEntry={true}
                        returnKeyLabel={"next"}
                        onSubmitEditing={this.onSubmit}
                        onFocus={this.onFocus.bind(this, inputKey.PASSWORD.index)}
                    />


                    <FormValidate
                        error={!validRetypePassword || !validMatchPassword}
                        ref={"textInput5"}
                        errorText={!validMatchPassword ? I18n.t("retypePasswordNotMatch") : I18n.t("passwordInvalid")}
                        placeholder={I18n.t("inputRetypePassword")}
                        onChangeText={this.onChangeTextInput.bind(this, inputKey.RETYPE_PASSWORD.name)}

                        secureTextEntry={true}
                        returnKeyLabel={"next"}
                        onSubmitEditing={this.onPressCreate}
                        onFocus={this.onFocus.bind(this, inputKey.RETYPE_PASSWORD.index)}
                    />





                </Content>

                <ButtonFooter
                    onPress={this.onPressCreate}
                    disabled={isFetching} text={I18n.t("create")}
                />


            </Container>,
                <ModalLoading
                    ref="loading"
                />
            ]
        );

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
                        keyboardType={"email-address"}
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
                        secureTextEntry={true}
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
                        secureTextEntry={true}
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
        backgroundColor: Colors.primary,
    },

    content: {
        paddingRight: "$padding"
    },

    scrollView: {
        flex: 1,
    },

    body: {
        paddingLeft: "$padding",
        paddingRight: "$padding"
    },
});