import React, {PureComponent} from 'react';
import {
    View,
    FlatList, TouchableHighlight
} from 'react-native';
import {StatusOfPray, EventRegisterTypes, ScreenKey} from "../../../Constants";
import {Colors, Images, ApplicationStyles, IconName} from '../../../Themes';
import I18n from '../../../I18n/index';
import {
    ActionSheet,
    PlaceHolder,
} from '../../../Components/Common';
import commonUtils from "../../../Utils/CommonUtils";
import firebase from 'react-native-firebase';

import {
    Header,
    Container,
    NotificationItem,
    EmptyHolder,
    ConfirmModal
} from "../../../Components/Modules";
import ActionNotificationModal from "./ActionNotificationModal";


const mockData = [
    {
        contentCode: "prayer/prayer-finished",
        from: {
            displayName: "Hieu",
            uid: "12333",
        },
        created: new Date(),
        isRead: false,
        uid: "12313dada"
    },
    {
        contentCode: "prayer/prayer-finished",
        from: {
            displayName: "Hieu",
            uid: "12333",
        },
        created: new Date(),
        isRead: false,
        uid: "12313dada"
    },
    {
        contentCode: "prayer/prayer-finished",
        from: {
            displayName: "Hieu",
            uid: "12333",
        },
        created: new Date(),
        isRead: true,
        uid: "12313dada"
    },
    {
        contentCode: "prayer/prayer-finished",
        from: {
            displayName: "Hieu",
            uid: "12333",
        },
        created: new Date(),
        isRead: false,
        uid: "12313dada"
    },
    {
        contentCode: "prayer/prayer-finished",
        from: {
            displayName: "Hieu",
            uid: "12333",
        },
        created: new Date(),
        isRead: true,
        uid: "12313dada"
    }
]

export default class Notifications extends PureComponent {
    constructor(props) {
        super(props);
        this.onPressLeft = this.onPressLeft.bind(this);
        this.onPressMoreOption = this.onPressMoreOption.bind(this);
        this.onPressDelete = this.onPressDelete.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);

        this.onRefresh = this.onRefresh.bind(this);
        this.onAccept = this.onAccept.bind(this);

        this.onPressUpdateReadStatus = this.onPressUpdateReadStatus.bind(this);

        firebase.notifications().removeAllDeliveredNotifications();
        this.state = {
            payload: props.notificationReducer.payload,
            loading: true,
        };

        this.optionActionSheet = [
            {text: I18n.t('readAll'), onPress: this.onPressUpdateReadStatus},
            {text: I18n.t('deleteAll'), color: Colors.red, onPress: this.onPressDelete}
        ];


        this.leftHeader = {
            icon: IconName.menu,
            onPress: this.onPressLeft
        };
        this.rightHeader = [
            {
                icon: IconName.more,
                onPress: this.onPressMoreOption
            }
        ];
    }

    //region CYCLE LIFE

    componentWillReceiveProps(nextProps) {
        if (nextProps.notificationReducer.payload !== this.props.notificationReducer.payload) {
            this.setState({
                payload: nextProps.notificationReducer.payload
            });
        }


        if (nextProps.notificationReducer.fetching !== this.props.notificationReducer.fetching && nextProps.notificationReducer.fetching) {
            this.setState({loading: true})
        }

        if (nextProps.notificationReducer.fetching !== this.props.notificationReducer.fetching && !nextProps.notificationReducer.fetching) {
            this.setState({loading: false})
        }
    }

    //endregion

    //region other

    keyExtractor(item, index) {
        return index.toString();
    }

    //endregion

    //region handle confirm modal

    //endregion

    //region handle Header

    onPressLeft() {
        this.props.navigation.navigate(ScreenKey.DRAWER_TOGGLE);
    }

    onPressMoreOption(item) {
        if (item.uid) {
            this.refs["_actionSheet2"].open(item);
        }
        else {
            this.refs["_actionSheet1"].open();
        }
    }

    //endregion

    //region handle press Item

    onAccept(item) {
        const {notificationActions} = this.props;
        if(item){
            const {uid :notifUID} = item;
            notificationActions.deleteNotification({notifUID});
        }
        else{
            notificationActions.deleteNotification();
        }

    }

    onPressDelete(item) {
        // const action = {type: EventRegisterTypes.DELETE_NOTIFICATION, params: item};
        // commonUtils.sendEvent(action);
        if (item) {
            this.refs["_confirmModal2"].open(item);
        }
        else {
            this.refs["_confirmModal1"].open();
        }
    }

    onPressUpdateReadStatus(item, read) {
        // alert("onPressUpdateReadStatus");
        const {uid : notifUID} = item;
        const {notificationActions} = this.props;
        notificationActions.updateReadStatusNotification({notifUID , read});
        // const action = {type: EventRegisterTypes.UPDATE_NOTIFICATION, params: item};
        // commonUtils.sendEvent(action);
    }

    onPressItem(item) {
        alert("onPressItem");
        // this.refs["_actionSheet2"].open(item);
        // this.props.navigation.navigate(ScreenKey.NOTIFICATION_DETAIL, item);
    }

    //endregion

    //region RENDERING

    renderItem({item}) {
        return (
            <NotificationItem
                item={item}
                onPressMore={this.onPressMoreOption}
                onPress={this.onPressItem}
            />
        )
    }

    onRefresh() {
        // const {prayerActions} = this.props;
        // prayerActions.getPrayer();
    }

    render() {
        const {notificationReducer, navigation} = this.props;
        const {payload, loading} = this.state;
        const {fetching} = notificationReducer;

        return (
            [<Container key="container" pointerEvents={fetching ? "none" : "auto"}>

                <Header
                    title={I18n.t('notifications')}
                    left={this.leftHeader}
                    right={ payload.length !== 0 ? this.rightHeader : null}
                    isFetching={fetching}
                />
                {
                    payload.length === 0 ? <EmptyHolder
                        h1={I18n.t("noNotifTitle")}
                        h2={I18n.t("noNotifDescription")}
                    /> : null
                }

                <FlatList
                    refreshing={fetching}
                    data={payload}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />

            </Container>,
                <ActionSheet
                    key="_actionSheet1"
                    options={this.optionActionSheet}
                    ref={"_actionSheet1"}
                />,
                <ActionNotificationModal
                    key="_actionSheet2"
                    ref={"_actionSheet2"}
                    onPressUpdateReadStatus={this.onPressUpdateReadStatus}
                    onPressDelete={this.onPressDelete}
                />,
                <ConfirmModal
                    key="_confirmModal1"
                    ref={"_confirmModal1"}
                    title={I18n.t("warning")}
                    content={I18n.t("deleteConfirmAll")}
                    rejectText={I18n.t("cancel")}
                    acceptText={I18n.t("yes")}
                    onAccept={this.onAccept}
                />,

                <ConfirmModal
                    key={"_confirmModal2"}
                    ref={"_confirmModal2"}
                    title={I18n.t("warning")}
                    content={I18n.t("deleteConfirm")}
                    rejectText={I18n.t("cancel")}
                    acceptText={I18n.t("yes")}
                    onAccept={this.onAccept}
                />

            ]
        );
    }

    //endregion
}
