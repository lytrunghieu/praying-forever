// Libraries
import React, {PureComponent} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

import {Colors} from '../../Themes';

import {Icon, Title ,Button,TextBase} from "../Common";
import LoadingIndicator from "./loadingIndicator";

import {Header as HeaderBase, Left, Body, Right, Footer} from 'native-base';

export default class Header extends PureComponent {

    render() {
        const {title, right, left, isFetching} = this.props;

        let leftComp = null;
        let righComp = null;

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
            [<HeaderBase style={styles.header}>
                {leftComp}
                <Body>
                <TextBase largeX={true} bold={true} >{title}</TextBase>
                </Body>
                {righComp}
            </HeaderBase>,
               <LoadingIndicator visible ={isFetching}/>
            ]
        );
    }
}

Header.defaultProps = {

};

Header.propTypes = {
    title : PropTypes.string.isRequired,
    right : PropTypes.node,
    left : PropTypes.node,
    isFetching : PropTypes.bool,
}

const styles = EStyleSheet.create({

    header: {
        backgroundColor: Colors.white,
        borderBottomWidth: "$borderWidthSmall",
        borderBottomColor :Colors.divider
    }

});