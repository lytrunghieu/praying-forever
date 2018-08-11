import React,{PureComponent} from "react"

import TextBase from "./TextBase";
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Fonts} from "../../Themes";

export  default class TextLink extends PureComponent {

    render(){
        const {text,isRed} = this.props;
        return (<TextBase {...this.props} style ={[styles.text , isRed && {color : Colors.red}] }>{text}</TextBase>);
    }
}

TextLink.defaultProps = {
    isRed : false
};

TextLink.propTypes = {
    text : PropTypes.string.isRequired,
    isRed : PropTypes.bool
};

const styles = EStyleSheet.create({
    text : {
        color :Colors.blue,
    },
})