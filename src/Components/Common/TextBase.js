import React,{PureComponent} from "react"
import {Text} from "react-native";
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Fonts} from "../../Themes";

export  default class TextBase extends PureComponent {

    render(){
        const {style,children} = this.props;
        const stringText = children || "";
        return (<Text {...this.props} style ={[styles.text, style]}>{stringText}</Text>);
    }
}

TextBase.defaultProps = {
    numerOfLines : 1,
    allowFontScaling : false,
    style : null
};

TextBase.propTypes = {
    text : PropTypes.string,
    numerOfLines : PropTypes.number,
    style : PropTypes.oneOfType([PropTypes.number , PropTypes.object])
};

const styles = EStyleSheet.create({
    text : {
        color :Colors.red,
        fontSize : Fonts.size.large,
        fontFamily : Fonts.type.robotoRegular,
    }
})