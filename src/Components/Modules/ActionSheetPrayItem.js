import React, {PureComponent} from "react";
import ActionSheet from "../Common/ActionSheet";
import EStyleSheet from 'react-native-extended-stylesheet';
import {View} from "react-native";
import {Colors, ApplicationStyles} from "../../Themes";
import PropTypes from 'prop-types';
import I18n from '../../I18n';
import {EventRegisterTypes} from "../../Constants";
import {Container, Header, Content, Spinner} from 'native-base';
import {CommonUtils} from '../../Utils';

export default class ActionSheetPrayItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            options: []
        };
        this.onClosed = this.onClosed.bind(this);
    }

    onClosed() {
        this.setState({
            options: []
        });
    }


    open(item) {
        const { onPressShare} = this.props;
        const {owner, status, isLive} = item;
        this.refs["_actionSheet"].open();
        let options = [
            {
                text: "delete"
            },
            {
                text: "complete"
            },
            {
                text: "share",
                onPress : onPressShare(item)
            },
        ];

        if (status === 1) {
            options = [
                {
                    text: "delete"
                },
                {
                    text: "continue"
                },
            ];
        }
        else {
            if (isLive) {
                options.push({
                    text: "remove public"
                });
            }
            else {
                options.push({
                    text: "public"
                });
            }
        }


        this.setState({
            options
        });
    }


    render() {
        const {options} = this.state;
        return (
            <ActionSheet options={options}
                         onClosed={this.onClosed}
                         ref="_actionSheet"
                         submitText={"Cancle"}
            />
        )
    }
}

ActionSheetPrayItem.defaultProps = {}

ActionSheetPrayItem.propTypes = {}

const styles = EStyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
    },

});