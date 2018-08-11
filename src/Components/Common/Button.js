// Libraries
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';

import {Colors, Fonts} from '../../Themes';

export default class Button extends PureComponent {


    render() {
        let {onPress, text, fit, width, textColor, customeBorder, backgroundColor, borderWidth, borderColor, height ,borderRadius} = this.props;

        const styleContainerOption = {
            width: width, backgroundColor: backgroundColor, height: height ,
            borderRadius : borderRadius,
        };

        const styleCustomBorder = customeBorder && {
            borderWidth: borderWidth, borderColor: borderColor
        };

        return (
            <TouchableOpacity onPress={() => onPress()}
                              style={[styles.container, styleContainerOption, styleCustomBorder, fit && styles.fit]}>
                <Text style={[styles.labelText, {color: textColor}]}>{text}</Text>
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
    textColor: Colors.white,
    borderWidth: globalStyle.$borderWidthNormal,
    borderColor: Colors.black,
    backgroundColor: Colors.black,
    borderRadius: globalStyle.$borderRadiusLarge,
    customeBorder: false,
    height: globalStyle.$heightRowSmall,

};

Button.propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string.isRequired,
    fit: PropTypes.bool,
    width: PropTypes.number,
    textColor: PropTypes.string,
    borderWidth: PropTypes.number,
    borderColor: PropTypes.string,
    customeBorder: PropTypes.bool,
    backgroundColor: PropTypes.string,
    height: PropTypes.number,
    borderRadius: PropTypes.number,
}


const styles = EStyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },

    fit: {
        width: null,
        flex: 0,
    },

    labelText: {
        fontSize: Fonts.size.large,
        fontFamily: Fonts.type.robotoRegular

    },

});