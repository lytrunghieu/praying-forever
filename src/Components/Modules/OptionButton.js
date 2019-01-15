// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';

import {Colors,IconName} from '../../Themes';
import {Button, Icon, TextBase} from "../Common";

import {ListItem, Left, Body, Right, Card, CardItem, Badge} from 'native-base';

export default class OptionButtonComponent extends PureComponent {


    render() {
        let {onPress, text, leftIcon, count, countRed,arrow,...rest} = this.props;

        let _count = count;
        if (count && parseInt(count) > 99) {
            _count = "99+"
        }
        return (
            <ListItem icon={true} button={true} style={styles.container} onPress={onPress}  {...rest}>
                <Left>
                    {leftIcon && <Icon iconType={"MaterialCommunityIcons"} name={leftIcon}/>}
                </Left>
                <Body>
                <TextBase>{text}</TextBase>
                </Body>
                <Right>
                    {
                        count ?
                            countRed ?
                                <Badge style={styles.badgeWrapper}>
                                    <TextBase bold={true} highlight={true}>{_count}</TextBase>
                                </Badge> :
                                <TextBase bold={true}>{_count}</TextBase> : null
                    }
                    {
                        arrow && <Icon name ={IconName.angleRight}/>
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
    countRed: PropTypes.bool,
    leftIcon: PropTypes.any,

};


const styles = EStyleSheet.create({
    container: {
    },


    badgeWrapper: {
        justifyContent: "center",
        minWidth: 26,
        height: 26,
        maxWidth: 100,
        alignItems: "center"
    }
});