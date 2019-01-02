// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';

import {Colors} from '../../Themes';
import {Button, Icon, Text} from "../Common";

import {ListItem, Left, Body,Right,Card,CardItem, Badge} from 'native-base';

export default class OptionButtonComponent extends PureComponent {


    render() {
        let {onPress, text, leftIcon, count} = this.props;
        return (
            <ListItem icon={true} button={true} onPress={onPress}>
                <Left>
                    <Icon iconType={"MaterialCommunityIcons"} name={leftIcon}/>

                </Left>
                <Body>
                    <Text>{text}</Text>
                </Body>

                <Right>
                    {
                        count ?
                        <Badge>
                            <Text>{count}</Text>
                        </Badge> : null
                    }

                </Right>

            </ListItem>

        )
    }
}

OptionButtonComponent.defaultProps = {
    onPress: ()=>{},
    // leftIcon : null,
    text : "",
    count : 0
};

OptionButtonComponent.propTypes = {
    count: PropTypes.number,
    onPress: PropTypes.func,
    // leftIcon: PropTypes.node,
    text :PropTypes.string.isRequired
};


const styles = EStyleSheet.create({
    // container: {
    //     alignItems: "center",
    //     justifyContent: "center",
    //     flexDirection:"row",
    // },
    //
    // leftIcon :{
    //     marginRight:"$paddingSmall"
    // },
    //
    // labelText: {
    //     fontSize: Fonts.size.normal,
    //     fontFamily: Fonts.type.robotoRegular
    //
    // },

});