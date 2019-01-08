import React, {PureComponent} from 'react';
import {
    FlatList,
} from 'react-native';
import {Colors, IconName} from '../../../Themes';
import I18n from '../../../I18n';
import {
    ActionSheet,
    PlaceHolder,
    ConfirmModal,
    ModalScanQR,
    ModalQR
} from '../../../Components/Common';
import commonUtils from "../../../Utils/CommonUtils";
import {StatusOfPray, EventRegisterTypes, ScreenKey} from "../../../Constants";
import firebase from 'react-native-firebase';
import {Pray, PrayLocation} from '../../../model';
import * as _ from "lodash";
import Permissions from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {style} from "../Style";

const collect = firebase.firestore().collection('prayer');
const locationCollect = firebase.firestore().collection('location');

import {
    Header,
    ActionSheetPrayItem,
    LoadingBar,
    Container,
    Content,
    PrayItem,
    ActionPrayerModal
} from "../../../Components/Modules";

export default class PrayingInProgress extends PureComponent {

    constructor(props) {
        super(props);

        this.optionActionSheet = [
            {text: I18n.t('createNewPrayer'), onPress: this.onPressAdd.bind(this)},
            {text: I18n.t('search'), onPress: this.onPressSearch.bind(this)},
            {text: I18n.t('deleteAll'), color: Colors.red, onPress: this.onPressDeletePrayer.bind(this)}
        ];
        this.leftHeader = {
            icon: IconName.menu,
            onPress: this.onPressLeft.bind(this)
        };
        this.rightHeader = [
            {
                icon: IconName.qr_code,
                onPress: this.onPressScanQR.bind(this),
            },
            {
                icon: IconName.more,
                onPress: this.onPressMoreOption.bind(this)
            }
        ];

        this.onPressAdd = this.onPressAdd.bind(this);
        this.renderPrayItem = this.renderPrayItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.renderListHeaderComponent = this.renderListHeaderComponent.bind(this);
        this.onAcceptDeletePrayer = this.onAcceptDeletePrayer.bind(this);
        this.onChangeKeySearch = this.onChangeKeySearch.bind(this);
        this.onPressBackSearch = this.onPressBackSearch.bind(this);
        this.onCloseActionPrayerModal = this.onCloseActionPrayerModal.bind(this);
        this.onCloseSearchBar = this.onCloseSearchBar.bind(this);
        this.onPressShare = this.onPressShare.bind(this);

        this.state = {
            prays: props.prayerReducer.payload && props.prayerReducer.payload.filter(e => e.status == StatusOfPray.INPROGRESS) || [],
            isSearch: false,
            keySearch: "",
            prayerSelected: null,
        };
    }

