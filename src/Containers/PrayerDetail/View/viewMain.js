import React, {PureComponent} from 'react';
import {
    ScrollView,
    Alert,
} from 'react-native';
import {ScreenKey, StatusOfPray, EventRegisterTypes} from '../../../Constants';
import {Colors, IconName} from '../../../Themes';
import I18n from '../../../I18n';
import {
    ActionSheet,
    PlaceHolder,
    ConfirmModal,
    RowItem,
    TextArea
} from '../../../Components/Common';
import commonUtils from "../../../Utils/CommonUtils";
import firebase from 'react-native-firebase';
import {Header, Container, Content, PrayItem} from "../../../Components/Modules";
import {ActionSheetPrayItem} from "../../../Components/Modules";

const collect = firebase.firestore().collection("prayer");

export default class PrayerDetail extends PureComponent {
    constructor(props) {
        super(props);
        const dataPassed = props.navigation.state.params;
        this.prayer = dataPassed;
        this.uid = dataPassed && dataPassed.uid || null;
        this.userUID = dataPassed && dataPassed.owner && dataPassed.owner.uid || null;

        const {status} = this.prayer;

        this.onPressBack = this.onPressBack.bind(this);
        this.onPressRightHeader = this.onPressRightHeader.bind(this);
        this.onAcceptDelete = this.onAcceptDelete.bind(this);
        this.callbackChangeStatusPray = this.callbackChangeStatusPray.bind(this);
        this.onPressDelete = this.onPressDelete.bind(this);
        this.state = {
            item: dataPassed,
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
        if (nextProps.prayerReducer && nextProps.prayerReducer !== this.props.prayerReducer && nextProps.prayerReducer.payload) {
            const currentPray = nextProps.prayerReducer.payload.find(e => e.uid === this.uid);
            if (currentPray) {
                this.prayer = currentPray;
                this.setState({
                    item: currentPray
                })
            }
            else{
                this.onPressBack();
            }
        }

        //Check Api have called
        if (nextProps.prayerDetailReducer.fetching !== this.props.prayerDetailReducer.fetching && !nextProps.prayerDetailReducer.fetching) {
            if (nextProps.prayerDetailReducer.success) {
                //Check result have prayer or not
                if (nextProps.prayerDetailReducer.payload) {
                    this.setState({
                        item: nextProps.prayerDetailReducer.payload
                    })
                }
                else {
                    this.setState({
                        item: null
                    });

                    Alert.alert(I18n.t("oops"),I18n.t("notFoundPrayer"),[
                        {text : I18n.t("done") , onPress : this.onPressBack}
                    ]);
                }
            }
            else {
                alert(nextProps.prayerDetailReducer.message);
            }
        }


    }

    componentDidMount() {
        if (this.uid && this.userUID) {
            const {action} = this.props;
            action.getPrayerDetail({userUID: this.userUID, prayerUID: this.uid});
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

    // onPressContinuesPraying() {
    //     const item = this.prayer;
    //     const action = {
    //         type: EventRegisterTypes.UPDATE_STATUS_PRAY,
    //         callback: this.callbackChangeStatusPray,
    //         params: {...item, status: StatusOfPray.INPROGRESS}
    //     };
    //     commonUtils.sendEvent(action);
    // }
    //
    //
    // onPressChangeToFinished() {
    //     const item = this.prayer;
    //     const action = {
    //         type: EventRegisterTypes.UPDATE_STATUS_PRAY,
    //         callback: this.callbackChangeStatusPray,
    //         params: {...item, status: StatusOfPray.COMPLETE}
    //     };
    //     commonUtils.sendEvent(action);
    // }
    //
    //
    // onPressEdit() {
    //     const {item} = this.state;
    //     this.props.navigation.navigate(ScreenKey.CREATE_PRAYING, item);
    // }
    //
    onPressDelete() {
        this.refs["confirm"].open();
    }

    //endregion

    //region handle confirm modal

    onAcceptDelete() {
        const {item ={}} = this.state;
        const {uid} = item;
        const {prayerActions} = this.props;
        prayerActions.deletePrayer(uid);
        // const action = {type: EventRegisterTypes.DELETE_PRAY, params: item};
        // commonUtils.sendEvent(action);
        // this.refs["confirm"].close();
        // this.onPressBack();
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

    retriveData({userUID, prayerUID}) {

    }

    //endregion

    //region rendering


    renderContainer() {
        const {item ={}} = this.state;
        return (<PrayItem allowScaleHeight={true} item={item} actionMore={false} />)
    }

    render() {
        const {status, available, item} = this.state;
        const {navigation,prayerActions} = this.props;
        const {fetching} = this.props.prayerDetailReducer;
        const {fetching : fetchingPrayers} = this.props.prayerReducer;

        return (
            [<Container key="container" pointerEvents={fetching ? "none" : fetchingPrayers ? "none":"auto"}>
                <Header
                    title={I18n.t('prayDetail')}
                    left={this.leftHeader}
                    right={this.rightHeader}
                    isFetching={fetching || fetchingPrayers}
                />
                <Content>
                    {
                        available ? this.renderContainer() : null
                    }
                </Content>
            </Container>,
               <ActionSheetPrayItem
                   action={prayerActions}
                   key="moreAction"
                   data ={item}
                   ref={"moreAction"}
                   navigation={navigation}
                   onPressDelete={this.onPressDelete}
               />,
                <ConfirmModal
                    key="confirm"
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
