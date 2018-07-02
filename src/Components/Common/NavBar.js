// Libraries
import React, { PureComponent } from 'react';
import { Platform, View, TouchableOpacity, Text, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

// Utilities
import { Colors, Metrics,Images } from '../../Themes';

//Components
import Button from './Button';

const widthOfIcon = Platform.OS === 'ios' ? 60 : 50;

export default class NavBar extends PureComponent {

    render() {
        const { title, onPressLeftButton, onPressRightButton, iconLeft , iconRight} = this.props;

        let leftButtonView = (
            <View style ={styles.emptyIcon}/>
        );
        let rightButtonView = (
            <View  style ={styles.emptyIcon}/>
        );

        if(iconLeft){
            leftButtonView = (
                <TouchableOpacity style ={styles.leftIconWrapper}>
                    <Image source={iconLeft}/>
                </TouchableOpacity>
            );
        }

        if(iconRight){
            rightButtonView = (
                <TouchableOpacity style ={styles.rightIconWrapper}>
                    <Image source={iconRight}/>
                </TouchableOpacity>
            );
        }





        return (
            <View style={styles.container}>
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
    onPressLeftButton: () => { },
    onPressRightButton: () => { },
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
        shadowOffset :{
            height : 1,
            // width :100
        },
        shadowRadius : 2,
        shadowColor :Colors.black,
        shadowOpacity : 1,
    },

    emptyIcon :{
      width :widthOfIcon
    },

    titleWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    titleText: {
        fontSize: 20,
        color: Colors.white,
        fontFamily:"Roboto-Bold"
    },

    leftIconWrapper: {
        justifyContent: 'center',
        width :widthOfIcon,
        paddingLeft: 20,
    },

    rightIconWrapper: {
        justifyContent: 'center',
        alignItems:"flex-end",
        paddingRight : 20,
        width :widthOfIcon,
    }
});