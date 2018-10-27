// Libraries
import React, {PureComponent} from 'react';
import {Platform, View, TouchableOpacity, Text, Image} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Metrics, Images, ApplicationStyles} from '../../Themes';

//Components
import Button from './Button';
import Fonts from "../../Themes/Fonts";

const widthOfIcon = Platform.OS === 'ios' ? 60 : 50;

export default class NavBar extends PureComponent {

    measure() {
        return new Promise((res, rej) => {
            this.refs["container"].measure((ox, oy, width, height, px, py) => {
                //calculate postion
                res({
                    ox: 20,
                    oy: py + height
                });
            });
        });
    }

    render() {
        const {title, onPressLeftButton, onPressRightButton, iconLeft, iconRight, iconRightList} = this.props;

        let leftButtonView = (
            <View style={styles.emptyIcon}/>
        );
        let rightButtonView = (
            <View style={styles.emptyIcon}/>
        );

        let listIconRight = null;

        if (iconLeft) {
            leftButtonView = (
                <TouchableOpacity style={styles.leftIconWrapper}
                                  onPress={onPressLeftButton}
                >
                    <Image source={iconLeft}/>
                </TouchableOpacity>
            );
        }

        if (iconRight) {
            rightButtonView = (
                <TouchableOpacity style={styles.rightIconWrapper}
                                  onPress={onPressRightButton}
                >
                    <Image source={iconRight}/>
                </TouchableOpacity>
            );
        }

        if (iconRightList && iconRightList.length > 0) {
            listIconRight = iconRightList.map((e, index) => {
                const {icon, onPress} = e;
                return <TouchableOpacity style={styles.rightIconWrapper}
                                         disabled ={onPress ? false : true}
                                         onPress={onPress}
                >
                    <Image source={icon}/>
                </TouchableOpacity>
            });
        }

        return (
            <View style={[styles.container, ApplicationStyles.screen.shadowContainer]}
                  ref="container"
            >
                {leftButtonView}
                <View style={[styles.titleWrapper]}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
                {listIconRight}
                {rightButtonView}
            </View>
        )
    }
}

NavBar.defaultProps = {
    title: "",
    onPressLeftButton: () => {
    },
    onPressRightButton: () => {
    },
    iconLeft: null,
    iconRight: null,
    iconRightList: [],
};

NavBar.propTypes = {
    title: PropTypes.string,
    onPressLeftButton: PropTypes.func,
    onPressRightButton: PropTypes.func,
    iconLeft: PropTypes.number,
    iconRight: PropTypes.number,
    iconRightList: PropTypes.array
}

const styles = EStyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        height: Platform.OS === 'ios' ? 50 : 50,
    },

    emptyIcon: {
        width: widthOfIcon
    },

    titleWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    titleText: {
        fontSize: Fonts.size.large,
        color: Colors.black,
        fontFamily: Fonts.type.robotoMedium
    },

    leftIconWrapper: {
        justifyContent: 'center',
        width: widthOfIcon,
        paddingLeft: "$padding",
    },

    rightIconWrapper: {
        justifyContent: 'center',
        alignItems: "flex-end",
        paddingRight: "$padding",
        width: widthOfIcon,
    },

});