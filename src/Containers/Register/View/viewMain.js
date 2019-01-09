import React, {PureComponent} from 'react';
import {
    View,
    Alert,
} from 'react-native';
import {Colors, Images, IconName} from '../../../Themes/index';
import {CommonUtils} from '../../../Utils/index';
import I18n from '../../../I18n/index';
import {
    Button,
    Icon,
    Checkbox,
    DatePicker,
    TextBase
} from "../../../Components/Common";
import {Header, FormValidate, ButtonFooter} from "../../../Components/Modules/index";
import {Container, Content, CardItem} from 'native-base';
import {NavigationActions} from "react-navigation";
import {ScreenKey} from "../../../Constants";

const inputKey = {
    EMAIL: {name: "email", index: 2},
    PASSWORD: {name: "password", index: 3},
    RETYPE_PASSWORD: {name: "retypePassword", index: 4},
    FIRSTNAME: {name: "firstName", index: 0},
    LASTNAME: {name: "lastName", index: 1}
}

import {style as styles} from "../Style";

export default class CreateAccount extends PureComponent {

    //region CYCLE LIFE

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
            isMale: true,
            birthDay: new Date(),
            indexStep: 0

        };
        this.onPressBack = this.onPressBack.bind(this);
        this.onPressCreate = this.onPressCreate.bind(this);
        this.onChangeTextInput = this.onChangeTextInput.bind(this);
        this.onChangeBD = this.onChangeBD.bind(this);
        this.onPressGender = this.onPressGender.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSignupSuccess = this.onSignupSuccess.bind(this);
        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack
        };

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.registerReducer.success !== this.props.registerReducer.success && nextProps.registerReducer.success) {
            Alert.alert(I18n.t("checkEmailTitle"), I18n.t("checkEmailContent"), [
                    {
                        text: I18n.t("ok"), onPress: this.onSignupSuccess
                    }
                ],
                {cancelable: true}
            );
        }
    }

    componentDidUpdate(preProps, preState) {
        if (preState.indexStep !== this.state.indexStep) {
            if (preState.indexStep === 0) {
                let ref = "textInput".concat(inputKey.EMAIL.index + 1);
                this.refs[ref].focus();
            }
            else {
                let ref = "textInput".concat(inputKey.FIRSTNAME.index + 1);
                this.refs[ref].focus();
            }
        }
    }

    //endregion

    //region handle value change

    onChangeBD(newDate) {
        this.setState({birthDay: newDate});
    }

    onChangeTextInput(key, value) {

        let newState = {[key]: value};

        switch (key) {
            case inputKey.FIRSTNAME.name : {
                newState.validFirstName = true;
                break;
            }

            case inputKey.LASTNAME.name : {
                newState.validLastName = true;
                break;
            }

            case inputKey.EMAIL.name : {
                newState.validEmail = true;
                break;
            }

            case inputKey.PASSWORD.name : {
                newState.validPassword = true;
                break;
            }

            case inputKey.RETYPE_PASSWORD.name : {
                newState.validRetypePassword = true;
                break;
            }
        }

        this.setState(newState);
    }

    onFocus(index) {
        let newState = {indexFocus: index};
        switch (index) {
            case inputKey.FIRSTNAME.index : {
                newState.validFirstName = true;
                break;
            }

            case inputKey.LASTNAME.index : {
                newState.validLastName = true;
                break;
            }

            case inputKey.EMAIL.index : {
                newState.validEmail = true;
                break;
            }

            case inputKey.PASSWORD.index : {
                newState.validPassword = true;
                break;
            }

            case inputKey.RETYPE_PASSWORD.index : {
                newState.validRetypePassword = true;
                break;
            }
        }
        this.setState(newState);
    }

    onSubmit = (index) => () => {
        if (index < inputKey.RETYPE_PASSWORD.index) {
            if (index === inputKey.LASTNAME.index) {
                this.onPressStep(1)();
            }
            else {
                let ref = "textInput".concat(index + 2);
                this.refs[ref].focus();
            }
        }
        else {
            this.onPressCreate();
        }
    }

    //endregion

    //region handle navbar

    onPressBack() {
        this.props.navigation.goBack();
    }

    //endregion

    //region hanlde action press

    onSignupSuccess() {
        this.props.navigation.dispatch({type: NavigationActions.RESET, routeName: ScreenKey.LOGIN_SCREEN});
    }

    onPressGender() {
        this.setState({
            isMale: !this.state.isMale
        });
    }

    onPressStep = (index) => () => {
        if (index === 1) {
            const {firstName, lastName} = this.state;

            let valid = {
                validFirstName: true,
                validLastName: true,
            };

            if (_.isEmpty(firstName)) {
                valid.validFirstName = false;
            }

            if (_.isEmpty(lastName)) {
                valid.validLastName = false;
            }
            this.setState(valid)

            if (!valid.validLastName || !valid.validFirstName) {
                return;
            }
        }
        this.setState({
            indexStep: index
        });
    }

    onPressCreate() {

        const {email, password, retypePassword, firstName, lastName, gender, birthDay} = this.state;
        const {userActions} = this.props;

        let valid = {
            validEmail: true,
            validPassword: true,
            validRetypePassword: true,
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

        if (valid.validPassword && valid.validRetypePassword && password != retypePassword) {
            valid.validMatchPassword = false;
        }

        if (valid.validEmail && valid.validMatchPassword) {
            userActions.register({email, password, firstName, lastName, gender, birthDay});
        }
        this.setState(valid)
    }

    //endregion

    //region RENDERING


    renderStep() {
        const {email, password, retypePassword, firstName, lastName, gender, validEmail, isFetching, isMale, validPassword, validFirstName, validLastName, validMatchPassword, validRetypePassword, indexStep} = this.state;

        switch (indexStep) {
            case 0 : {
                return (<View style={[styles.form]}>
                    <FormValidate
                        autoFocus={true}
                        value={firstName}
                        error={!validFirstName}
                        errorText={I18n.t("firstNameNull")}
                        ref={"textInput1"}
                        placeholder={I18n.t("inputFirstName")}
                        onChangeText={this.onChangeTextInput.bind(this, inputKey.FIRSTNAME.name)}

                        customBorder={true}
                        returnKeyLabel={"next"}
                        onFocus={this.onFocus.bind(this, inputKey.FIRSTNAME.index)}

                        onSubmitEditing={this.onSubmit(inputKey.FIRSTNAME.index)}
                    />

                    <FormValidate
                        value={lastName}
                        error={!validLastName}
                        errorText={I18n.t("lastNameNull")}
                        ref={"textInput2"}
                        placeholder={I18n.t("inputLastName")}
                        onChangeText={this.onChangeTextInput.bind(this, inputKey.LASTNAME.name)}

                        customBorder={true}
                        returnKeyLabel={"next"}
                        onFocus={this.onFocus.bind(this, inputKey.LASTNAME.index)}

                        onSubmitEditing={this.onSubmit(inputKey.LASTNAME.index)}

                    />

                    <Checkbox text={I18n.t("male")} onPress={this.onPressGender} checked={isMale}/>
                    <DatePicker label={I18n.t("birthDay")} setDate={this.onChangeBD}/>


                    <CardItem>
                        <Button
                            rounded
                            small
                            style={styles.buttonNext}
                            onPress={this.onSubmit(inputKey.LASTNAME.index)}

                        >
                            <TextBase bold={true} highlight={true}>{I18n.t("next").toUpperCase()}</TextBase>
                            <Icon dark={false} name={IconName.next}/>
                        </Button>
                    </CardItem>


                </View>);
            }

            case 1 : {
                return (
                    <View style={[styles.form]}>
                        <FormValidate
                            autoFocus={true}
                            error={!validEmail}
                            errorText={I18n.t("emailInvalid")}
                            ref={"textInput3"}
                            value={email}
                            placeholder={I18n.t("inputEmail")}
                            onChangeText={this.onChangeTextInput.bind(this, inputKey.EMAIL.name)}

                            customBorder={true}
                            returnKeyLabel={"next"}
                            onFocus={this.onFocus.bind(this, inputKey.EMAIL.index)}

                            onSubmitEditing={this.onSubmit(inputKey.EMAIL.index)}

                            keyboardType={"email-address"}
                        />


                        <FormValidate
                            error={!validPassword}
                            value={password}
                            ref={"textInput4"}
                            errorText={I18n.t("passwordInvalid")}
                            placeholder={I18n.t("inputPassword")}
                            onChangeText={this.onChangeTextInput.bind(this, inputKey.PASSWORD.name)}
                            secureTextEntry={true}
                            returnKeyLabel={"next"}
                            onSubmitEditing={this.onSubmit(inputKey.PASSWORD.index)}
                            onFocus={this.onFocus.bind(this, inputKey.PASSWORD.index)}
                        />


                        <FormValidate
                            error={!validRetypePassword || !validMatchPassword}
                            ref={"textInput5"}
                            errorText={!validMatchPassword ? I18n.t("retypePasswordNotMatch") : I18n.t("passwordInvalid")}
                            placeholder={I18n.t("inputRetypePassword")}
                            onChangeText={this.onChangeTextInput.bind(this, inputKey.RETYPE_PASSWORD.name)}
                            value={retypePassword}
                            secureTextEntry={true}
                            returnKeyLabel={"next"}
                            // onSubmitEditing={this.onPressCreate}
                            onSubmitEditing={this.onSubmit(inputKey.RETYPE_PASSWORD.index)}
                            onFocus={this.onFocus.bind(this, inputKey.RETYPE_PASSWORD.index)}
                        />
                        <CardItem>
                            <Button

                                style={styles.buttonBack}
                                rounded small iconLeft onPress={this.onPressStep(0)}
                            >
                                <Icon dark={false} name={IconName.previous}/>
                                <TextBase bold={true} highlight={true}>{I18n.t("back").toUpperCase()}</TextBase>
                            </Button>
                        </CardItem>

                    </View>
                );
            }
        }
    }

    render() {
        const {indexStep} = this.state;
        const {registerReducer} = this.props;
        const {fetching} = registerReducer;

        return (
            <Container style={styles.container} pointerEvents={fetching ? "none" : "auto"}>
                <Header
                    title={I18n.t("createAccountTitle")}
                    left={this.leftHeader}
                    isFetching={fetching}
                />
                <Content style={styles.content}>
                    {this.renderStep()}
                </Content>

                {
                    indexStep === 1 ?
                        <ButtonFooter
                            onPress={this.onPressCreate}
                            disabled={fetching} text={I18n.t("create")}
                        />
                        : null
                }


            </Container>
        );
    }

    //endregion

}
