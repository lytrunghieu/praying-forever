// Libraries
import React, {PureComponent} from 'react';
import {View, TouchableOpacity, TouchableHighlight} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Colors, Fonts, IconName} from '../../Themes';
import {TextBase, Button, Icon} from "../Common";
import moment from "moment";
import I18n from "../../I18n";
import { contentCodes,EventRegisterTypes,ScreenKey} from "../../Constants";
import Avatar from "./Avatar";
import {CommonUtils} from "../../Utils";


import {Left, Body, List, ListItem} from 'native-base';

export default class NotificationItem extends PureComponent {

    constructor(props) {
        super();
        this.swipeable = null;
        this._onPress = this._onPress.bind(this);
        this._onPressMore = this._onPressMore.bind(this);
        this.onPressAvatar = this.onPressAvatar.bind(this);
    }

    _onPressMore() {
        const {item, onPressMore} = this.props;
        onPressMore(item);
    }

    _onPress() {
        const {item, onPress} = this.props;
        onPress(item);
    }

    onPressAvatar() {
        const {item = {}} = this.props;
        const {from = {}} = item;
        const {uid} = from;
        CommonUtils.sendEvent({type: EventRegisterTypes.NAVIGATE_SCREEN, params: {
            screen : ScreenKey.PROFILE,
            params :{userUID: uid}}});
    }

    render() {
        const {item = {}, onPress} = this.props;
        const {created, from = {}, contentCode, isRead} = item;
        const {displayName = "" , uid} = from;
        let content = "";
        let componentContent = null;
        let _displayName = displayName;
        if (contentCode === contentCodes.PRAYER_IS_FINISHED) {
            content = I18n.t("prayerHadFinish");
            let arrString = content.split(",");
            componentContent = <TextBase numberOfLines={3}>
                {
                    arrString.map(s => {
                        if (s === "{displayName}") {
                            return <TextBase bold={true}>{_displayName}</TextBase>
                        }
                        return <TextBase>{s}</TextBase>
                    })
                }
            </TextBase>
        }

        return (
            <List style={[styles.listWrapper, {backgroundColor: isRead ? Colors.transparent : Colors.white}]}>
                <ListItem avatar noBorder iconLeft button={true} onPress ={this._onPress}>
                    <Left
                    >
                        <Avatar
                            onPress={this.onPressAvatar}
                            uid={uid} large={true}/>
                    </Left>
                    <Body
                        style={styles.bodyWrapper}
                    >
                    {componentContent}
                    <TextBase italic={true} disable={true}>{moment(created).fromNow()}</TextBase>
                    </Body>
                    <Button transparent style={styles.buttonMore} onPress ={this._onPressMore}>
                        <Icon name={IconName.more_h}/>
                    </Button>

                </ListItem>
            </List>
        );
    }
}

NotificationItem.defaultProps = {
    onPress: () => {
    },
    onPressMore: () => {
    },
};

NotificationItem.propTypes = {
    item: PropTypes.node,
    onPress: PropTypes.func,
    onPressMore: PropTypes.func,


};

const styles = EStyleSheet.create({

    listWrapper: {
        borderBottomWidth: "$borderWidthSmall",
        borderColor: Colors.gray,
    },


    bodyWrapper: {
        // borderColor: "transparent"
    },

    rightWrapper: {
        // borderColor: "transparent",
        backgroundColor:"red"
    },

    buttonMore :{
      height : "100%",
        paddingRight:"$padding",
        paddingLeft:"$padding",
        justifyContent:"center",
    },

    card: {
        borderRadius: "$borderRadiusNormal",
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