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
            <Textarea style={styles.container} ref="_textArea" rowSpan={5} bordered placeholder={placeholder} {...rest} />
        );

    }

}

const styles = EStyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
    },

});

