import React, {PureComponent} from 'react';
import {
    View
} from 'react-native';

import {style as styles} from "../Style";
import {FormValidate, Content, Container, Header, ButtonFooter, EmptyHolder} from "../../../Components/Modules";
import {IconName} from "../../../Themes";
import {Icon, TextBase, Checkbox, DatePicker, PlaceHolder} from "../../../Components/Common";
import I18n from "../../../I18n";


const inputKey = {
    DISPLAY_NAME: {name: "displayName", index: 0}
}

export default class CreatePraying extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
        const dataPassed = props.navigation.state.params;
        const {user, userUID} = dataPassed;
        this.uid = userUID;
        this.isUser = user ? true : false;
        this.onPressBack = this.onPressBack.bind(this);
        this.state = {
            user: user,
            loading: true,
            displayName: "",
            validDisplayName: true,
            gender: user && user.gender,
            birthDay: user && user.birthDay,
            isChanged: false,
        };

        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack
        };

        this.getProfile = this.getProfile.bind(this);
        this.onPressGender = this.onPressGender.bind(this);
        this.onChangeBD = this.onChangeBD.bind(this);
    }

    componentDidMount() {
        this.getProfile();
    }


    componentWillReceiveProps(nextProps) {
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
        if (nextState.user) {
            if (nextState.displayName == nextState.user.displayName || nextState.gender != nextState.user.gender || nextState.birthDay != nextState.user.birthDay) {
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
        userActions.getProfile({userUID: this.uid, isUser: false}).then(res => {
            if (res.success) {
                this.setState({
                    user: res.data
                });
            }
        })
    }


    //endregion

    render() {

        const {loading, user, gender, birthDay, isChanged} = this.state;
        const {profileReducer} = this.props;
        const {fetching} = profileReducer;

        return (
            <Container pointerEvents={fetching ? "none" : "auto"}>
                <Header
                    title={I18n.t('profile')}
                    left={this.leftHeader}
                    isFetching={fetching}
                />
                {
                    !loading && !user ? <EmptyHolder
                        h1={I18n.t("noProfileTile")}
                        h2={I18n.t("noProfileDescription")}
                        link={I18n.t("tryAgain")}
                        onPressLink={this.getProfile}
                    /> : null
                }
                {
                    user ?
                        <Content>
                            <View style={[styles.form]}>
                                <TextBase info={true}>{I18n.t("displayName")}</TextBase>
                                <FormValidate
                                    defaultValue={user.displayName}
                                    onChangeText={this.onChangeTextInput.bind(this, inputKey.DISPLAY_NAME.name)}
                                    editable={this.isUser || false}
                                />
                                <TextBase info={true}>{I18n.t("gender")}</TextBase>
                                <Checkbox text={I18n.t("male")} onPress={this.onPressGender}
                                          checked={gender ? false : true}/>
                                <DatePicker label={I18n.t("birthDay")} chosenDate={birthDay} setDate={this.onChangeBD}/>
                            </View>
                            <ButtonFooter text={I18n.t("save")} disabled={!isChanged}/>
                        </Content> : null
                }


            </Container>
        );
    }

}

