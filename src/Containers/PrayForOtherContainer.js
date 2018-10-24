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
import {AsyncStoreKeys} from "../Constants";
import firebase, {Notification, NotificationOpen} from 'react-native-firebase';
import {Pray} from '../model';
import StatusOfPray from "../Constants/StatusOfPray";
import geolib from "geolib";
import Permissions from 'react-native-permissions'

const collect = firebase.firestore().collection('pray');


class PrayForOther extends PureComponent {

    constructor(props) {
        super(props);
        this.optionActionSheet = [];
        this.onPressLeft = this.onPressLeft.bind(this);
        this.onPressRight = this.onPressRight.bind(this);
        this.onPressAdd = this.onPressAdd.bind(this);
        this.renderPrayItem = this.renderPrayItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.renderListHeaderComponent = this.renderListHeaderComponent.bind(this);
        this.onAcceptDeleteAll = this.onAcceptDeleteAll.bind(this);

        this.state = {
            prays: [],
            distance: 5000
        };
        // this.requestAccessLocation();

    }

    //region cycle life

    componentDidMount() {
        const {distance} = this.state;
        this.getPray(distance);
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentWillUnmount() {
    }

    //endregion


    getPray(distance){
        this.requestLocationPermission().then(res =>{
            if(res ==="success"){
                this.getCurrentLocation(distance);
            }
        });
    }

    requestLocationPermission(){
        return Permissions.request('location').then(response => {
            if(response ==="authorized"){
                return "success";
            }
            else{
                alert("App need access location to get pray list");
                return "fail";
            }
        })

    }

    getCurrentLocation(distance){
        return navigator.geolocation.getCurrentPosition((location) => {
            const {coords} = location;
            const {longitude, latitude} = coords;
            collect.get().then(snapshot => {
                let prayList = [];
                snapshot.forEach(e => {
                    let data = new Pray({...e.data(), uid: e.id});
                    if (data.owner && data.owner.uid == firebase.auth().currentUser.uid) {
                        prayList.push(data);
                    }
                });
                //filler Pray Live;
                prayList = prayList.filter(e => e.isLive);
                prayList = this.getNearby({fromLong : longitude , fromLat: latitude,distance : distance, array : prayList });
                this.setState({
                    pray : prayList
                });
            })

        }, (err) => {
            console.error("getCurrentLocation:", err)
        }, {enableHighAccuracy: false, timeout: 10000, maximumAge: 0})
    }

    getNearby({fromLong,fromLat, distance, array}) {
        if (!Array.isArray(array)) {
            return [];
        }
        return array.filter(p =>{
            const {long, lat} = p.isLive;
            return  geolib.isPointInCircle({latitude: fromLat, longitude: fromLong}, {
                latitude: lat,
                longitude: long
            }, distance);
        });
    }

    //region handle action modal


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
        const currentDoc = collect.doc(item.uid);
        const dataSend = Pray.removeFieldEmpty(new Pray({status: StatusOfPray.COMPLETE}));
        currentDoc.update(dataSend).then(res => {
            this.props.commonActions.changeStatusPray({status: StatusOfPray.COMPLETE, pray: item});
        });
    }

    onPressDeleteSpecificPray(item) {
        const currentDoc = collect.doc(item.uid);
        currentDoc.onSnapshot(obsOrNext => {
            if (!obsOrNext.data()) {
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
                <ButtonAction onPress={this.onPressAdd}/>

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