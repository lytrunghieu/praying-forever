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
import {Input, TextLink, TextError, Button, PlaceHolder, NavBar} from "../Components/Common";
import * as _ from "lodash";

class ForgotPassScreen extends PureComponent {

    //region cycle life

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            isSend: false,
            validEmail: true,
        };
        this.onPressBack = this.onPressBack.bind(this);
        this.onPressSend = this.onPressSend.bind(this);
        this.onChangeTextInput = this.onChangeTextInput.bind(this);
    }

    componentDidMount() {
    }


    //endregion

    onChangeTextInput(value) {
        this.setState({
            email: value
        });
    }

    onPressBack() {
        this.props.navigation.goBack();
    }

    onPressSend() {
        if (_.isEmpty(this.state.email)) {
            this.setState({
                validEmail: false
            });
        }
        else {
            this.setState({
                isSend: true,
                validEmail: true
            });
        }


    }


    //region Rendering

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={I18n.t("resetPassword")} iconLeft={Images.back} onPressLeftButton={this.onPressBack}/>
                <ScrollView contentContainerStyle={[styles.body]}>
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
                    />
                    <PlaceHolder height={10}/>
                    {!this.state.validEmail && <TextError text={I18n.t("emailNull")}/> || null}
                    <PlaceHolder height={20}/>
                    {this.state.isSend &&
                    <TextLink text={I18n.t("sendAgain")} style={{alignSelf:"center"}} onPress={this.onPressSend}/> || null
                    }

                </ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    enabled
                >
                    {
                        !this.state.isSend &&
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
        flex: 1,
        backgroundColor: Colors.white,

    },
    body: {
        flex: 1,
        paddingLeft: "$padding",
        paddingRight: "$padding"
    },

    containerTextLinks: {
        flexDirection: "row",
        width: "100%",
    }
});