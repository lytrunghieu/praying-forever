import React, {PureComponent} from "react";
import {View, TextInput} from "react-native";
import {Colors, Fonts, ApplicationStyles} from "../../Themes"
import EStyleSheet from 'react-native-extended-stylesheet';

export default class TextArea extends PureComponent {


    constructor(props){
        super(props);

    }

    focus(){
        this.refs["textInput"].focus();
    }

    render() {
        return (
            <View style={[styles.container,ApplicationStyles.screen.shadowContainer]}>
                <TextInput
                    ref ="textInput"
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

