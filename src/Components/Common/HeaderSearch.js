// Libraries
import React, {PureComponent} from 'react';
import {Platform, View, TouchableOpacity, Text, Image, TextInput} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Images, Fonts} from '../../Themes';
import {Input} from "./"

const widthOfIcon = Platform.OS === 'ios' ? 60 : 50;

export default class HeaderSearch extends PureComponent {

    constructor(props) {
        super(props);
    }


    clear() {
        this.refs.textInput.clear();
    }

    render() {

        const {onPressLeftButton, iconLeft} = this.props;

        let leftButtonView = (
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

        return (
            <View style={styles.container}>
                {leftButtonView}
                <Input {... this.props}/>
            </View>
        )
    }
}

HeaderSearch.defaultProps = {
    onPressLeftButton: () => {
    },
    onPressRightIcon: () => {
    },

    iconLeft: Images.back,
    placeholder: "Search"
};

HeaderSearch.propTypes = {
    onPressLeftButton: PropTypes.func,
    onPressRightIcon: PropTypes.func,
    iconLeft : PropTypes.number

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

    leftIconWrapper: {
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },


});