import React from "react";
import {Text,View,Switch} from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors,Fonts,ApplicationStyles} from '../../Themes';

const SwitchRowItem  =({title ="" , onValueChange = () =>{} ,value }) =>{
    return (
        <View style ={[styles.container,ApplicationStyles.screen.shadowContainer]}>
            <Text numberOfLines ={1} style ={[styles.text, !value && {color : Colors.gray}]}>{title}</Text>
            <Switch
                value ={value}
                onTintColor ={Colors.black}
                onValueChange ={onValueChange}
            />
        </View>
    )
}

const styles = EStyleSheet.create({

    container : {
        height :"$heightRow",
        width :"100%",
        paddingLeft:"$padding",
        paddingRight:"$padding",
        backgroundColor :Colors.primary,
        flexDirection:"row",
        alignItems:"center",
    },

    text :{
        flex : 1,
        fontFamily: Fonts.type.robotoRegular,
        fontSize: Fonts.size.normal,
        color : Colors.black,
    },

});

export  default SwitchRowItem;