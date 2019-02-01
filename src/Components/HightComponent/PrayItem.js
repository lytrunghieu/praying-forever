// Libraries
import React, {PureComponent} from 'react';
import {View, TouchableOpacity, TouchableHighlight, ActivityIndicator} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {IconName, Colors} from '../../Themes';
import {TextBase, Button, Icon} from "../Common";
import moment from "moment";
import I18n from "../../I18n/index";
import {CommonUtils} from "../../Utils/index";
import {EventRegisterTypes, ScreenKey} from "../../Constants";
import firebase from "react-native-firebase";
import Avatar from "../Modules/Avatar";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {prayerActions} from "../../Action"

import {Card, CardItem, Left, Body, Right} from 'native-base';

class PrayItem extends PureComponent {

    constructor(props) {
        super();
        this.swipeable = null;
        this.recenter = this.recenter.bind(this);
        this.onPress = this.onPress.bind(this);
        this.onPressAvatar = this.onPressAvatar.bind(this);
        this.checkSyncPrayer = this.checkSyncPrayer.bind(this);
        this.state = {
            fetchingSync: false,
        }
    }

    componentDidMount() {
        const {item = {}} = this.props;
    }

    checkSyncPrayer(item) {
        const {owner = {}, uid: prayerUID} = item;
        const {uid: userUID} = owner;
        if (firebase.auth().currentUser && userUID != firebase.auth().currentUser.uid) {
            const {prayerActions} = this.props;
            this.setState({
                fetchingSync: true
            }, () => {
                prayerActions.syncPrayer({prayerUID, userUID}).then(res => {

                }).finally(e =>{
                    this.setState({
                        fetchingSync: false
                    })
                })
            })

        }
        else {
            this.setState({
                fetchingSync: false
            })
        }
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

    onPressAvatar() {
        const {item = {}} = this.props;
        const {owner = {}} = item;
        const {uid} = owner;
        CommonUtils.sendEvent({
            type: EventRegisterTypes.NAVIGATE_SCREEN, params: {
                screen: ScreenKey.PROFILE,
                params: {userUID: uid}
            }
        });
    }


    renderOld(birthDay) {
        if (!moment(birthDay).isValid()) {
            return null
        }

        return ( <TextBase>{moment().years() - moment(birthDay).years() + " " + I18n.t("old")}</TextBase>);
    }

    renderGender(gender) {
        if (!gender) {
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
        const {fetchingSync} = this.state;
        const {title, created, following, owner = {}, content, isLive} = item;
        const {displayName, birthDay, gender, uid} = owner;
        let _displayName = displayName;
        let _isPublic = "";
        let isUser = false;
        if (firebase.auth().currentUser && uid == firebase.auth().currentUser.uid) {
            _displayName = I18n.t("me");
            if (isLive) {
                _isPublic = "(".concat(I18n.t("public")).concat(")")
            }
            isUser = true;
        }

        return (
            fetchingSync ?
                <Card style={styles.fetchingStatusContainer}>
                    <ActivityIndicator size="large" color={Colors.blue}/>
                </Card>
                :
                <Card>
                    <CardItem>
                        <Left>
                            <Avatar
                                onPress={this.onPressAvatar}
                                uid={uid}
                                large={true}
                            />
                            <Body>
                            <View style={styles.userNameWrapper}>
                                <TextBase bold={true}>{_displayName}</TextBase>
                                <View style={styles.space}/>
                                <TextBase success={true} style={styles.publicTextStyle}
                                          bold={true}>{_isPublic}</TextBase>
                            </View>
                            <TextBase italic={true}>{moment(created).fromNow()}</TextBase>
                            </Body>
                        </Left>
                        {
                            !isUser ?
                                <Right>
                                    <Button rounded={true} text={I18n.t("update")}
                                            onPress={this.checkSyncPrayer.bind(this, item)}
                                    />
                                </Right> : null
                        }
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
                            <TextBase large={true} bold={true}
                                      numberOfLines={allowScaleHeight ? 0 : 2}>{title}</TextBase>
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


    userNameWrapper: {
        flexDirection: "row"
    },

    publicTextStyle: {
        minWidth: 30
    },

    space: {
        width: "$padding"
    },

    fetchingStatusContainer: {
        height: 200,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    }

});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    prayerActions: bindActionCreators(prayerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PrayItem);