import React, {PureComponent} from 'react';
import {
    View,
    FlatList
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ScreenKey} from '../Constants';
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
    HeaderSearch
} from '../Components/Common';
import moment from "moment";
import {CommonActions} from "../actions";
import commonUtils from "../Utils/CommonUtils";
import {AsyncStoreKeys} from "../Constants";
import firebase, {Notification, NotificationOpen} from 'react-native-firebase';
import {Pray} from '../model';
import StatusOfPray from "../Constants/StatusOfPray";

const collect = firebase.firestore().collection('pray');


firebase.messaging().getToken()
    .then(fcmToken => {
        if (fcmToken) {
            // user has a device token
            // console.log("fcmToken :", fcmToken);
        } else {
            // user doesn't have a device token yet
            console.log("user doesn't have a device token yet");
        }
    });


// check permission message
firebase.messaging().hasPermission()
    .then(enabled => {
        if (enabled) {
            // console.log("user have permission");
        } else {
            // user doesn't have permission
            console.log("user doesn't have permission");
        }
    });


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
        this.state = {
            prays: props.prays.filter(e => e.status == StatusOfPray.INPROGRESS),
            isSearch: false,
            keySearch: "",
        };
    }

    //region cycle life

    componentDidMount() {

        let prayList = [];
        collect.get().then(snapshot => {
            snapshot.forEach(e => {
                let data = new Pray( {...e.data() , uid :e.id});
                if (data.owner && data.owner.uid == firebase.auth().currentUser.uid) {
                    prayList.push(data);
                }
            });

            if (prayList) {
                this.props.commonActions.getPrayList(prayList);
            }
        })


        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
            // Process your token as required
            // console.log("refresh token ", fcmToken);
        });

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
        });

        firebase.notifications().getInitialNotification()
            .then((notificationOpen: NotificationOpen) => {
                if (notificationOpen) {
                    // App was opened by a notification
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification: Notification = notificationOpen.notification;
                }
            });

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
        this.onTokenRefreshListener();
        this.notificationDisplayedListener();
        this.notificationListener();
        this.notificationOpenedListener();
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
        this.props.commonActions.deleteAllPrayInprogress();
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

    //region handle Pray Iteam
    onPressPrayItem(item) {
        this.props.navigation.navigate(ScreenKey.PRAY_DETAIL, item);
    }

    onPressFinish(item) {
        const currentDoc =  collect.doc(item.uid);
        const dataSend = Pray.removeFieldEmpty( new Pray({status : StatusOfPray.COMPLETE}));
        currentDoc.update(dataSend).then(res =>{
            this.props.commonActions.changeStatusPray({status: StatusOfPray.COMPLETE, pray: item});
        });
    }

    onPressDeleteSpecificPray(item) {
        const currentDoc =  collect.doc(item.uid);
        currentDoc.onSnapshot(obsOrNext => {
           if(!obsOrNext.data()){
               this.props.commonActions.deletePray(item);
           }
        });
        currentDoc.delete();
    }


    //endregion

    //region rendering

    renderPrayItem({item}) {
        const leftOptions = [
            {
                text: I18n.t("finished"),
                onPress: this.onPressFinish.bind(this, item)
            },
            {
                text: I18n.t("delete"),
                backgroundColor: Colors.red,
                onPress: this.onPressDeleteSpecificPray.bind(this, item)
            }
        ]

        return (
            <PrayItem
                title={item.title}
                content={item.content}
                date={moment(item.created).format("DD/MM/YYYY")}
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
            <View style={ApplicationStyles.screen.mainContainer}>
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

            </View>
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