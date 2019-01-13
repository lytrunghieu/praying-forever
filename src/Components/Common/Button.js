// Libraries
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import {TextBase,Icon} from '../Common';

import {Colors, Fonts} from '../../Themes';

import {Button, StyleProvider} from 'native-base';

export default class ButtonComponent extends PureComponent {


    render() {
        const {onPress, children, transparent, action, rounded, iconLeft, icon, text,large, center, ...rest } = this.props;

        if (rounded) {
            return (
                <Button
                    style={[styles.roundedStyle,center ? styles.center : null]}
                    rounded small onPress={onPress}
                >
                    {
                        iconLeft && icon && <Icon dark={false} name={icon}/>
                    }


                    <TextBase bold={true} highlight={true}>{text && text.toUpperCase()}</TextBase>
                    {
                        !iconLeft && icon && <Icon dark={false} name={icon}/>
                    }
                </Button>
            )
        }


        return (

            <Button transparent={transparent} onPress={onPress}  {...rest}  >
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
    transparent: false

};

ButtonComponent.propTypes = {
    transparent: PropTypes.bool,
    text : PropTypes.string,
    icon : PropTypes.string,
    iconLeft : PropTypes.bool,
    rounded: PropTypes.bool

}


const styles = EStyleSheet.create({

    // backgroundColor :{
    //   backgroundColor:Colors.black
    // },
    //
    // container: {
    //     alignItems: "center",
    //     justifyContent: "center",
    // },
    //
    // fit: {
    //     width: "100%",
    //     flex: 0,
    // },

    roundedStyle: {
        backgroundColor: Colors.black,
        flexDirection: "row",
        justifyContent: "center",
        minWidth: 100,
    },

    center:{
        alignSelf:"center"
    },


    labelText: {
        fontSize: Fonts.size.large,
        fontFamily: Fonts.type.robotoRegular

    },

});