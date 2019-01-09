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
import I18n from '../I18n';
import firebase from 'react-native-firebase';
import {Input, TextLink, TextError, Button, PlaceHolder, NavBar} from "../Components/Common";
import * as _ from "lodash";
import {ErrorCodes} from "../Constants";

import {FormValidate, ButtonFooter, Header} from "../Components/Modules";

import {Container, Content, Item, Body, Footer, Left, Label} from 'native-base';

import {CommonUtils} from "../Utils";

class ForgotPassScreen extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            isFetching: false,
            validEmail: true,
            isFocus: false

        };
        this.onPressBack = this.onPressBack.bind(this);
        this.onPressSend = this.onPressSend.bind(this);
        this.onChangeTextInput = this.onChangeTextInput.bind(this);

        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack.bind(this)
        };
    }

    componentDidMount() {
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

    onPressSend() {
        if (!CommonUtils.validateEmail(this.state.email)) {
            this.setState({
                validEmail: false
            });
        }
        else {
            this.setState({
                isFetching: true,
                validEmail: true
            });
            firebase.auth().sendPasswordResetEmail(this.state.email).then(res => {
                alert(I18n.t("checkResetPasswordEmail"));
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

                    default : {
                        alert(I18n.t("unknowError"));
                        break
                    }
                }
            }).finally(e => {
                this.setState({
                    isFetching: false
                });
            })
        }
    }

    //endregion

    //region RENDERING

    render() {
        const {isFetching, validEmail} = this.state;

        return (
            [

                <Container style={styles.container}>
                    <Header
                        title={I18n.t('resetPassword')}
                        left={this.leftHeader}
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
                        disabled={isFetching}
                        text={I18n.t("send")}
                    />


                </Container>,
            ]


        );

        return (
            <View style={styles.container}>
                <NavBar title={I18n.t("resetPassword")} iconLeft={Images.back} onPressLeftButton={this.onPressBack}/>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.body]}>
                    <PlaceHolder height={10}/>
                    <Input
                        ref={"textInput"}
                        value={this.state.email}
                        placeholder={I18n.t("inputEmail")}
                        onChangeText={this.onChangeTextInput}
                        isShowShadow={true}
                        hideDivider={true}
                        customBorder={true}
                        leftIcon={Images.user}
                        autoFocus={true}
                        hideCloseIcon={true}
                    />
                    <PlaceHolder height={10}/>
                    {!this.state.validEmail && <TextError text={I18n.t("emailNull")}/> || null}
                    <PlaceHolder height={20}/>
                    {this.state.isFetching &&
                    <TextLink text={I18n.t("sendAgain")} style={{alignSelf: "center"}}
                              onPress={this.onPressSend}/> || null
                    }
                    <PlaceHolder height={600}/>

                </ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    enabled
                >
                    {
                        !this.state.isFetching &&
                        <Button text={I18n.t("send")} onPress={this.onPressSend} fit={true} height={54}
                                customeBorder={true} borderRadius={0}/>
                        || null
                    }

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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassScreen);

const styles = EStyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
    },

    content :{
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