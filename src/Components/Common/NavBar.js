// Libraries
import React, {PureComponent} from 'react';
import {Platform, View, TouchableOpacity, Text, Image} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Metrics, Images,ApplicationStyles} from '../../Themes';

//Components
import Button from './Button';
import Fonts from "../../Themes/Fonts";

const widthOfIcon = Platform.OS === 'ios' ? 60 : 50;

export default class NavBar extends PureComponent {

    measure() {
        return new Promise((res, rej) => {
            this.refs["container"].measure((ox, oy, width, height, px,py) => {
                //calculate postion
                res({
                    ox: 20,
                    oy: py + height
                });
            });
        });
    }

    render() {
        const {title, onPressLeftButton, onPressRightButton, iconLeft, iconRight} = this.props;

        let leftButtonView = (
            <View style={styles.emptyIcon}/>
        );
        let rightButtonView = (
            <View style={styles.emptyIcon}/>
        );

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


        return (
            <View style={[styles.container,ApplicationStyles.screen.shadowContainer]}
                  ref="container"
            >
                {leftButtonView}
                <View style={[styles.titleWrapper]}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
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
};

NavBar.propTypes = {
    title: PropTypes.string,
    onPressLeftButton: PropTypes.func,
    onPressRightButton: PropTypes.func,

}

const styles = EStyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        height: Platform.OS === 'ios' ? 60 : 50,
        // shadowOffset: {
        //     height: 1,
        // },
        // shadowRadius: 2,
        // shadowColor: Colors.black,
        // shadowOpacity: 1,
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
    }
});