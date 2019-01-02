import React, {PureComponent} from "react"
import {Text} from "react-native";
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Fonts} from "../../Themes";

export default class TextBase extends PureComponent {

    render() {
        const {
            style, children,
            large,
            largeX,
            medium,
            small,
            bold,
            italic,
            regular,
            error,
            normal,
            highlight
        } = this.props;
        const stringText = children || "";
        const customeStyle = {
            fontFamily: italic && Fonts.type.robotoItalic || bold && Fonts.type.robotoBold || Fonts.type.robotoRegular,
            fontSize:  largeX && Fonts.size.largeX ||  large && Fonts.size.large || small && Fonts.size.small || Fonts.size.normal,
            color : highlight && Colors.white || error && Colors.red || Colors.black ,
        }
        return (<Text {...this.props} style={[styles.text , customeStyle, style ]}>{stringText}</Text>);
    }
}

TextBase.defaultProps = {
    numberOfLines: 1,
    allowFontScaling: false,
    style: null,
    largeX :false,
    large: false,
    small: false,
    bold: false,
    italic: false,
    error: false,
    highlight: false,
};

TextBase.propTypes = {
    text: PropTypes.string,
    numberOfLines: PropTypes.number,
    largeX: PropTypes.bool,
    large: PropTypes.bool,
    small: PropTypes.bool,
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    error: PropTypes.bool,
    highlight: PropTypes.bool
};

const styles = EStyleSheet.create({
    text: {
        color: Colors.black,
        fontSize: Fonts.size.large,
        fontFamily: Fonts.type.robotoRegular,
    }
})