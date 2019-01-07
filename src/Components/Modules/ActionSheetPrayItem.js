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
import firebase from 'react-native-firebase';

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
        const {onPressShare, onPressDelete, onPressUpdateFollowingStatus, isPublic, onPressUpdateFinishStatus, onPressUpdateLiveStatus} = this.props;
        const {owner, status, isLive, following} = item;
        this.refs["_actionSheet"].open();
        let options = [];

        //Prayer in Pray For Other screen
        if (isPublic) {
            //The Prayer not is own by yourself
            if (owner && owner.uid !== firebase.auth().currentUser.uid) {
                options = [
                    {
                        text: "following",
                        onPress: onPressUpdateFollowingStatus(item)
                    },
                ];
            }
        }
        else {

            //The Prayer  is own by yourself
            if (owner && owner.uid === firebase.auth().currentUser.uid) {
                //The Prayer is Finished
                if (status === 1) {
                    options = [
                        {
                            text: "delete",
                            onPress: onPressDelete(item)
                        },
                        {
                            text: "continue",
                            onPress: onPressUpdateFinishStatus(item)
                        },
                    ];
                }
                else {
                    options = [
                        {
                            text: "delete",
                            onPress: onPressDelete(item)
                        },
                        {
                            text: "finish",
                            onPress: onPressUpdateFinishStatus(item)
                        },
                        {
                            text: "share",
                            onPress: onPressShare(item)
                        }
                    ];
                }

                //The Prayer Status is Live
                if (isLive) {
                    options.push({
                        text: "remove public",
                        onPress: onPressUpdateLiveStatus(item)
                    });
                }
                else {
                    options.push({
                        text: "public",
                        onPress: onPressUpdateLiveStatus(item)
                    });
                }
            }
            else{
                //The Prayer is following
                options = [
                    {
                        text: I18n.t('unFollowing'),
                        onPress: onPressUpdateFollowingStatus(item)
                    },
                ];
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

ActionSheetPrayItem.defaultProps = {
    onPressShare: ()=>{},
    onPressDelete:()=>{},
    onPressUpdateFollowingStatus: ()=>{},
    isPublic: false,
    onPressUpdateFinishStatus: ()=>{},
    onPressUpdateLiveStatus: ()=>{}
}

ActionSheetPrayItem.propTypes = {
    onPressShare: PropTypes.func,
    onPressDelete: PropTypes.func,
    onPressUpdateFollowingStatus: PropTypes.func,
    isPublic: PropTypes.bool,
    onPressUpdateFinishStatus: PropTypes.func,
    onPressUpdateLiveStatus: PropTypes.func
}

const styles = EStyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
    },

});