// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';

import {Colors} from '../../Themes';
import {Button, Icon, TextBase} from "../Common";

import {ListItem, Left, Body, Right, Card, CardItem, Badge} from 'native-base';

export default class OptionButtonComponent extends PureComponent {


    render() {
        let {onPress, text, leftIcon, count, countRed} = this.props;
        return (
            <ListItem icon={true} button={true} onPress={onPress}>
                <Left>
                    <Icon iconType={"MaterialCommunityIcons"} name={leftIcon}/>

                </Left>
                <Body>
                <TextBase>{text}</TextBase>
                </Body>

                <Right>
                    {
                        count ?
                            countRed ?
                                <Badge>
                                    <TextBase>{count}</TextBase>
                                </Badge> : <TextBase>{count}</TextBase> : null
                    }

                </Right>

            </ListItem>

        )
    }
}

OptionButtonComponent.defaultProps = {
    onPress: () => {
    },
    text: "",
    count: 0
};

OptionButtonComponent.propTypes = {
    count: PropTypes.number,
    onPress: PropTypes.func,
    text: PropTypes.string.isRequired,
    countRed: PropTypes.bool
};


const styles = EStyleSheet.create({
});