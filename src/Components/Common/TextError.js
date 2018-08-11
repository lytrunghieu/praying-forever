import React,{PureComponent} from "react"
import TextBase from "./TextBase";
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Fonts} from "../../Themes";

export  default class TextError extends PureComponent {

    render(){
        const {text} = this.props;
        return (<TextBase {...this.props} style ={styles.text}>{"*".concat(text)}</TextBase>);
    }
}

TextError.defaultProps = {
};

TextError.propTypes = {
    text : PropTypes.string.isRequired
};

const styles = EStyleSheet.create({
    text : {
        color :Colors.red,
        fontSize : Fonts.size.normal,
    }
})