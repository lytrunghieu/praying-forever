import React, {PureComponent} from 'react';
import {ScreenKey, StatusOfPray, EventRegisterTypes} from '../../../Constants/index';
import {Colors} from '../../../Themes/index';
import I18n from '../../../I18n/index';
import {
    ActionSheet,
} from '../../../Components/Common/index';
import firebase from 'react-native-firebase';
import Proptypes from "prop-types";
import {CommonUtils} from "../../../Utils/index";

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

    _onPressUpdateReadStatus = (data, read) => () => {
        const {onPressUpdateReadStatus} = this.props;
        onPressUpdateReadStatus(data , read);
        // CommonUtils.sendEvent({type: EventRegisterTypes.UPDATE_READ_STATUS_NOTIFICATION, params: {notifiUID}});
    }

    _onPressDelete = (data) => () => {
        const {onPressDelete} = this.props;
        onPressDelete(data);
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
            const {isRead} = data;
            options = options.concat([
                {text: I18n.t('delete'), color: Colors.red, onPress: this._onPressDelete(data)}
            ]);
            if (isRead) {
                options.push(
                    {text: I18n.t('markUnread'), color: Colors.red, onPress: this._onPressUpdateReadStatus(data, false)}
                )
            }
            else {
                options.push(
                    {text: I18n.t('markRead'), color: Colors.red, onPress: this._onPressUpdateReadStatus(data, true)}
                );
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
    onPressDelete : () =>{},
    onPressUpdateReadStatus : () =>{},
};

ActionPrayerModal.propTypes = {
    onPressDelete : Proptypes.func,
    onPressUpdateReadStatus : Proptypes.func,
};