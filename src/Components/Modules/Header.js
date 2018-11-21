// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities
import {Colors} from '../../Themes';

import {Icon, Title ,Button} from "../Common";

import {Header as HeaderBase, Left, Body, Right} from 'native-base';

export default class Header extends PureComponent {

    render() {
        const {title, right, left} = this.props;

        let leftComp = null;
        let righComp = null;

        let listIconRight = null;

        if (left) {
            const {icon, onPress} = left;
            leftComp = (
                <Left>
                    <Button transparent onPress={onPress}>
                        <Icon name={icon}/>
                    </Button>
                </Left>
            );

        }

        if (right) {
            if (Array.isArray(right) && right.length > 0) {
                righComp = (
                    <Right>
                        {
                            right.map((e, index) => {
                                const {icon, onPress} = e;
                                return (
                                    <Button key={index} transparent onPress={onPress}>
                                        <Icon name={icon}/>
                                    </Button>
                                );
                            })
                        }
                    </Right>)
            }
            else {
                const {icon, onPress} = right;
                righComp = (
                    <Button transparent onPress={onPress}>
                        <Icon name={icon}/>)
                    </Button>
                );
            }

        }

        return (
            <HeaderBase style={styles.header}>
                {leftComp}
                <Body>
                <Title>{title}</Title>
                </Body>
                {righComp}
            </HeaderBase>
        )

        return (
            <View style={[styles.container, ApplicationStyles.screen.shadowContainer]}
                  ref="container"
            >
                {leftComp}
                <View style={[styles.titleWrapper]}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
                {listIconRight}
                {righComp}
            </View>
        )
    }
}

Header.defaultProps = {};

Header.propTypes = {}

const styles = EStyleSheet.create({

    header: {
        backgroundColor: Colors.white
    }

});