// Libraries
import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';

import {Colors, Fonts} from '../../Themes';
import {Button, Text} from "../Common";

export default class ButtonFooterComponent extends PureComponent {


    render() {
        const {onPress, disabled, children, text, ...rest} = this.props;
        return (
            <Button style={[styles.button, disabled && styles.buttonDisabled]} disabled={disabled} transparent={false}
                    block textStyle={styles.labelText} onPress={onPress} {...rest}>
                {text ?
                    <Text>{text}</Text> : null
                }
                {children}
            </Button>
        );

        // let {onPress, text, fit, width, textColor, customeBorder, backgroundColor, borderWidth, borderColor, height, borderRadius} = this.props;
        //
        // const styleContainerOption = {
        //     width: width, backgroundColor: backgroundColor, height: height,
        //     borderRadius: borderRadius,
        // };
        //
        // const styleCustomBorder = customeBorder && {
        //     borderWidth: borderWidth, borderColor: borderColor
        // };
        //
        // return (
        //     <TouchableOpacity onPress={() => onPress()}
        //                       style={[styles.container, styleContainerOption, styleCustomBorder, fit && styles.fit]}>
        //         <Text style={[styles.labelText, {color: textColor}]}>{text}</Text>
        //     </TouchableOpacity>
        // )
    }
}

ButtonFooterComponent.defaultProps = {
    transparent: true
};

ButtonFooterComponent.propTypes = {}


const styles = EStyleSheet.create({

    button: {
        backgroundColor: Colors.black,
        margin: "$padding",
    },


    buttonDisabled: {
        backgroundColor: Colors.disable,
    },


    labelText: {
        fontSize: Fonts.size.large,
        fontFamily: Fonts.type.robotoRegular,
        color: Colors.white
    },

});