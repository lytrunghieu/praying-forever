import React, {PureComponent} from "react";
import {View, TextInput} from "react-native";
import {Colors, Fonts, ApplicationStyles} from "../../Themes"
import EStyleSheet from 'react-native-extended-stylesheet';

import { Textarea} from "native-base";

export default class TextAreaComponent extends PureComponent {


    constructor(props){
        super(props);

    }

    focus(){
        this.refs["_textArea"]._root.focus();
    }

    render() {
        const  { placeholder,...rest} = this.props;
        return(
            <Textarea ref="_textArea" rowSpan={5} bordered placeholder={placeholder} {...rest} />
        );

        return (
            <View style={[styles.container,ApplicationStyles.screen.shadowContainer]}>
                <TextInput
                    ref ="textInput"
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    style={styles.textInput}
                    {...this.props}
                    multiline ={true}
                />
            </View>
        )
    }

}

const styles = EStyleSheet.create({

    container: {
        backgroundColor: Colors.primary,
        padding: 10,
        height: 162,
        width :"100%"
    },

    textInput :{
        color :Colors.black,
        fontSize : Fonts.size.large,
        fontFamily : Fonts.type.robotoLightItalic,
    }

});

