import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {prayerActions} from "../Action";
import {
    View,
    ScrollView
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ScreenKey, StatusOfPray, EventRegisterTypes} from '../Constants';
import {Colors, Images, ApplicationStyles, IconName} from '../Themes';
import I18n from '../I18n';
import {
    NavBar,
    ActionSheet,
    PlaceHolder,
    ConfirmModal,
    RowItem,
    TextArea
} from '../Components/Common';
import commonUtils from "../Utils/CommonUtils";
import firebase from 'react-native-firebase';
import {Header} from "../Components/Modules"

const collect = firebase.firestore().collection("prayer");
import {Container, Left, Body, Right, Button, Title, Content} from 'native-base';

const optionActionSheetForFinished = []

class PrayDetail extends PureComponent {
    constructor(props) {
        super(props);
        const dataPassed = props.navigation.state.params;
        this.prayer = dataPassed;
        this.uid = dataPassed && dataPassed.uid || null;
        this.userUID = dataPassed && dataPassed.owner && dataPassed.owner.uid || null;
        this.optionActionSheetForFinished = [
            {text: I18n.t('continuesPraying'), onPress: this.onPressContinuesPraying.bind(this)},
            {text: I18n.t('edit'), onPress: this.onPressEdit.bind(this)},
            {text: I18n.t('delete'), color: Colors.red, onPress: this.onPressDelete.bind(this)}
        ];

        this.optionActionSheetForInprogress = [
            {text: I18n.t('updateToFinish'), onPress: this.onPressChangeToFinished.bind(this)},
            {text: I18n.t('edit'), onPress: this.onPressEdit.bind(this)},
            {text: I18n.t('delete'), color: Colors.red, onPress: this.onPressDelete.bind(this)}
        ];
        const {status} = this.prayer;

        this.onPressBack = this.onPressBack.bind(this);
        this.onPressRightHeader = this.onPressRightHeader.bind(this);
        this.onAcceptDelete = this.onAcceptDelete.bind(this);
        this.callbackChangeStatusPray = this.callbackChangeStatusPray.bind(this);
        this.state = {
            title: dataPassed.title,
            content: dataPassed.content,
            status: status,
            available: true
        };

        this.leftHeader = {
            icon: IconName.back,
            onPress: this.onPressBack.bind(this)
        };


        this.rightHeader = [
            {
                icon: IconName.more,
                onPress: this.onPressRightHeader.bind(this)
            }
        ];

    }

    //region cycle life

    componentWillReceiveProps(nextProps) {
        if (nextProps.prays && nextProps.prays !== this.props.prays) {
            const currentPray = nextProps.prays.find(e => e.uid === this.uid);
            if (currentPray) {
                this.prayer = currentPray;
                this.setState({
                    title: currentPray.title,
                    content: currentPray.content
                })
            }
        }
    }

    componentDidMount() {
        if (this.uid && this.userUID) {
            this.getPray();
        }
    }

    //endregion

    //region handle Action Sheet


    callbackChangeStatusPray() {
        const {status} = this.state;
        this.setState({
            status: status === StatusOfPray.INPROGRESS ? StatusOfPray.COMPLETE : StatusOfPray.INPROGRESS
        });
    }

    onPressContinuesPraying() {
        const item = this.prayer;
        const action = {
            type: EventRegisterTypes.UPDATE_PRAYER_STATUS,
            callback: this.callbackChangeStatusPray,
            params: {...item, status: StatusOfPray.INPROGRESS}
        };
        commonUtils.sendEvent(action);
    }


    onPressChangeToFinished() {
        const item = this.prayer;
        const action = {
            type: EventRegisterTypes.UPDATE_PRAYER_STATUS,
            callback: this.callbackChangeStatusPray,
            params: {...item, status: StatusOfPray.COMPLETE}
        };
        commonUtils.sendEvent(action);
    }


    onPressEdit() {
        this.props.navigation.navigate(ScreenKey.CREATE_PRAYING, this.prayer);
    }

    onPressDelete() {
        this.refs["moreAction"].close();
        this.refs["confirm"].open();
    }

    //endregion

    //region handle confirm modal

    onAcceptDelete() {
        const item = this.prayer;
        const action = {type: EventRegisterTypes.DELETE_PRAY, params: item};
        commonUtils.sendEvent(action);
        this.refs["confirm"].close();
        this.onPressBack();
    }

    //endregion

    //region handle Header

    onPressBack() {
        this.props.navigation.goBack();
    }

    onPressRightHeader() {
        this.refs["moreAction"].open();
    }

    //endregion

    //region functions
    getPray() {
        const currentDocRef = collect.doc(this.userUID).collection("data").doc(this.uid);
        currentDocRef.get().then(snap => {
            const data = snap.data();
            if (data) {
                const {title, content, status} = data;
                this.setState({
                    status, title, content
                });
                commonUtils.sendEvent({type: EventRegisterTypes.UPDATE_PRAY, params: {uid: this.uid}});
            }
            else {
                //case : owner of this prayer is login user
                if (this.userUID === firebase.auth().currentUser.uid) {
                    commonUtils.sendEvent({type: EventRegisterTypes.GET_PRAY});
                }
                //case : owner of this prayer is other user
                else {
                    commonUtils.sendEvent({type: EventRegisterTypes.DELETE_PRAY, params: {uid: this.uid}});
                }
                this.setState({
                    available: false
                })
            }

        });
    }

    //endregion

    //region rendering


    renderContainer() {
        const {title, content} = this.state;
        return (
            <ScrollView style={styles.scrollView}>
                <PlaceHolder/>
                <RowItem title={title} canPress={false} titleBold={true}/>
                <PlaceHolder/>
                <TextArea
                    value={content}
                    editable={false}
                />
            </ScrollView>
        )
    }

    render() {
        const {status, available} = this.state;

        return (
            [<Container key="container">

                <Header
                    title={I18n.t('prayDetail')}
                    left={this.leftHeader}
                    right={this.rightHeader}
                />
                <Content>
                    {
                        available ? this.renderContainer() : null
                    }
                </Content>


            </Container>,
                <ActionSheet
                    key ="moreAction"
                    options={status === StatusOfPray.INPROGRESS ? this.optionActionSheetForInprogress : this.optionActionSheetForFinished}
                    ref={"moreAction"}
                />,
                <ConfirmModal
                    key ="confirm"
                    ref={"confirm"}
                    title={I18n.t("warning")}
                    content={I18n.t("deleteConfirm")}
                    rejectText={I18n.t("cancel")}
                    acceptText={I18n.t("yes")}
                    onAccept={this.onAcceptDelete}
                />
            ]
        );
    }

    //endregion
}

const mapStateToProps = (state) => ({
    prays: state.prayerReducer.prays
})

const mapDispatchToProps = (dispatch) => ({
    prayersActions: bindActionCreators(prayerActions, dispatch)
})

export const PrayDetailContainer = connect(mapStateToProps, mapDispatchToProps)(PrayDetail);

const styles = EStyleSheet.create({

    scrollView: {
        flex: 1,
    }

});