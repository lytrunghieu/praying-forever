// Libraries
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

import {Colors, Fonts} from '../../Themes';

export default class Button extends PureComponent {


    render() {
        let {onPress, text , fit,width, textColor} = this.props;
        return (
            <TouchableOpacity onPress={() => onPress()}
                              style={[styles.container ,{width : width} , fit && styles.fit]}>
                <Text style={[styles.labelText ,{color : textColor}]}>{text}</Text>
            </TouchableOpacity>
        )
    }
}

Button.defaultProps = {
    onPress: () => {
    },
    text: "",
    fit: false,
    width: 184,
    textColor : Colors.white
};

Button.propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string.isRequired,
    fit : PropTypes.bool,
    width : PropTypes.number,
    textColor : PropTypes.string,
}


const styles = EStyleSheet.create({
    container: {
        backgroundColor: Colors.black,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 21,
    },

    fit : {
        width: null,
        flex : 0,
    },

    labelText: {
        fontSize: 18,
        fontFamily: Fonts.type.robotoMedium

    },

});