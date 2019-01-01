// Libraries
import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';

import {Colors, Fonts} from '../../Themes';
import {Button, TextBase} from "../Common";

export default class ButtonFooterComponent extends PureComponent {


    render() {
        const {onPress, disabled, children, text, ...rest} = this.props;
        return (
            <Button style={[styles.button, disabled && styles.buttonDisabled]} disabled={disabled} transparent={false}
                    block  onPress={onPress} {...rest}>
                {text ?
                    <TextBase bold={true} large={true} highlight={true} textTransform={"uppercase"} >{text}</TextBase> : null
                }
                {children}
            </Button>
        );
    }
}

ButtonFooterComponent.defaultProps = {
    transparent: true,
    onPress : () =>{},
    disabled : false,
};

ButtonFooterComponent.propTypes = {
    text : PropTypes.string,
    disabled : PropTypes.bool,
    onPress : PropTypes.func
}


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