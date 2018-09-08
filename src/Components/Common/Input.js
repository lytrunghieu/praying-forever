import React, {PureComponent} from "react";
import {View, TextInput, Image, TouchableOpacity} from "react-native";
import {Separator} from "./";
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {Colors, Fonts, Images, ApplicationStyles} from "../../Themes";
import globalStyle from "../../Themes/globalStyle";

export default class Input extends PureComponent {

    constructor(props) {
        super(props);
    }

    focus() {
        this.refs["input"].focus();
    }

    render() {
        const {value, onPressRightIcon, fit,hideCloseIcon, hideDivider, customBorder,customBorderWidth,customBorderColor,customBorderRadius,leftIcon} = this.props;

        return (
            <View style={[styles.container, fit && styles.containerFit, customBorder && {borderWidth: customBorderWidth , borderColor : customBorderColor , borderRadius : customBorderRadius} ]}>
                {
                    leftIcon &&
                        <View style ={[styles.containerLeftIcon,{borderRightWidth:customBorderWidth , borderColor : customBorderColor }]}>
                            <Image source ={leftIcon} />
                        </View> || null
                }

                <TextInput
                    style={styles.textInput}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    {...this.props}
                    ref={"input"}
                />
                {value && !hideCloseIcon &&
                <TouchableOpacity
                    style={styles.rightIcon}
                    onPress={onPressRightIcon}
                >
                    <Image

                        source={Images.close}
                    />
                </TouchableOpacity> || null
                }
                {!hideDivider && <Separator bottom={10} padding={10}/> || null}


            </View>
        );
    }
}

Input.defaultProps = {
    onChangeText: () => {
    },
    onPressRightIcon: () => {
    },
    fit: false,
    leftIcon: null,
    customBorder: false,
    customBorderColor: Colors.black,
    customBorderRadius: globalStyle.$borderRadiusNormal,
    customBorderWidth: globalStyle.$borderWidthNormal,
    hideCloseIcon: false
};

Input.propTypes = {
    onChangeText: PropTypes.func,
    onPressRightIcon: PropTypes.func,
    fit: PropTypes.bool,
    hideDivider: PropTypes.bool,
    leftIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    customBorder: PropTypes.bool,
    customBorderColor: PropTypes.string,
    customBorderRadius: PropTypes.number,
    customBorderWidth: PropTypes.number,
    hideCloseIcon : PropTypes.bool
};


const styles = EStyleSheet.create({

    container: {
        flexDirection: "row",
        height: "$heightRowNormal",
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

    containerFit: {
        flex: 1
    },

    containerLeftIcon :{
        width: "$heightRowNormal",
        height: "$heightRowNormal",
        alignItems:"center",
        justifyContent:"center",
    }

});