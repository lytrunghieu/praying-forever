import React, {PureComponent} from 'react';
import {Alert, Keyboard} from 'react-native';
import {IconName} from '../../../Themes/index';
import I18n from '../../../I18n/index';
import {ScreenKey} from "../../../Constants";
import {FormValidate, ButtonFooter, Header,Container,Content} from "../../../Components/Modules";
import {CommonUtils,firebaseAnalytics} from "../../../Utils";
import {StackActions} from "react-navigation";

import {style as styles} from "../Style";

export default class ForgotPassScreen extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            validEmail: true,
            isFocus: false

        };
        this.onPressBack = this.onPressBack.bind(this);
        this.onPressSend = this.onPressSend.bind(this);
        this.onChangeTextInput = this.onChangeTextInput.bind(this);
        this.onSendForgotEmailSuccess = this.onSendForgotEmailSuccess.bind(this);
        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack.bind(this)
        };
    }


    componentDidMount() {
        firebaseAnalytics("Forgot screen");
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.forgotPasswordReducer.success !== this.props.forgotPasswordReducer.success && nextProps.forgotPasswordReducer.success) {
            Alert.alert(I18n.t("alert"), I18n.t("checkForgotEmailContent"), [
                    {
                        text: I18n.t("ok"), onPress: this.onSendForgotEmailSuccess
                    }
                ],
                {cancelable: true}
            );
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.isFocus !== this.state.isFocus && nextState.isFocus) {
            this.setState({
                validEmail: true
            });
        }
    }

    //endregion

    //region handle value change

    onFocus = (focus) => () => {
        this.setState({
            isFocus: focus
        });
    }

    onChangeTextInput(value) {
        this.setState({
            email: value
        });
    }

    //endregion

    //region handle navbar

    onPressBack() {
        this.props.navigation.goBack();
    }

    //endregion

    //region hanlde action press

    onSendForgotEmailSuccess() {
        const resetAction = StackActions.replace({
            index: 0,
            routeName: ScreenKey.LOGIN_SCREEN,
        });
        this.props.navigation.dispatch(resetAction);
    }

    onPressSend() {
        if (!CommonUtils.validateEmail(this.state.email)) {
            this.setState({
                validEmail: false
            });
        }
        else {
            this.setState({
                validEmail: true
            });
            const {userActions} = this.props;
            Keyboard.dismiss();
            userActions.sendForgotPassword({email : this.state.email});
        }
    }

    //endregion

    //region RENDERING

    render() {
        const {validEmail,email} = this.state;
        const {forgotPasswordReducer} = this.props;
        const {fetching} = forgotPasswordReducer;

        return (
            [
                <Container>
                    <Header
                        title={I18n.t('resetPassword')}
                        left={this.leftHeader}
                        isFetching={fetching}
                    />
                    <Content>
                        <FormValidate
                            error={!validEmail}
                            errorText={I18n.t("emailInvalid")}
                            ref={"textInput"}
                            placeholder={I18n.t("inputEmail")}
                            onChangeText={this.onChangeTextInput}
                            onSubmitEditing={this.onPressSend}
                            keyboardType={"email-address"}
                            autoFocus={true}
                            onFocus={this.onFocus(true)}
                            onBlur={this.onFocus(false)}
                        />
                    </Content>
                    <ButtonFooter
                        onPress={this.onPressSend}
                        disabled={fetching || !email}
                        text={I18n.t("send")}
                    />
                </Container>,
            ]
        );
    }
    //endregion

}

