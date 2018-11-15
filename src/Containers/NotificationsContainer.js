import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {CommonActions } from "../actions";

import {
    View,
    FlatList,TouchableHighlight
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {StatusOfPray,EventRegisterTypes,ScreenKey} from "../Constants";
import {Colors, Images, ApplicationStyles} from '../Themes';
import I18n from '../I18n';
import {NavBar, ImageBackground, ActionSheet, ButtonAction, PrayItem, PlaceHolder,ConfirmModal} from '../Components/Common';
import moment from "moment";
import commonUtils from "../Utils/CommonUtils";
import firebase from 'react-native-firebase';

class Notifications extends PureComponent {
    constructor(props) {
        super(props);
        this.optionActionSheet = [
            {text: I18n.t('search')},
            {text: I18n.t('deleteAll'), color: Colors.red , onPress : this.onPressDeleteAll.bind(this)}
        ]
        this.onPressLeft = this.onPressLeft.bind(this);
        this.onPressRight = this.onPressRight.bind(this);
        this.renderPrayItem = this.renderPrayItem.bind(this);
        this.renderSeparate = this.renderSeparate.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.renderListFooterComponent = this.renderListFooterComponent.bind(this);
        this.renderListHeaderComponent = this.renderListHeaderComponent.bind(this);
        this.onAcceptDeleteAll = this.onAcceptDeleteAll.bind(this);
        this.state ={
            notifications : []
        };
        firebase.notifications().removeAllDeliveredNotifications();
    }

    //region cycle life

    componentWillReceiveProps(nextProps){

    }
    //endregion

    //region other

    keyExtractor(item, index) {
        return index.toString();
    }
    //endregion

    //region handle confirm modal

    onPressDeleteAll(){
        this.refs["moreAction"].close();
        this.refs["confirm"].open();
    }

    onAcceptDeleteAll(){
        const action ={ type :  EventRegisterTypes.DELETE_ALL_PRAY_COMPLETED, params : {inProgress: false}};
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

    //region Handle Pray Item


    onPressDeleteSpecificPray(item){
        const action ={ type :  EventRegisterTypes.DELETE_PRAY, params : item};
        commonUtils.sendEvent(action);
    }

    //endregion

    //region rendering

    renderPrayItem({item}) {
        const lefttOptions =[
            {
                text:I18n.t("continues"),
                onPress : this.onPressContinue.bind(this,item)
            },
            {
                text :I18n.t("delete"),
                backgroundColor:Colors.red,
                onPress : this.onPressDeleteSpecificPray.bind(this,item)
            }
        ]

        return (
            <PrayItem
                title={item.title}
                content={item.content}
                date={moment(item.created).format("DD/MM/YYYY")}
                onPress ={this.onPressPrayItem.bind(this,item)}
                leftOptions={lefttOptions}
            />
        )
    }

    renderSeparate() {
        return (
            <PlaceHolder/>
        )
    }

    renderListHeaderComponent(){
        return (<PlaceHolder/>);
    }

    renderListFooterComponent(){
        return (<PlaceHolder/>);
    }

    render() {
        const {notifications} = this.state;

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
                    renderItem={this.renderPrayItem}
                    ItemSeparatorComponent={this.renderSeparate}
                    ListHeaderComponent ={this.renderListHeaderComponent}
                    ListFooterComponent ={this.renderListFooterComponent}

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
})

const mapDispatchToProps = (dispatch) => ({
    commonActions : bindActionCreators(CommonActions,dispatch)
})

export const NotificationsContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications);

const styles = EStyleSheet.create({
    flatList: {
        paddingRight: "$paddingSmall",
        paddingLeft: "$paddingSmall",
    }
});