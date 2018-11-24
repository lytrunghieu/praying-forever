import React,{PureComponent} from "react"
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Fonts} from "../../Themes";

import {Text} from "native-base";

export  default class TextComponent extends PureComponent {

    render(){
        const {children, ...rest} = this.props;
        return (<Text {...rest}>{children}</Text>);
    }
}

TextComponent.defaultProps = {
    // numberOfLines : 1,
    // allowFontScaling : false,
    // style : null
};

TextComponent.propTypes = {
    // text : PropTypes.string,
    // numberOfLines : PropTypes.number,
};

const styles = EStyleSheet.create({
    text : {
        color :Colors.black,
        fontSize : Fonts.size.large,
        fontFamily : Fonts.type.robotoRegular,
    }
})