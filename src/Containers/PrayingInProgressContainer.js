import React, {PureComponent} from 'react';
import {
    View,
    FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Images, ApplicationStyles} from '../Themes';
import I18n from '../I18n';
import {
    NavBar,
    ImageBackground,
    ActionSheet,
    ButtonAction,
    PrayItem,
    PlaceHolder,
    ConfirmModal,
    HeaderSearch,
    ModalScanQR,
    ModalQR
} from '../Components/Common';
import moment from "moment";
import {CommonActions} from "../actions";
import commonUtils from "../Utils/CommonUtils";
import {StatusOfPray,EventRegisterTypes,ScreenKey} from "../Constants";
import firebase, {Notification, NotificationOpen} from 'react-native-firebase';
import {Pray, PrayLocation} from '../model';
import * as _ from "lodash";

const collect = firebase.firestore().collection('pray');

class PrayingInProgress extends PureComponent {

    constructor(props) {
        super(props);
        this.optionActionSheet = [
            {text: I18n.t('search'), onPress: this.onPressSearch.bind(this)},
            {text: I18n.t('deleteAll'), color: Colors.red, onPress: this.onPressDeleteAll.bind(this)}
        ];

        this.onPressLeft = this.onPressLeft.bind(this);
        this.onPressRight = this.onPressRight.bind(this);
        this.onPressAdd = this.onPressAdd.bind(this);
        this.renderPrayItem = this.renderPrayItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.renderListHeaderComponent = this.renderListHeaderComponent.bind(this);
        this.onAcceptDeleteAll = this.onAcceptDeleteAll.bind(this);
        this.onChangeKeySearch = this.onChangeKeySearch.bind(this);
        this.onPressBackSearch = this.onPressBackSearch.bind(this);
        this.onPressScanQR = this.onPressScanQR.bind(this);
        this.state = {
            prays: props.prays.filter(e => e.status == StatusOfPray.INPROGRESS),
            isSearch: false,
            keySearch: "",
        };
        this.listIconRight = [
            { icon : Images.garbage , onPress : this.onPressScanQR}
        ];
    }

    //region cycle life

