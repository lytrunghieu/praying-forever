// Libraries
import React, {PureComponent} from 'react';
import {StatusBar, View} from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

import {Colors, IconName} from '../../Themes';

import {Icon, Title, Button, TextBase, Input,} from "../Common";
import LoadingIndicator from "./loadingIndicator";

import {Header as HeaderBase, Left, Body, Right, Item} from 'native-base';
import I18n from "../../I18n";

export default class Header extends PureComponent {

    render() {
        const {title, right, left, isFetching, searchBar, keySearch, onChangeTextSearch, onCloseSearchBar, ...rest} = this.props;

        let leftComp = null;
        let righComp = null;

        if (left) {
            const {icon, onPress} = left;
            leftComp = (
                <Left>
                    <Button transparent onPress={onPress}>
                        <Icon name={icon} dark={false}/>
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
                                        <Icon name={icon} dark={false}/>
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
                        <Icon name={icon} dark={false}/>)
                    </Button>
                );
            }

        }

        return (
            [
                !searchBar ?
                    <HeaderBase style={styles.header}>
                        <StatusBar
                            backgroundColor={Colors.black}
                            barStyle="light-content"
                        />
                        {leftComp}
                        <Body>
                        <TextBase largeX={true} highlight={true} bold={true}>{title}</TextBase>
                        </Body>
                        {righComp}
                    </HeaderBase>

                    :
                    <HeaderBase searchBar rounded style={styles.header}>
                        <Item>
                            <View style={styles.iconSearchWrapper}>
                                <Icon name={IconName.search}/>
                            </View>
                            <Input placeholder={I18n.t("inputKeyword")} value={keySearch}
                                   onChangeText={onChangeTextSearch}>
                            </Input>
                            <Button onPress={onCloseSearchBar} transparent={true} style={styles.buttonCloseWrapper}>
                                <Icon name={IconName.close}/>
                            </Button>

                        </Item>

                    </HeaderBase>
                ,
                <LoadingIndicator visible={isFetching}/>
            ]
        );
    }
}

Header.defaultProps = {
    onChangeTextSearch: () => {
    },
    onCloseSearchBar: () => {
    }
};

Header.propTypes = {
    title: PropTypes.string.isRequired,
    right: PropTypes.node,
    left: PropTypes.node,
    isFetching: PropTypes.bool,
    keySearch: PropTypes.string,
    searchBar: PropTypes.bool,
    onChangeTextSearch: PropTypes.func,
    onCloseSearchBar: PropTypes.func
}

const styles = EStyleSheet.create({

    header: {
        backgroundColor: Colors.black,
        borderBottomWidth: "$borderWidthSmall",
        borderBottomColor: Colors.divider
    },

    iconSearchWrapper: {
        paddingLeft: 5,
        paddingRight: 5,
    },

    buttonCloseWrapper: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop :0,
    }

});