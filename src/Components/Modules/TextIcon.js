// Libraries
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text,Image} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import globalStyle from '../../Themes/globalStyle';

import {Colors, Fonts,Images} from '../../Themes';

export default class TextIcon extends PureComponent {


    render() {
        let {onPress, text, leftIcon} = this.props;

        return (
            <TouchableOpacity disabled ={!onPress} onPress={onPress ? onPress : ()=>{}}
                              style={[styles.container]}>

                {leftIcon &&
                    <Image source ={leftIcon} style ={styles.leftIcon}/>
                }
                <Text style={[styles.labelText]}>{text}</Text>
            </TouchableOpacity>
        )
    }
}

TextIcon.defaultProps = {
    onPress: null,
    leftIcon : null,
    text : ""
};

TextIcon.propTypes = {
    onPress: PropTypes.func,
    leftIcon: PropTypes.node,
    text :PropTypes.string.isRequired
};


const styles = EStyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection:"row",
    },

    leftIcon :{
      marginRight:"$paddingSmall"
    },

    labelText: {
        fontSize: Fonts.size.normal,
        fontFamily: Fonts.type.robotoRegular

    },

});