    componentDidMount() {



        // this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
        //     // Process your notification as required
        //     // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        // });
        // this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
        //     // Process your notification as required
        // });
        //
        // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        //     // Get the action triggered by the notification being opened
        //
        //     const action = notificationOpen.action;
        //     // Get information about the notification that was opened
        //     const notification: Notification = notificationOpen.notification;
        //     console.log("notificationOpen ",notification);
        // });
        //
        // firebase.notifications().getInitialNotification()
        //     .then((notificationOpen: NotificationOpen) => {
        //         if (notificationOpen) {
        //             // App was opened by a notification
        //             // Get the action triggered by the notification being opened
        //             const action = notificationOpen.action;
        //             // Get information about the notification that was opened
        //             const notification: Notification = notificationOpen.notification;
        //         }
        //     });

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.prays !== this.props.prays) {
            this.setState({
                prays: nextProps.prays.filter(e => e.status == StatusOfPray.INPROGRESS)
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.keySearch !== this.state.keySearch && nextState.keySearch.length > 3) {
            const {prays} = nextProps;
            const newPrays = prays.filter(e => {
                let contentFormated = commonUtils.trim(e.content).toUpperCase();
                return e.status == StatusOfPray.INPROGRESS && contentFormated.indexOf(nextState.keySearch.toUpperCase()) != -1 ? true : false;
            });
            this.setState({
                prays: newPrays
            })
        }

        if (!nextState.isSearch && this.state.isSearch && !nextState.keySearch) {
            this.setState({
                prays: nextProps.prays.filter(e => e.status == StatusOfPray.COMPLETE)
            });
        }
    }

    componentWillUnmount() {
    }

    //endregion

    //region handle event press

    onPressScanQR(){
        this.refs["_modalScanQR"].open();
    }

    //endregion

    //region handle header search

    onChangeKeySearch(value) {
        this.setState({
            keySearch: value
        });
        const {prays} = this.props;
    }

    onPressBackSearch() {
        this.setState({
            isSearch: false,
            keySearch: ""
        });
    }

    //endregion

    //region handle action modal
    onPressSearch() {
        this.setState({
            isSearch: true
        });
        this.refs["moreAction"].close();
    }

    onPressDeleteAll() {
        this.refs["moreAction"].close();
        this.refs["confirm"].open();
    }

    //endregion

    //region handle modal confirm
    onAcceptDeleteAll() {
        const action ={ type :  EventRegisterTypes.DELETE_PRAY};
        commonUtils.sendEvent(action);
        this.refs["confirm"].close();
    }

    //endregion

    //region other

    onPressAdd() {
        this.props.navigation.navigate(ScreenKey.CREATE_PRAYING);
    }

    keyExtractor(item, index) {
        return index.toString();
    }

    //endregion

    //region handle Header

    onPressLeft() {
        this.props.navigation.navigate(ScreenKey.DRAWER_TOGGLE);
    }

    onPressRight() {
        this.refs["moreAction"].open();
    }

    //endregion

    //region handle Pray Item
    onPressPrayItem(item) {
        this.props.navigation.navigate(ScreenKey.PRAY_DETAIL, item);
    }

    onPressFinish(item) {
        const action ={ type :  EventRegisterTypes.UPDATE_STATUS_PRAY, params : item};
        commonUtils.sendEvent(action);
    }

    onPressShare = (item) => () =>{
        const {owner , uid : uidPray} = item || {};
        const {uid} = owner || {};
        if(_.isEmpty(uid) || _.isEmpty(uidPray)){
            return;
        }
        // const path = "pray".concat("/").concat(uid).concat("/").concat("data").concat("/").concat(uidPray);
        const path = uid.concat("/").concat("data").concat("/").concat(uidPray);
        this.refs["_modalQR"].open(path);
        // const doc =collect.doc(path);
        // doc.get().then(documentSnapshot =>{
        //    const data  =documentSnapshot.data();
        //    console.log("collect ", data);
        //
        // });

    }

    onPressStatusLive(item) {
        const currentDoc = collect.doc(item.uid);

        if(item.isLive){
            const dataSend ={
                isLive:  null
            };
            currentDoc.update(dataSend).then(res =>{
            });
        }
        else{
            navigator.geolocation.getCurrentPosition(success => {
                const {timestamp, coords} = success;
                const {longitude, latitude} = coords || {};
                const location = new PrayLocation({
                    long: longitude,
                    lat: latitude
                });
                const dataSend = Pray.removeFieldEmpty(new Pray({
                    isLive:  location
                }));
                currentDoc.update(dataSend).then(res =>{

                });
            });
        }
    }

    onPressDeleteSpecificPray(item) {
        const action ={ type :  EventRegisterTypes.DELETE_PRAY, params : item};
        commonUtils.sendEvent(action);
    }

    onPressUnfollowing(item) {
        const action ={ type :  EventRegisterTypes.UPDATE_FOLLOWING, params : item};
        commonUtils.sendEvent(action);
    }

    //endregion

    //region rendering

    renderPrayItem({item}) {
        let leftOptions =[];

        if(item.owner.uid === firebase.auth().currentUser.uid){
            leftOptions = [
                {
                    text: I18n.t("offline"),
                    onPress: this.onPressStatusLive.bind(this, item)
                },
                {
                    text: I18n.t("completed"),
                    onPress: this.onPressFinish.bind(this, item)
                },

                {
                    text: I18n.t("share"),
                    onPress: this.onPressShare(item)
                },

                {
                    text: I18n.t("delete"),
                    onPress: this.onPressDeleteSpecificPray.bind(this, item)
                }
            ];
            if(item.isLive){
                leftOptions[0] = {
                    text: I18n.t("onlive"),
                    onPress: this.onPressStatusLive.bind(this, item)
                }
            }
        }
        else{
            leftOptions = [
                {
                    text: I18n.t("unFollowing"),
                    onPress: this.onPressUnfollowing.bind(this, item)
                }
            ];
        }



        return (
            <PrayItem
                title={item.title}
                content={item.content}
                date={item.created}
                onPress={this.onPressPrayItem.bind(this, item)}
                leftOptions={leftOptions}
            />
        )
    }

    renderSeparate() {
        return (
            <PlaceHolder/>
        )
    }

    renderListHeaderComponent() {
        return (<PlaceHolder/>);
    }

    renderListFooterComponent() {
        return (<PlaceHolder/>);
    }

    render() {
        const {prays, isSearch} = this.state;
        return (
            [<View
                key={"main"}
                style={ApplicationStyles.screen.mainContainer}>
                <ImageBackground/>

                {
                    isSearch &&
                    <HeaderSearch
                        fit={true}
                        value={this.state.keySearch}
                        onChangeText={this.onChangeKeySearch}
                        onPressRightIcon={this.onChangeKeySearch.bind(this, "")}
                        onPressLeftButton={this.onPressBackSearch}
                    />
                    ||
                    <NavBar title={I18n.t('praying')}
                            onPressLeftButton={this.onPressLeft}
                            iconLeft={Images.menu}
                            iconRight={Images.more}
                            onPressRightButton={this.onPressRight}
                            iconRightList={this.listIconRight}
                    />
                }


                <FlatList
                    style={styles.flatList}
                    data={prays}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderPrayItem}
                    ItemSeparatorComponent={this.renderSeparate}
                    ListHeaderComponent={this.renderListHeaderComponent}
                    ListFooterComponent={this.renderListFooterComponent}

                />
                <ButtonAction onPress={this.onPressAdd}/>
                <ActionSheet
                    options={this.optionActionSheet}
                    ref={"moreAction"}
                />
                <ConfirmModal
                    ref={"confirm"}
                    title={I18n.t("warning")}
                    content={I18n.t("deleteConfirmAll")}
                    rejectText={I18n.t("cancel")}
                    acceptText={I18n.t("yes")}
                    onAccept={this.onAcceptDeleteAll}
                />

            </View>,
                <ModalScanQR key={"modalScanQRCode"} ref ={"_modalScanQR"} />,
                <ModalQR key={"modalQRCode"} ref ={"_modalQR"} />
            ]
        );
    }

    //endregion

}

const mapStateToProps = (state) => ({
    prays: state.commonReducer.prays
})

const mapDispatchToProps = (dispatch) => ({
    commonActions: bindActionCreators(CommonActions, dispatch)
})

export const PrayingInProgressContainer = connect(mapStateToProps, mapDispatchToProps)(PrayingInProgress);

const styles = EStyleSheet.create({
    flatList: {
        paddingRight: "$paddingSmall",
        paddingLeft: "$paddingSmall",
    }
});