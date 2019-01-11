import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {prayerActions} from "../../../Action/index";

import {
    View,
    FlatList, TouchableHighlight
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {StatusOfPray, EventRegisterTypes, ScreenKey} from "../../../Constants/index";
import {Colors, Images, ApplicationStyles} from '../../../Themes/index';
import I18n from '../../../I18n/index';
import {
    NavBar,
    ImageBackground,
    ActionSheet,
    ButtonAction,
    PrayItem,
    PlaceHolder,
    ConfirmModal
} from '../../../Components/Common/index';
import moment from "moment";
import commonUtils from "../../../Utils/CommonUtils";
import firebase from 'react-native-firebase';


class Notifications extends PureComponent {
    constructor(props) {
        super(props);
        this.optionActionSheet = [
            {text: I18n.t('readAll') ,onPress: this.onPressReadAll.bind(this)},
            {text: I18n.t('deleteAll'), color: Colors.red, onPress: this.onPressDeleteAll.bind(this)}
        ];

        this.onPressLeft = this.onPressLeft.bind(this);
        this.onPressRight = this.onPressRight.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.renderListHeaderComponent = this.renderListHeaderComponent.bind(this);
        this.onAcceptDeleteAll = this.onAcceptDeleteAll.bind(this);
        firebase.notifications().removeAllDeliveredNotifications();
    }

    //region CYCLE LIFE

    componentWillReceiveProps(nextProps) {

    }

    //endregion

    //region other

    keyExtractor(item, index) {
        return index.toString();
    }

    //endregion

    //region handle confirm modal


    onPressReadAll(){
        const action = {type: EventRegisterTypes.UPDATE_NOTIFICATION};
        commonUtils.sendEvent(action);
    }

    onPressDeleteAll() {
        this.refs["moreAction"].close();
        this.refs["confirm"].open();
    }

    onAcceptDeleteAll() {
        const action = {type: EventRegisterTypes.DELETE_NOTIFICATION};
        commonUtils.sendEvent(action);
        this.refs["confirm"].close();
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

    //region handle press Item

    onPressDeleteItem = (item) => () => {
        const action = {type: EventRegisterTypes.DELETE_NOTIFICATION, params: item};
        commonUtils.sendEvent(action);
    }

    onPressRead = (item) => () => {
        const action = {type: EventRegisterTypes.UPDATE_NOTIFICATION, params: item};
        commonUtils.sendEvent(action);
    }

    onPressItem = (item) => () => {
        this.props.navigation.navigate(ScreenKey.NOTIFICATION_DETAIL, item);
    }

    //endregion

    //region RENDERING

    renderItem({item}) {

        let optionActionItem = [

            {
                text: I18n.t("delete"),
                onPress: this.onPressDeleteItem(item)
            },
            {
                text: I18n.t("read"),
                onPress: this.onPressRead(item)
            },
        ]
        if(item.isRead){
            optionActionItem.pop();
        }

        return (
            <PrayItem
                title={item.title}
                content={item.content}
                leftOptions={optionActionItem}
                // date={moment(item.created).format("DD/MM/YYYY")}
                date={item.created}
                onPress={this.onPressItem(item)}
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
        const {notifications} = this.props;
        return (
            <View style={ApplicationStyles.screen.mainContainer}>
                <ImageBackground/>
                <NavBar title={I18n.t('notifications')}
                        onPressLeftButton={this.onPressLeft}
                        iconLeft={Images.menu}
                        iconRight={Images.more}
                        onPressRightButton={this.onPressRight}
                />

                <FlatList
                    style={styles.flatList}
                    data={notifications}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
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
                    content={I18n.t("deleteConfirm")}
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
    notifications: state.notificationReducer.notifications
})

const mapDispatchToProps = (dispatch) => ({
    prayersActions: bindActionCreators(prayerActions, dispatch)
})

export const NotificationsContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications);

const styles = EStyleSheet.create({
    flatList: {
        paddingRight: "$paddingSmall",
        paddingLeft: "$paddingSmall",
    }
});