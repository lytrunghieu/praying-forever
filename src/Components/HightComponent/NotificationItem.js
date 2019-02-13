import React, {PureComponent} from 'react';
import {View, TouchableOpacity, TouchableHighlight} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Colors, IconName} from '../../Themes';
import {TextBase, Button, Icon} from "../Common";
import moment from "moment";
import I18n from "../../I18n/index";
import { contentCodes,EventRegisterTypes,ScreenKey} from "../../Constants";
import Avatar from "../Modules/Avatar";
import {CommonUtils} from "../../Utils";
import {Left, Body, List, ListItem} from 'native-base';
import {connect} from 'react-redux';

class NotificationItem extends PureComponent {

    constructor(props) {
        super();
        this._onPress = this._onPress.bind(this);
        this._onPressMore = this._onPressMore.bind(this);
        this.onPressAvatar = this.onPressAvatar.bind(this);
        this.state = {
            from: this.retriveData(props)
        }

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.profilesReducer.payload !== this.props.profilesReducer.payload){
            this.setState({
                from: this.retriveData(nextProps)
            })
        }
    }

    retriveData(props){
        const {payload} = props.profilesReducer;
        const {item} = props;
        const {from } = item;

        if(!Array.isArray(payload) || payload.length ===0 ){
            return null;
        }
        const findUser = payload.find(e => e.uid === from.uid);
        return findUser;
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
        const {item = {}} = this.props;
        const {from = {}} = this.state;
        const {created, contentCode, isRead} = item;
        const {displayName = "" , avatarURL} = from;
        let content = "";
        let componentContent = null;
        let _displayName = "";
        let _avatarURL = "";
        if(from){
            _displayName = displayName;
            _avatarURL = avatarURL;
        }
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
                            uri={_avatarURL} large={true}/>
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

    buttonMore :{
      height : "100%",
        paddingRight:"$padding",
        paddingLeft:"$padding",
        justifyContent:"center",
    },

});


const mapStateToProps = (state) => ({
    profilesReducer: state.profilesReducer
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationItem);