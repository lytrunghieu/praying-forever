import React, {PureComponent} from "react";
import {View, TextInput, Image, TouchableOpacity} from "react-native";
import {Separator} from "./";
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Colors, Fonts, Images, ApplicationStyles} from "../../Themes"

export default class Input extends PureComponent {

    constructor(props){
        super(props);
    }

    focus(){
        this.refs["input"].focus();
    }

    render() {
        const {value,onPressRightIcon,fit} = this.props;
        return (
            <View style={[styles.container, fit && styles.containerFit]}>
                <TextInput
                    style={styles.textInput}
                    {...this.props}
                    ref ={"input"}
                />
                {value &&
                <TouchableOpacity
                    style={styles.rightIcon}
                    onPress ={onPressRightIcon}
                >
                    <Image

                        source={Images.close}
                    />
                </TouchableOpacity> || null
                }

                <Separator bottom={10} padding={10}/>

            </View>
        );
    }
}

Input.defaultProps = {
    onChangeText: () => {},
    onPressRightIcon : () =>{},
    fit : false,
};

Input.propTypes = {
    onChangeText : PropTypes.func,
    onPressRightIcon : PropTypes.func,
};


const styles = EStyleSheet.create({

    container: {
        flexDirection: "row",
        height: "$heightRow",
        width: "100%",
        backgroundColor: "transparent",
    },

    textInput: {
        flex: 1,
        paddingLeft: 10,
        fontFamily: Fonts.type.robotoLightItalic,
        fontSize: Fonts.size.large,
        color: Colors.black
    },

    rightIcon: {
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: "center",
    },

  containerFit :{
        flex : 1
  }

});