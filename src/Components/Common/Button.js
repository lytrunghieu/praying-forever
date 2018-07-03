// Libraries
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

// Utilities
import {Colors, Fonts} from '../../Themes';

export default class Button extends PureComponent {


    render() {
        let {onPress, text} = this.props;
        return (
            <TouchableOpacity onPress={() => onPress()}
                              style={[styles.container]}>
                <Text style={styles.labelText}>{text}</Text>
            </TouchableOpacity>
        )
    }
}

Button.defaultProps = {
    onPress: () => {
    },
    text : ""
};

Button.propTypes = {
    onPress: PropTypes.func,
    text : PropTypes.string.isRequired,
}


const styles = EStyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        width: 106,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
    },

    labelText: {
        color: Colors.white,
        fontSize: 18,
        fontFamily: Fonts.type.robotoMedium

    },

});