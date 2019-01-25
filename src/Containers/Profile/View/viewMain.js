import React, {PureComponent} from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    Image,
    PixelRatio,
} from 'react-native';

import {style as styles} from "../Style";
import {FormValidate, Content, Container, Header, ButtonFooter, EmptyHolder, Avatar} from "../../../Components/Modules";
import {IconName} from "../../../Themes";
import {Icon, TextBase, Checkbox, DatePicker, PlaceHolder, Button} from "../../../Components/Common";
import I18n from "../../../I18n";
import moment from "moment";

var ImagePicker = require('react-native-image-picker');
const inputKey = {
    DISPLAY_NAME: {name: "displayName", index: 0}
}

export default class Profile extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
        const {userReducer} = props;
        const {payload = {}} = userReducer;
        const dataPassed = props.navigation.state.params;
        const {userUID} = dataPassed;
        this.uid = userUID;
        this.isUser = userUID == payload.uid ? true : false;
        this.userOri =  this.isUser ? payload : null;

        this.onPressBack = this.onPressBack.bind(this);
        this.state = {
            loading: true,
            displayName: this.userOri && this.userOri.displayName,
            validDisplayName: true,
            gender: this.userOri && this.userOri.gender,
            birthDay: this.userOri && this.userOri.birthDay,
            isChanged: false,
            avatarURL:  this.userOri && this.userOri.avatarURL,
        };

        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack
        };

        this.getProfile = this.getProfile.bind(this);
        this.onPressGender = this.onPressGender.bind(this);
        this.onChangeBD = this.onChangeBD.bind(this);
        this.onPressSave = this.onPressSave.bind(this);

        this.getImage = this.getImage.bind(this)
    }

    componentDidMount() {
        this.getProfile();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.userReducer.payload !== this.props.userReducer.payload) {
            const {displayName, gender, birthDay, avatarURL} = nextProps.userReducer.payload;
            this.setState({
                displayName,
                gender,
                birthDay,
                isChanged: false,
                avatarURL
            });
        }


        if (nextProps.profileReducer.fetching !== this.props.profileReducer.fetching && !nextProps.profileReducer.fetching) {
            this.setState({
                loading: false
            });
        }

        if (nextProps.profileReducer.fetching !== this.props.profileReducer.fetching && nextProps.profileReducer.fetching) {
            this.setState({
                loading: true
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if ((nextState.displayName != this.state.displayName || nextState.gender != this.state.gender || nextState.birthDay != this.state.birthDay) && this.userOri) {
            if (nextState.displayName != this.userOri.displayName || nextState.gender != this.userOri.gender || moment(nextState.birthDay).diff(this.userOri.birthDay)) {
                this.setState({
                    isChanged: true
                });
            }
            else {
                this.setState({
                    isChanged: false
                });
            }

        }
    }

    getImage() {
        const {userActions} = this.props;

        // More info on all the options is below in the README...just some common use cases shown here
        var options = {
            title: I18n.t("selectAvatar"),
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            maxWidth: PixelRatio.getPixelSizeForLayoutSize(200),
            maxHeight: PixelRatio.getPixelSizeForLayoutSize(200),
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                userActions.updateAvatar({uri :response.uri});
            }
        });

    }


    onPressSave() {
        const {validDisplayName, displayName, gender, birthDay} = this.state;
        const {userActions} = this.props;
        if (validDisplayName) {
            userActions.updateProfile({displayName, gender, birthDay});
        }
    }

    onPressBack() {
        this.props.navigation.goBack();
    }

    onChangeTextInput(key, value) {

        let newState = {[key]: value};

        switch (key) {
            case inputKey.DISPLAY_NAME.name : {
                newState.validDisplayName = true;
                break;
            }
        }

        this.setState(newState);
    }

    onPressGender() {
        this.setState({
            gender: this.state.gender ? 0 : 1
        });
    }

    onChangeBD(newDate) {
        this.setState({birthDay: newDate});
    }


    getProfile() {
        const {userActions} = this.props;
        userActions.getProfile({userUID: this.uid, isUser: this.isUser}).then(res => {
            if (res.success && !this.isUser) {
                const {displayName, gender, birthDay,avatarURL} = res.data;
                this.userOri = res.data;
                this.setState({
                    displayName,
                    gender,
                    birthDay,
                    isChanged: false,
                    avatarURL
                });
            }
        })
    }

    //endregion

    render() {

        const {loading, gender, birthDay, isChanged, displayName ,avatarURL} = this.state;
        const {profileReducer} = this.props;
        const {fetching} = profileReducer;

        return (
            <Container>
                <Header
                    title={I18n.t('profile')}
                    left={this.leftHeader}
                    isFetching={fetching}
                />
                {
                    !loading && !this.userOri ? <EmptyHolder
                        h1={I18n.t("noProfileTile")}
                        h2={I18n.t("noProfileDescription")}
                        link={I18n.t("tryAgain")}
                        onPressLink={this.getProfile}
                    /> : null
                }
                {
                    this.userOri ?
                        <Content>
                            <View style={{alignSelf: "center", paddingBottom: 10, paddingTop: 10}}>
                                <Avatar uid={this.uid} ref="_avatar" uri={avatarURL} largeX={true}/>
                                <PlaceHolder/>
                                {
                                    this.isUser &&
                                    <Button disabled={loading} rounded={true} center={true} text={I18n.t("update")}
                                            onPress={this.getImage}/>
                                }

                            </View>
                            <View style={[styles.form]} pointerEvents={ !this.isUser ? "none" : "auto"} >
                                <TextBase info={true}>{I18n.t("displayName")}</TextBase>
                                <FormValidate
                                    defaultValue={displayName}
                                    onChangeText={this.onChangeTextInput.bind(this, inputKey.DISPLAY_NAME.name)}
                                    maxLength ={256}
                                />
                                <TextBase info={true}>{I18n.t("gender")}</TextBase>
                                <Checkbox text={I18n.t("male")} onPress={this.onPressGender}
                                          checked={gender ? false : true}/>
                                <DatePicker label={I18n.t("birthDay")} chosenDate={birthDay} setDate={this.onChangeBD}/>
                            </View>
                        </Content> : null
                }


                {this.isUser &&
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : null}>
                    <ButtonFooter text={I18n.t("save")} disabled={!isChanged || fetching}
                                  onPress={this.onPressSave}/>
                </KeyboardAvoidingView>
                }
            </Container>
        );
    }

}

