import React, {PureComponent} from 'react';
import {Alert} from 'react-native';
import {IconName} from '../../../Themes/index';
import I18n from '../../../I18n/index';
import {ScreenKey} from "../../../Constants";
import {NavigationActions} from "react-navigation";

import {FormValidate, ButtonFooter, Header} from "../../../Components/Modules/index";

import {Container, Content} from 'native-base';

import {CommonUtils} from "../../../Utils/index";

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

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.forgotPasswordReducer.success !== this.props.forgotPasswordReducer.success && nextProps.forgotPasswordReducer.success) {
            Alert.alert(I18n.t("checkForgotEmailTitle"), I18n.t("checkForgotEmailContent"), [
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
        this.props.navigation.dispatch({type: NavigationActions.RESET, routeName: ScreenKey.LOGIN_SCREEN});
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
            userActions.sendForgotPassword({email : this.state.email});
        }
    }

    //endregion

    //region RENDERING

    render() {
        const {validEmail} = this.state;
        const {forgotPasswordReducer} = this.props;
        const {fetching} = forgotPasswordReducer;

        return (
            [

                <Container style={styles.container}>
                    <Header
                        title={I18n.t('resetPassword')}
                        left={this.leftHeader}
                        isFetching={fetching}
                    />
                    <Content style={styles.content}>
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
                        disabled={fetching}
                        text={I18n.t("send")}
                    />


                </Container>,
            ]


        );
    }

    //endregion

}

