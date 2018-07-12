// Libraries
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Fonts} from '../../Themes';

export default class Button extends PureComponent {


    render() {
        let {onPress, text , fit} = this.props;
        return (
            <TouchableOpacity onPress={() => onPress()}
                              style={[styles.container , fit && styles.fit]}>
                <Text style={styles.labelText}>{text}</Text>
            </TouchableOpacity>
        )
    }
}

Button.defaultProps = {
    onPress: () => {
    },
    text: "",
    fit: false,
};

Button.propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string.isRequired,
    fit : PropTypes.bool
}


const styles = EStyleSheet.create({
    container: {
        backgroundColor: Colors.black,
        width: 184,
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
        color: Colors.white,
        fontSize: 18,
        fontFamily: Fonts.type.robotoMedium

    },

});