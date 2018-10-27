import React,{PureComponent} from "react"
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, Fonts} from "../../Themes";
import TextBase from "./TextBase";

export  default class Title extends PureComponent {

    render(){
        const {style,children,color} = this.props;
        let defaultColor = Colors.black;
        switch (color){
            case "white":{
                defaultColor = Colors.white;
                break;
            }
        }
        const stringText = children || "";
        return (<TextBase {...this.props}  style ={[styles.text,{ color : defaultColor}]}>{stringText}</TextBase>);
    }
}

Title.defaultProps = {
    numberOfLines : 1,
    allowFontScaling : false,
    color:"black"
};

Title.propTypes = {
    allowFontScaling : PropTypes.bool,
    numberOfLines : PropTypes.number,
    color: PropTypes.string
};

const styles = EStyleSheet.create({
    text : {
        fontSize: Fonts.size.large,
        fontFamily: Fonts.type.robotoMedium
    }
})