// Libraries
import React, {PureComponent} from 'react';
import {Platform, View, TouchableOpacity, Text, Image, TextInput} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Images, Fonts} from '../../Themes';

const widthOfIcon = Platform.OS === 'ios' ? 60 : 50;

export default class HeaderSearch extends PureComponent {

    constructor(props) {
        super(props);
    }


    clear() {
        this.refs.textInput.clear();
    }

    render() {

        const {onPressLeftButton, onPressRightButton, onChangeText, iconLeft, iconRight,placeHolderText} = this.props;

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
            <View style={styles.container}>
                {leftButtonView}
                <View style={styles.inputWrap}>
                    <TextInput
                        ref="textInput"
                        style={styles.inputContainer}
                        placeholderTextColor={Colors.white}
                        placeholder={placeHolderText}
                        onChangeText={onChangeText}
                    />
                    <View style={styles.line}/>
                </View>
                {rightButtonView}
            </View>
        )
    }
}

HeaderSearch.defaultProps = {
    onPressLeftButton: () => {
    },
    onPressRightButton: () => {
    },
    onChangeText: () => {
    },
    iconLeft: Images.back,
    iconRight: Images.close,
    placeHolderText: "Search"
};

HeaderSearch.propTypes = {
    onPressLeftButton: PropTypes.func,
    onPressRightButton: PropTypes.func,
    onChangeText: PropTypes.func,
    placeHolderText: PropTypes.string
}

const styles = EStyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        height: Platform.OS === 'ios' ? 60 : 50,
        shadowOffset: {
            height: 1,
        },
        shadowRadius: 2,
        shadowColor: Colors.black,
        shadowOpacity: 1,
    },

    emptyIcon: {
        width: widthOfIcon
    },

    inputWrap: {
        flex: 1
    },

    inputContainer: {
        flex: 1,
        fontSize: 20,
        fontFamily: Fonts.type.robotoThin,
        color: Colors.white,
        fontWeight: "normal"
    },

    line: {
        position: "absolute",
        height: 1,
        width: "100%",
        backgroundColor: Colors.white,
        left: 0,
        bottom: 12
    },

    leftIconWrapper: {
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },

    rightIconWrapper: {
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    }
});