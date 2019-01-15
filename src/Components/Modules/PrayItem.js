// Libraries
import React, {PureComponent} from 'react';
import {View, TouchableOpacity, TouchableHighlight} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Fonts, IconName} from '../../Themes';
import {TextIcon} from "./index";
import {TextBase, Button, Icon} from "../Common";
import moment from "moment";
import I18n from "../../I18n";
import {CommonUtils} from "../../Utils";
import {EventRegisterTypes} from "../../Constants";
import firebase from "react-native-firebase";

import {Card, CardItem, Left, Body, Right} from 'native-base';

export default class PrayItem extends PureComponent {

    constructor(props) {
        super();
        this.swipeable = null;
        this.recenter = this.recenter.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    recenter() {
        this.swipeable.recenter();
    }

    onPress(callback) {
        this.recenter();
        callback();
    }

    onPressMoreAction = (data) => () => {
        CommonUtils.sendEvent({type: EventRegisterTypes.SHOW_PRAYER_OPTION, params: {data}});
    }


    renderOld(birthDay) {
        if (!moment(birthDay).isValid()) {
            return null
        }

        return ( <TextBase>{moment().years() - moment(birthDay).years() + " " + I18n.t("old")}</TextBase>);
    }

    renderGender(gender) {
        if (gender) {
            return <Icon name={IconName.male}/>
        }
        else {
            return <Icon name={IconName.female}/>
        }
    }

    renderFollowingCount(following) {
        if (Array.isArray(following) && following.length > 0) {
            return (
                <Button iconLeft transparent={true}>
                    <Icon name={IconName.following}/>
                    <View style={styles.space}/>
                    <TextBase>{following.length.toString()}</TextBase>
                </Button>
            )
        }
        return null
    }

    render() {
        const {onPress, item = {}, allowScaleHeight, actionMore} = this.props;
        const {title, created, following, owner = {}, content, isLive} = item;
        const {displayName, birthDay, gender, uid} = owner;
        let _displayName = displayName;
        let _isPublic = "";
        if (firebase.auth().currentUser && uid == firebase.auth().currentUser.uid) {
            _displayName = I18n.t("me");
            if(isLive){
                _isPublic = "(".concat(I18n.t("public")).concat(")")
            }
        }


        return (
            <Card>
                <CardItem>
                    <Left>
                        <Icon name={IconName.avatar} large={true}/>
                        <Body>
                        <View style={styles.userNameWrapper}>
                            <TextBase bold={true}>{_displayName}</TextBase>
                            <View style={styles.space}/>
                            <TextBase success={true} style={styles.publicTextStyle} bold={true}>{_isPublic}</TextBase>
                        </View>
                        <TextBase italic={true}>{moment(created).fromNow()}</TextBase>
                        </Body>
                    </Left>
                    {
                        actionMore ?
                            <Right>
                                <Button transparent onPress={this.onPressMoreAction(item)}>
                                    <Icon name={IconName.more_h}/>
                                </Button>
                            </Right> : null
                    }

                </CardItem>
                <CardItem button={true} onPress={onPress}>
                    <Left>
                        <Body>
                        <TextBase large={true} bold={true} numberOfLines={allowScaleHeight ? 0 : 2}>{title}</TextBase>
                        <TextBase numberOfLines={allowScaleHeight ? 0 : 5}>{content}</TextBase>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Left>
                        {this.renderFollowingCount(following)}
                    </Left>
                    <Body style={{justifyContent: "center"}}>
                    {this.renderGender(gender)}
                    </Body>
                    <Right>
                        {this.renderOld(birthDay)}
                    </Right>
                </CardItem>
            </Card>
        );
    }
}

PrayItem.defaultProps = {
    onPress: () => {
    },
    leftOptions: [],
    allowScaleHeight: false,
    actionMore: true
};

PrayItem.propTypes = {
    item: PropTypes.node,
    onPress: PropTypes.func,
    leftOptions: PropTypes.array,
    allowScaleHeight: PropTypes.bool,
    actionMore: PropTypes.bool

};

const styles = EStyleSheet.create({


    userNameWrapper:{
        flexDirection:"row"
    },

    publicTextStyle:{
      minWidth: 30
    },

    card: {
        borderRadius: "$borderRadiusNormal",
    },

    space: {
        width: "$padding"
    },

    cardHeaderContainer: {
        borderTopLeftRadius: "$borderRadiusNormal"
    },

    container: {
        backgroundColor: Colors.primary,
        borderRadius: "$borderRadiusSmall",
    },

    containerButton: {
        flexDirection: 'row',
        width: "100%",
        minHeight: "$heightRowNormal",
        padding: "$paddingSmall"
        // alignItems: "center",
    },

    leftContainer: {
        flex: 1,
        // justifyContent: "center",
    },

    rightContainer: {
        // justifyContent: "center",
        width: 77,
        flex: -1,
        alignItems: "flex-end"
    },

    title: {
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.normal,
        color: Colors.black
    },


    content: {
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.small,
        color: Colors.gray
    },

    date: {
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.small,
        color: Colors.black,
        textAlign: "right"
    },

    optionTextContainer: {
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.black,
        width: 75,
        height: "$heightRowNormal",
    },

    optionText: {
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.normal,
        color: Colors.primary,
    },

    separator: {
        borderRightWidth: "$borderWidthSmall",
        borderColor: Colors.white,
    },

    borderRadius: {
        borderTopLeftRadius: "$borderRadiusSmall",
        borderBottomLeftRadius: "$borderRadiusSmall",
    },

    bottomActionsContainer: {
        flexDirection: "row",
        height: "$heightRowSmall",
        justifyContent: "center",
        borderTopWidth: "$borderWidthSmall",
    },

    bottomActionsOptionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",

    },

    dividerSeparateBottomAction: {
        height: "100%",
        width: 1,
        backgroundColor: Colors.gray
    }


});