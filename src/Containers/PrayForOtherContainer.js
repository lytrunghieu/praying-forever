import React, {PureComponent} from 'react';
import {
    View,
    FlatList,
    PermissionsAndroid,
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
import {AsyncStoreKeys, EventRegisterTypes, StatusOfPray} from "../Constants";
import firebase, {Notification, NotificationOpen} from 'react-native-firebase';
import {Pray} from '../model';
import geolib from "geolib";
import Permissions from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

const collect = firebase.firestore().collection('location');


class PrayForOther extends PureComponent {

    constructor(props) {
        super(props);
        this.optionActionSheet = [
            {text: "5Km", onPress: this.onPressOption(0)},
            {text: "10Km", onPress: this.onPressOption(1)},
            {text: "15Km", onPress: this.onPressOption(2)}
        ];
        this.onPressLeft = this.onPressLeft.bind(this);
        this.onPressRight = this.onPressRight.bind(this);

        this.renderPrayItem = this.renderPrayItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.renderListHeaderComponent = this.renderListHeaderComponent.bind(this);
        this.state = {
            prays: [],
            distance: 5000
        };
        this.getPray(5000);
    }

    //region cycle life

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.distance != this.state.distance) {
            this.getPray(nextState.distance);
        }

    }

    componentWillUnmount() {
    }

    //endregion


    getPray(distance) {
        this.requestLocationPermission().then(res => {
            if (res === "success") {
                this.getCurrentLocation(distance);
            }
        });
    }

    requestLocationPermission() {
        return Permissions.request('location').then(response => {
            if (response === "authorized") {
                return "success";
            }
            else {
                alert("App need access location to get pray list");
                return "fail";
            }
        })

    }

    getCurrentLocation(distance) {

        Geolocation.getCurrentPosition(
            (position) => {
                const {coords} = position;
                const {longitude, latitude} = coords;
                collect.get().then(snapshot => {
                    let prayList = [];
                    snapshot.forEach(e => {
                        let data = e.data();
                        if (data.owner && data.owner.uid != firebase.auth().currentUser.uid) {
                            prayList.push(data);
                        }
                    });
                    //filler Pray Live;
                    prayList = this.getNearby({
                        fromLong: longitude,
                        fromLat: latitude,
                        distance: distance,
                        array: prayList
                    });
                    this.setState({
                        prays: prayList
                    });
                })

            },
            (error) => {
                // See error code charts below.
                console.warn(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
    }

    getNearby({fromLong, fromLat, distance, array}) {
        if (!Array.isArray(array)) {
            return [];
        }
        return array.filter(p => {
            const {long, lat} = p.isLive;
            const result = geolib.isPointInCircle({latitude: fromLat, longitude: fromLong}, {
                latitude: lat,
                longitude: long
            }, distance);
            return result;
        });
    }

    //region handle action modal

    onPressOption = (index) => () => {
        let distance = 5000;
        switch (index) {
            case 1: {
                distance = 10000;
                break;
            }

            case 2: {
                distance = 15000;
                break;
            }
        }

        console.log("Press");

        this.setState({
            distance
        });
    }


    onPressDeleteAll() {
        this.refs["moreAction"].close();
        this.refs["confirm"].open();
    }

    //endregion

    //region handle modal confirm

    //endregion

    //region other

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

    onPressFollowing(item) {
        commonUtils.sendEvent({type: EventRegisterTypes.UPDATE_FOLLOWING, params: item})
    }

    onPressReport(item) {
    }


    //endregion

    //region rendering

    renderPrayItem({item}) {
        const leftOptions = [
            {
                text: I18n.t("following"),
                onPress: this.onPressFollowing.bind(this, item)
            },
            {
                text: I18n.t("report"),
                backgroundColor: Colors.red,
                onPress: this.onPressReport.bind(this, item)
            }
        ]

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
        const {prays} = this.state;
        return (
            <View style={ApplicationStyles.screen.mainContainer}>
                <ImageBackground/>

                <NavBar title={I18n.t('prayForOther')}
                        onPressLeftButton={this.onPressLeft}
                        iconLeft={Images.menu}
                        iconRight={Images.more}
                        onPressRightButton={this.onPressRight}
                />

                <FlatList
                    style={styles.flatList}
                    data={prays}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderPrayItem}
                    ItemSeparatorComponent={this.renderSeparate}
                    ListHeaderComponent={this.renderListHeaderComponent}
                    ListFooterComponent={this.renderListFooterComponent}

                />

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

export const PrayForOtherContainer = connect(mapStateToProps, mapDispatchToProps)(PrayForOther);

const styles = EStyleSheet.create({
    flatList: {
        paddingRight: "$paddingSmall",
        paddingLeft: "$paddingSmall",
    }
});