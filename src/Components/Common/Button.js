// Libraries
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';

import {Colors, Fonts} from '../../Themes';

import {Button} from 'native-base';

export default class ButtonComponent extends PureComponent {


    render() {
        const {onPress,children , transparent} = this.props;
        return (
            <Button transparent ={transparent} onPress={onPress} {...this.props}>
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

ButtonComponent.defaultProps = {
    transparent :false
    // onPress: () => {
    // },
    // text: "",
    // fit: false,
    // width: 184,
    // textColor: Colors.white,
    // borderWidth: globalStyle.$borderWidthNormal,
    // borderColor: Colors.black,
    // backgroundColor: Colors.black,
    // borderRadius: globalStyle.$borderRadiusLarge,
    // customeBorder: false,
    // height: globalStyle.$heightRowSmall,

};

ButtonComponent.propTypes = {
    // onPress: PropTypes.func,
    // text: PropTypes.string.isRequired,
    // fit: PropTypes.bool,
    // width: PropTypes.number,
    // textColor: PropTypes.string,
    // borderWidth: PropTypes.number,
    // borderColor: PropTypes.string,
    // customeBorder: PropTypes.bool,
    // backgroundColor: PropTypes.string,
    // height: PropTypes.number,
    // borderRadius: PropTypes.number,
}


const styles = EStyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },

    fit: {
        width: "100%",
        flex: 0,
    },

    labelText: {
        fontSize: Fonts.size.large,
        fontFamily: Fonts.type.robotoRegular

    },

});