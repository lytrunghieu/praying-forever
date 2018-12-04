import React, {Component} from 'react';
import {View} from "react-native";
import {Form, Text,Input} from "../Common"
import {Container, Header, Content ,Item, Label} from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Fonts,Colors} from "../../Themes";

export default class FormValidateComponent extends Component {

    focus() {
        this.refs["input"].focus();
    }

    render() {
        const {success = false, errorText, error = false, ...rest} = this.props;
        return (
            <View>
                <Form>
                    <Item success={success} error={error}>
                        <Input
                            ref={"input"}
                            {...rest}
                        />
                    </Item>
                </Form>
                <View style={styles.errorContainer}>
                    <Text style ={styles.textError}>{error ? errorText : ""}</Text>
                </View>
            </View>
        );
    }
}

const styles = EStyleSheet.create({

    errorContainer :{
      paddingLeft: "$padding"
    },

    textError: {
        fontSize: Fonts.size.small,
        fontFamily: Fonts.type.robotoRegular,
        color: Colors.red
    },

});