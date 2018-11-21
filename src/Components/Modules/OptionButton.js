// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';

import {Colors} from '../../Themes';
import {Button, Icon, Text} from "../Common";

import {ListItem, Left, Right, Badge} from 'native-base';

export default class OptionButtonComponent extends PureComponent {


    render() {
        let {onPress, text, leftIcon, count} = this.props;
        return (
            <ListItem button={true} onPress={onPress}>
                <Left>
                    <Button transparent>
                        <Icon name={leftIcon}/>
                        <Text>{text}</Text>
                    </Button>
                </Left>
                <Right>
                    <Badge>
                        <Text>{count}</Text>
                    </Badge>
                </Right>

            </ListItem>

        )
    }
}

OptionButtonComponent.defaultProps = {
    // onPress: null,
    // leftIcon : null,
    // text : ""
};

OptionButtonComponent.propTypes = {
    // onPress: PropTypes.func,
    // leftIcon: PropTypes.node,
    // text :PropTypes.string.isRequired
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