    //region cycle life

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.prayerReducer !== this.props.prayerReducer && nextProps.prayerReducer.payload) {
            this.setState({
                prays: nextProps.prayerReducer.payload.filter(e => e.status == StatusOfPray.INPROGRESS)
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.keySearch !== this.state.keySearch && nextProps.prayerReducer.payload) {
            const {prayerReducer} = nextProps;
            const {payload} = prayerReducer;
            if (nextState.keySearch.length > 3) {
                const newPrays = payload.filter(e => {
                    let contentFormated = commonUtils.trim(e.content).toUpperCase();
                    return e.status == StatusOfPray.INPROGRESS && contentFormated.indexOf(nextState.keySearch.toUpperCase()) != -1 ? true : false;
                });
                this.setState({
                    prays: newPrays
                });
            }
            else {
                const newPrays = payload.filter(e => {
                    return e.status == StatusOfPray.INPROGRESS;
                });
                this.setState({
                    prays: newPrays
                });
            }
        }

        // if (!nextState.isSearch && this.state.isSearch && !nextState.keySearch !== this. && nextProps.prayerReducer.payload) {
        //     this.setState({
        //         prays: nextProps.prayerReducer.payload.filter(e => e.status == StatusOfPray.COMPLETE)
        //     });
        // }

        if (nextState.prayerSelected !== this.state.prayerSelected && nextState.prayerSelected) {
            this.refs["_moreActionPray"].open();
        }
    }

    componentDidUpdate(preProps, preState) {
        if (preState.prayerSelected !== this.state.prayerSelected && !preState.prayerSelected && this.state.prayerSelected) {
            this.refs["_moreActionPray"].open();
        }
    }

    componentWillUnmount() {
    }

    //endregion

    //region handle event press

    onPressScanQR() {
        this.refs["_modalScanQR"].open();
    }

    //endregion

    //region handle header search

    onChangeKeySearch(value) {
        this.setState({
            keySearch: value
        });
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

    onCloseActionPrayerModal() {
        this.setState({
            prayerSelected: null
        });
    }

    //endregion

    //region handle modal confirm

    onAcceptDeletePrayer(data) {
        const {prayerActions} = this.props;
        prayerActions.deletePrayer(data ? data.uid : null);
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

    //region HANDLE HEADER

    onCloseSearchBar() {
        this.setState({
            isSearch: false,
            keySearch: "",
        });
    }

    onPressLeft() {
        this.props.navigation.navigate(ScreenKey.DRAWER_TOGGLE);
    }

    onPressMoreOption() {
        this.refs["moreAction"].open();
    }

    //endregion

    //region HANDLE PRAY ITEM

    requestLocationPermission() {
        return Permissions.request('location').then(response => {
            if (response === "authorized") {
                return "success";
            }
            else {
                alert("App need access location to get prayer list");
                return "fail";
            }
        })

    }

    onPressPrayItem = (item) => () => {
        this.props.navigation.navigate(ScreenKey.PRAY_DETAIL, item);
    }

    onPressChangeLiveStatus = (item) => () => {
        const currentDoc = collect.doc(firebase.auth().currentUser.uid).collection("data").doc(item.uid);
        if (item.isLive) {
            const dataSend = {
                isLive: null
            };

            currentDoc.update(dataSend).then(res => {
                locationCollect.doc(item.uid).delete();
                commonUtils.sendEvent({type: EventRegisterTypes.GET_PRAY});
            });
        }
        else {
            this.requestLocationPermission().then(res => {
                if (res === "success") {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            const {timestamp, coords} = position;
                            const {longitude, latitude} = coords || {};
                            const location = new PrayLocation({
                                long: longitude,
                                lat: latitude
                            });
                            const dataSend = Pray.removeFieldEmpty(new Pray({
                                isLive: location
                            }));
                            currentDoc.update(dataSend).then(res => {
                                return currentDoc.get().then(docSnap => {
                                    if (docSnap.data()) {
                                        const {uid} = docSnap.data();
                                        locationCollect.doc(uid).set(docSnap.data());
                                        commonUtils.sendEvent({type: EventRegisterTypes.GET_PRAY});
                                    }
                                    else {
                                        throw "error"
                                    }

                                }).catch(error => {
                                    console.warn("ERROR ", error)
                                });

                            });
                        },
                        (error) => {
                            // See error code charts below.
                            console.warn(error.code, error.message);
                        },
                        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
                    );
                }
            });

        }
    }

    onPressDeletePrayer(item) {
        this.refs["confirmDeleteOnePrayer"].open(item);
    }

    onPressMoreAction = (item) => () => {
        this.setState({
            prayerSelected: item
        });
    }

    onPressShare(item){
        const {uid} = item;
        let stringText = uid;
        stringText = stringText.concat(",").concat(firebase.auth().currentUser.uid);
        this.refs["_modalQR"].open(stringText);
    }

    //endregion

    //region RENDERING
    renderPrayItem({item}) {
        return (
            <PrayItem
                item={item}
                onPress={this.onPressPrayItem(item)}
                onPressMoreAction={this.onPressMoreAction(item)}
            />
        )
    }

    renderSeparate() {
        return (
            <PlaceHolder small={true}/>
        )
    }

    renderListHeaderComponent() {
        return (<PlaceHolder/>);
    }

    renderListFooterComponent() {
        return (<PlaceHolder/>);
    }

    render() {
        const {prays, isSearch, prayerSelected, keySearch} = this.state;
        const {prayerReducer, navigation, prayerActions} = this.props;
        const {fetching} = prayerReducer;
        return (
            [<Container key="container" pointerEvents={fetching ? "none" : "auto"}>

                <Header
                    title={I18n.t('praying')}
                    left={this.leftHeader}
                    right={this.rightHeader}
                    searchBar={isSearch}
                    keySearch={keySearch}
                    onChangeTextSearch={this.onChangeKeySearch}
                    onCloseSearchBar={this.onCloseSearchBar}
                />
                <Content>
                    <FlatList
                        data={prays}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderPrayItem}
                        ItemSeparatorComponent={this.renderSeparate}
                        ListFooterComponent={this.renderListFooterComponent}

                    />
                </Content>
            </Container>,
                <ActionSheet
                    key="ActionSheet"
                    options={this.optionActionSheet}
                    ref={"moreAction"}
                />,

                <ActionPrayerModal
                    onClosed={this.onCloseActionPrayerModal}
                    action={prayerActions}
                    key="_moreActionPray"
                    data={prayerSelected}
                    ref={"_moreActionPray"}
                    navigation={navigation}
                    onPressDelete={this.onPressDeletePrayer}
                    onPressChangeLiveStatus ={this.onPressChangeLiveStatus}
                    onPressShareOption={this.onPressShare}

                />,

                <ConfirmModal
                    key="ConfirmModal"
                    ref={"confirm"}
                    title={I18n.t("warning")}
                    content={I18n.t("deleteConfirmAll")}
                    rejectText={I18n.t("cancel")}
                    acceptText={I18n.t("yes")}
                    onAccept={this.onAcceptDeletePrayer}
                />,

                <ConfirmModal
                    key="ConfirmDeleteOnePrayer"
                    ref={"confirmDeleteOnePrayer"}
                    title={I18n.t("warning")}
                    content={I18n.t("deleteConfirm")}
                    rejectText={I18n.t("cancel")}
                    acceptText={I18n.t("yes")}
                    onAccept={this.onAcceptDeletePrayer}
                />,

                <ModalScanQR key={"modalScanQRCode"} ref={"_modalScanQR"} followingPrayer={prayerActions.followingPrayer}/>,
                <ModalQR key={"modalQRCode"} ref={"_modalQR"}/>,
                <LoadingBar visible={fetching}/>
            ]
        );

    }

    //endregion

}