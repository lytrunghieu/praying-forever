import React, {PureComponent} from 'react';
import {ScreenKey, StatusOfPray, EventRegisterTypes} from '../../Constants/index';
import {Colors} from '../../Themes/index';
import I18n from '../../I18n/index';
import {
    ActionSheet,
} from '../Common/index';
import firebase from 'react-native-firebase';
import Proptypes from "prop-types";
import {CommonUtils} from "../../Utils";

export default class ActionPrayerModal extends PureComponent {

    //region cycle life

    constructor(props) {
        super(props);
        this.optionActionSheet = [];
        this.generateOption(props.data);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.generateOption(nextProps.data);
        }
    }

    //endregion

    //region handle Action Sheet

    onPressUpdateFollowingStatus = (data, follow) => () => {
        const {action} = this.props;
        const {uid : prayerUID, owner ={}} = data;
        const {uid : userOtherUID } = owner;
        action.followingPrayer({prayerUID, userOtherUID,follow});
    }

    onPressUpdatePrayerStatus = (inprogress) => () => {
        const {action, data} = this.props;
        const {uid} = data;
        action.updateStatusPrayer(uid);
    }

    onPressEdit() {
        const {data} = this.props;
        this.props.navigation.navigate(ScreenKey.CREATE_PRAYING, data);
    }

    onPressDelete = (params) => () => {
        const {onPressDelete} = this.props;
        onPressDelete(params);
    }

    onPressShare = (data) => () => {
        const {onPressShareOption} = this.props;
        onPressShareOption(data);
    }

    _onPressChangeLiveStatus = (data,live) =>() => {
        const  {uid : prayerUID} = data;
        CommonUtils.sendEvent({type : EventRegisterTypes.UPDATE_LIVE_STATUS , params :{prayerUID, live}})

        // if(action.updateLiveStatusPrayer){
        //     action.updateLiveStatusPrayer({live: live ,prayerUID })
        // }
        // onPressChangeLiveStatus(data,isLive)
    }

    //endregion

    //region functions
    open() {
        this.refs["moreAction"].open();
    }

    generateOption(data) {
        let options = [];
        if (data) {
            const {owner = {}, status, following = [], isLive} = data;
            const {uid = {}} = owner;
            if (uid === firebase.auth().currentUser.uid) {
                options = options.concat([
                    {text: I18n.t('edit'), onPress: this.onPressEdit.bind(this)},
                    {text: I18n.t('delete'), color: Colors.red, onPress: this.onPressDelete(data)}
                ]);
                if (status !== StatusOfPray.COMPLETE) {
                    options = options.concat(
                        {text: I18n.t('updateToFinish'), onPress: this.onPressUpdatePrayerStatus(false)},
                        {text: I18n.t("share"), onPress: this.onPressShare(data)}
                    );

                    if (isLive) {
                        options = options.concat(
                            {text: I18n.t('disablePublic'), onPress: this._onPressChangeLiveStatus(data,false)},
                        );
                    }
                    else {
                        options = options.concat(
                            {text: I18n.t('public'), onPress: this._onPressChangeLiveStatus(data,true)},
                        );
                    }

                }
                else {
                    options = options.concat(
                        {text: I18n.t('continuesPraying'), onPress: this.onPressUpdatePrayerStatus(true)},
                    );
                }
            }
            else {
                if(Array.isArray(following) && following.length > 0){
                    let hadFollow = following.find(e => e && e === firebase.auth().currentUser.uid);
                    if (hadFollow) {
                        options = options.concat([
                            {text: I18n.t('unFollowing'), onPress: this.onPressUpdateFollowingStatus(data,false)},
                        ]);
                    }
                    else {
                        options = options.concat([
                            {text: I18n.t('following'), onPress: this.onPressUpdateFollowingStatus(data,true)},
                        ]);

                    }
                }
            }
        }
        this.optionActionSheet = options;
    }

    //endregion

    //region rendering

    render() {
        const {...rest} = this.props;
        return (
            <ActionSheet
                key="moreAction"
                options={this.optionActionSheet}
                ref={"moreAction"}
                {...rest}
            />
        );
    }

    //endregion
}

ActionPrayerModal.defaultProps = {
    onPressDelete: () => {
    },
    onPressShare: () => {
    },
    onPressPublic: () =>{
    }
};

ActionPrayerModal.propTypes = {
    navigation: Proptypes.any.isRequired,
    data: Proptypes.any.isRequired,
    action: Proptypes.any.isRequired,
    onPressDelete: Proptypes.func,
    onPressShareOption: Proptypes.func,
    onPressChangeLiveStatus : Proptypes.func,
};