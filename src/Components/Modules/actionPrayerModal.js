import React, {PureComponent} from 'react';
import {ScreenKey, StatusOfPray, EventRegisterTypes} from '../../Constants';
import {Colors} from '../../Themes/index';
import I18n from '../../I18n/index';
import {
    ActionSheet,
} from '../Common/index';
import firebase from 'react-native-firebase';
import Proptypes from "prop-types";
import {CommonUtils} from "../../Utils";

export default class ActionPrayerModal extends PureComponent {

    //region CYCLE LIFE

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.onClosed = this.onClosed.bind(this);
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUpdate(nextProps, nextState) {
    }

    //endregion

    onClosed() {
        this.setState({
            data: []
        })
    }

    //region handle Action Sheet

    onPressUpdateFollowingStatus = (data, follow) => () => {
        const {uid: prayerUID, owner = {}} = data;
        const {uid: userOtherUID} = owner;
        CommonUtils.sendEvent({type: EventRegisterTypes.FOLLOWING_PRAYER, params: {prayerUID, userOtherUID, follow}})
    }

    onPressUpdatePrayerStatus = (data) => () => {
        const {uid: prayerUID} = data;
        CommonUtils.sendEvent({type: EventRegisterTypes.UPDATE_PRAYER_STATUS, params: {prayerUID}})
    }

    onPressEdit = (data) => () => {
        CommonUtils.sendEvent({
            type: EventRegisterTypes.NAVIGATE_SCREEN, params: {
                screen: ScreenKey.CREATE_PRAYING,
                params: data
            }
        });
    }

    onPressDelete = (params) => () => {
        CommonUtils.sendEvent({type: EventRegisterTypes.SHOW_CONFIRM_MODAL, params: {data: params}});
    }

    onPressShare = (data) => () => {
        console.log("  on Share");
        CommonUtils.sendEvent({type: EventRegisterTypes.SHOW_MODAL_QR_CODE, params: {data: data}})
    }

    _onPressChangeLiveStatus = (data, live) => () => {
        const {uid: prayerUID} = data;
        CommonUtils.sendEvent({type: EventRegisterTypes.UPDATE_LIVE_STATUS, params: {prayerUID, live}})
    }

    //endregion

    //region functions
    open(data) {
        this.refs["moreAction"].open();
        this.params = data;
        this.setState({
            data: this.generateOption(data)
        });
    }

    generateOption(data) {
        let options = [];
        if (data) {
            const {owner = {}, status, following = [], isLive} = data;
            const {uid = {}} = owner;
            if (uid === firebase.auth().currentUser.uid) {
                options = options.concat([
                    {text: I18n.t('edit'), onPress: this.onPressEdit(data)},
                    {text: I18n.t('delete'), color: Colors.red, onPress: this.onPressDelete(data)}
                ]);
                if (status !== StatusOfPray.COMPLETE) {
                    options = options.concat(
                        {text: I18n.t('updateToFinish'), onPress: this.onPressUpdatePrayerStatus(data)},
                        {text: I18n.t("share"), onPress: this.onPressShare(data)}
                    );

                    if (isLive) {
                        options = options.concat(
                            {text: I18n.t('disablePublic'), onPress: this._onPressChangeLiveStatus(data, false)},
                        );
                    }
                    else {
                        options = options.concat(
                            {text: I18n.t('public'), onPress: this._onPressChangeLiveStatus(data, true)},
                        );
                    }

                }
                else {
                    options = options.concat(
                        {text: I18n.t('continuesPraying'), onPress: this.onPressUpdatePrayerStatus(data)},
                    );
                }
            }
            else {
                if (Array.isArray(following) && following.length > 0) {
                    let hadFollow = following.find(e => e && e === firebase.auth().currentUser.uid);
                    if (hadFollow) {
                        options = options.concat([
                            {text: I18n.t('unFollowing'), onPress: this.onPressUpdateFollowingStatus(data, false)},
                        ]);
                    }
                    else {
                        options = options.concat([
                            {text: I18n.t('following'), onPress: this.onPressUpdateFollowingStatus(data, true)},
                        ]);
                    }
                }

                else {
                    options = options.concat([
                        {text: I18n.t('following'), onPress: this.onPressUpdateFollowingStatus(data, true)},
                    ]);

                }
            }
        }
        return options;
    }

    //endregion

    //region RENDERING

    render() {
        const {...rest} = this.props;
        const {data} = this.state;
        return (
            <ActionSheet
                onClosed={this.onClosed}
                key="moreAction"
                options={data}
                ref={"moreAction"}
                {...rest}
            />
        );
    }

    //endregion
}

ActionPrayerModal.defaultProps = {
    onPressShare: () => {
    },
    onPressPublic: () => {
    }
};

ActionPrayerModal.propTypes = {
    // navigation: Proptypes.any.isRequired,
    // data: Proptypes.any.isRequired,
    onPressShareOption: Proptypes.func,
};